import { ChangeEvent, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import LuxonUtils from '@date-io/luxon';
import {
  Box,
  makeStyles,
  Typography,
  Grid,
  TextField,
  Switch,
  Chip,
  Button,
  InputAdornment,
} from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
// Hooks
import {
  useAppSelector,
  useAppDispatch,
} from '../../hooks/useAppDispatchSelector';
// Models
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { CoffeeItem } from '../../models/modelResource';
import { SagaActions } from '../../models/redux/sagaResource';
import { ReduxActions } from '../../models/redux/reduxResource';
// Components
import S3Uploader from '../S3Uploader/S3Uploader';
import Snackbars from '../Snackbars/Snackbars';

// Styling
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  textInputs: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  chips: {
    width: '18ch',
  },
  buttons: {
    width: '25ch',
  },
  header: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
  media: {
    height: 200,
    width: 200,
    objectFit: 'cover',
    marginLeft: theme.spacing(5),
  },
  singleOriginBlendSwitchBase: {
    color: theme.palette.primary.main,
  },
  singleOriginBlendSwitchTrack: {
    backgroundColor: theme.palette.primary.main,
    opacity: 0.5,
  },
}));

// EditCoffee contains all the inputs to edit an existing coffee entry
// All editing is done in Redux
export default function EditCoffee() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const coffeeId = Number(useParams<{ id: string }>().id);
  const flavors = useAppSelector((store) => store.flavors);
  const oneCoffee = useAppSelector((store) => store.oneCoffee);
  const {
    roaster,
    roastDate,
    isBlend,
    blendName,
    country,
    producer,
    region,
    elevation,
    cultivars,
    processing,
    notes,
    coffeePic,
    flavorsArray,
    brewing,
  } = oneCoffee;
  const [roasterError, setRoasterError] = useState<boolean>(false);
  const [blendCountryError, setBlendCountryError] = useState<boolean>(false);

  useEffect(() => {
    dispatch({ type: SagaActions.FETCH_FLAVORS });
    dispatch({ type: SagaActions.FETCH_ONE_COFFEE, payload: coffeeId });
  }, [dispatch, coffeeId]);

  // Handles all text input edits
  const handleEditInputs =
    (key: keyof CoffeeItem) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value, checked } = event.target;
      dispatch({
        type: ReduxActions.EDIT_INPUTS,
        payload: { key, change: value ?? checked },
      });
    };

  // Formats the date using Luxon
  const handleEditDate = (date: MaterialUiPickersDate) => {
    dispatch({
      type: ReduxActions.EDIT_INPUTS,
      payload: { key: 'roastDate', change: date?.toLocaleString() },
    });
  };

  // Submits the edited coffee to the database with input validation
  const handleSubmitEdit = () => {
    if (roaster && (country || blendName) && flavorsArray[0]) {
      dispatch({ type: ReduxActions.SNACKBARS_EDITED_COFFEE });
      dispatch({ type: SagaActions.EDIT_COFFEE, payload: oneCoffee });
      history.goBack();
    } else {
      setRoasterError(!roaster);
      setBlendCountryError(!(country || blendName));
      !flavorsArray[0] &&
        dispatch({ type: ReduxActions.SNACKBARS_FLAVORS_ERROR });
    }
  };

  return (
    <>
      <Box p={3}>
        <Typography variant="h4" className={classes.header}>
          Edit a Coffee
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <TextField
              required
              error={roasterError}
              helperText={roasterError && 'Please enter a roaster.'}
              label="Roaster"
              variant="outlined"
              className={classes.textInputs}
              fullWidth
              value={roaster || ''}
              onChange={handleEditInputs('roaster')}
            />
            <Box display="flex">
              <Grid container alignItems="center" spacing={1}>
                <Grid item>Single Origin</Grid>
                <Grid item>
                  <Switch
                    checked={!!isBlend}
                    onChange={handleEditInputs('isBlend')}
                    color="primary"
                    classes={{
                      track: classes.singleOriginBlendSwitchTrack,
                      switchBase: classes.singleOriginBlendSwitchBase,
                    }}
                  />
                </Grid>
                <Grid item>Blend</Grid>
              </Grid>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>Currently Brewing:</Grid>
                <Grid item>
                  <Switch
                    checked={!!brewing}
                    onChange={handleEditInputs('brewing')}
                    color="primary"
                  />
                </Grid>
              </Grid>
            </Box>
            <TextField
              required
              error={blendCountryError}
              helperText={
                blendCountryError &&
                (isBlend
                  ? 'Please enter the blend name.'
                  : 'Please enter the country of origin.')
              }
              label={isBlend ? 'Blend Name' : 'Country'}
              variant="outlined"
              className={classes.textInputs}
              fullWidth
              value={isBlend ? blendName || '' : country || ''}
              onChange={
                isBlend
                  ? handleEditInputs('blendName')
                  : handleEditInputs('country')
              }
            />
            <TextField
              label="Producer"
              variant="outlined"
              className={classes.textInputs}
              fullWidth
              value={producer || ''}
              disabled={isBlend}
              onChange={handleEditInputs('producer')}
            />
            <TextField
              label="Region"
              variant="outlined"
              className={classes.textInputs}
              fullWidth
              value={region || ''}
              disabled={isBlend}
              onChange={handleEditInputs('region')}
            />
            <TextField
              label="Cultivars"
              variant="outlined"
              className={classes.textInputs}
              fullWidth
              value={cultivars || ''}
              disabled={isBlend}
              onChange={handleEditInputs('cultivars')}
            />
            <TextField
              label="Processing"
              variant="outlined"
              className={classes.textInputs}
              fullWidth
              value={processing || ''}
              disabled={isBlend}
              onChange={handleEditInputs('processing')}
            />
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <TextField
                label="Elevation"
                variant="outlined"
                className={classes.textInputs}
                value={elevation || ''}
                disabled={isBlend}
                onChange={handleEditInputs('elevation')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">meters</InputAdornment>
                  ),
                }}
              />
              <MuiPickersUtilsProvider utils={LuxonUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yy"
                  margin="normal"
                  label="Roast Date"
                  value={roastDate}
                  onChange={handleEditDate}
                />
              </MuiPickersUtilsProvider>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography>Add a Photo:</Typography>
            <Box display="flex" py={2}>
              <S3Uploader
                setPhoto={(picUrl: string) =>
                  dispatch({
                    type: ReduxActions.EDIT_INPUTS,
                    payload: { key: 'coffeePic', change: picUrl },
                  })
                }
              />
              {coffeePic && (
                <img
                  alt="coffee bag"
                  className={classes.media}
                  src={coffeePic}
                />
              )}
            </Box>
            <Typography>Flavor Palette:</Typography>
            <Box className={classes.root} display="flex" flexWrap="wrap" py={2}>
              {flavors.map((flavor) => (
                <Chip
                  className={classes.chips}
                  key={flavor.id}
                  label={flavor.name}
                  color={
                    flavorsArray?.includes(flavor.id) ? 'primary' : 'default'
                  }
                  onClick={() =>
                    dispatch({
                      type: ReduxActions.EDIT_FLAVORS_ARRAY,
                      payload: flavor.id,
                    })
                  }
                />
              ))}
            </Box>
            <TextField
              label="Tasting Notes"
              variant="outlined"
              className={classes.textInputs}
              fullWidth
              multiline
              rows={6}
              value={notes || ''}
              onChange={handleEditInputs('notes')}
            />
            <Box
              display="flex"
              justifyContent="center"
              className={classes.root}
              py={2}
            >
              <Button
                variant="contained"
                className={classes.buttons}
                onClick={() => {
                  dispatch({ type: ReduxActions.CLEAR_SNACKBARS });
                  history.goBack();
                }}
              >
                Cancel
              </Button>
              <Button
                className={classes.buttons}
                variant="contained"
                color="primary"
                onClick={handleSubmitEdit}
              >
                Update Coffee
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Snackbars />
    </>
  );
}
