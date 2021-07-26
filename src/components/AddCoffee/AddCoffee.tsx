import { useState, useEffect, ChangeEvent } from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '../../hooks/useAppDispatchSelector';
import { AddCoffeeState } from '../../models/stateResource';
import { useHistory } from 'react-router-dom';
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
} from '@material-ui/pickers/';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { DateTime } from 'luxon';
// Components
import S3Uploader from '../S3Uploader/S3Uploader';
import Snackbars from '../Snackbars/Snackbars';
import { SagaActions } from '../../models/redux/sagaResource';
import { ReduxActions } from '../../models/redux/reduxResource';

// Component styling classes
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

// AddCoffee includes all the inputs to add a new coffee to a user's dashboard
export default function AddCoffee() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const flavors = useAppSelector((store) => store.flavors);
  const [roasterError, setRoasterError] = useState<boolean>(false);
  const [blendCountryError, setBlendCountryError] = useState<boolean>(false);
  const [newCoffee, setNewCoffee] = useState<AddCoffeeState>({
    roaster: '',
    roastDate: DateTime.local().toLocaleString(),
    isBlend: false,
    brewing: false,
    blendName: '',
    country: '',
    producer: '',
    region: '',
    elevation: '',
    cultivars: '',
    processing: '',
    notes: '',
    coffeePic: '',
    flavorsArray: [],
  });

  useEffect(() => {
    dispatch({ type: SagaActions.FETCH_FLAVORS });
  }, [dispatch]);

  // Handles all text inputs, adds to local state object
  const handleNewCoffee =
    (key: keyof AddCoffeeState) => (event: ChangeEvent<HTMLInputElement>) => {
      setNewCoffee({
        ...newCoffee,
        [key]: event.target.value || event.target.checked,
      });
    };

  // Formats the date chosen from MuiDatePicker using Luxon
  const handleRoastDate = (date: MaterialUiPickersDate) => {
    setNewCoffee({
      ...newCoffee,
      roastDate: date ? date.toLocaleString() : newCoffee.roastDate,
    });
  };

  // Handles setting the coffee pic url if S3Uploader is used
  const handlePic = (url: string) => {
    setNewCoffee({ ...newCoffee, coffeePic: url });
  };

  // Toggles adding and removing flavors for the coffee in local state array
  const handleNewFlavor = (id: number) => {
    setNewCoffee({
      ...newCoffee,
      flavorsArray: !newCoffee.flavorsArray.includes(id)
        ? [...newCoffee.flavorsArray, id]
        : newCoffee.flavorsArray.filter((index) => index !== id),
    });
  };

  // Adds the new coffee to the database with input validation
  const handleSubmit = () => {
    if (
      newCoffee.roaster &&
      (newCoffee.country || newCoffee.blendName) &&
      newCoffee.flavorsArray[0]
    ) {
      dispatch({ type: ReduxActions.SNACKBARS_ADDED_COFFEE });
      dispatch({ type: SagaActions.ADD_COFFEE, payload: newCoffee });
      clearInputs();
      history.push('/dashboard');
    } else {
      newCoffee.roaster ? setRoasterError(false) : setRoasterError(true);
      newCoffee.country || newCoffee.blendName
        ? setBlendCountryError(false)
        : setBlendCountryError(true);
      if (!newCoffee.flavorsArray[0]) {
        dispatch({ type: ReduxActions.SNACKBARS_FLAVORS_ERROR });
      }
    }
  };

  // Clears all local state data and sends user back to their dashboard
  const handleCancel = () => {
    dispatch({ type: ReduxActions.CLEAR_SNACKBARS });
    clearInputs();
    history.goBack();
  };

  const clearInputs = () => {
    setNewCoffee({
      roaster: '',
      roastDate: DateTime.local().toLocaleString(),
      isBlend: false,
      brewing: false,
      blendName: '',
      country: '',
      producer: '',
      region: '',
      elevation: '',
      cultivars: '',
      processing: '',
      notes: '',
      coffeePic: '',
      flavorsArray: [],
    });
  };

  return (
    <>
      <Box p={3}>
        <Typography variant="h4" className={classes.header}>
          Add a New Coffee
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
              onChange={handleNewCoffee('roaster')}
              value={newCoffee.roaster}
            />
            <Box display="flex">
              <Grid container alignItems="center" spacing={1}>
                <Grid item>Single Origin</Grid>
                <Grid item>
                  <Switch
                    checked={newCoffee.isBlend}
                    onChange={handleNewCoffee('isBlend')}
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
                    checked={newCoffee.brewing}
                    onChange={handleNewCoffee('brewing')}
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
                (newCoffee.isBlend
                  ? 'Please enter the blend name.'
                  : 'Please enter the country of origin.')
              }
              label={newCoffee.isBlend ? 'Blend Name' : 'Country'}
              variant="outlined"
              className={classes.textInputs}
              fullWidth
              onChange={
                newCoffee.isBlend
                  ? handleNewCoffee('blendName')
                  : handleNewCoffee('country')
              }
              value={
                newCoffee.isBlend ? newCoffee.blendName : newCoffee.country
              }
            />
            <TextField
              label="Producer"
              variant="outlined"
              className={classes.textInputs}
              fullWidth
              onChange={handleNewCoffee('producer')}
              value={newCoffee.producer}
              disabled={newCoffee.isBlend}
            />
            <TextField
              label="Region"
              variant="outlined"
              className={classes.textInputs}
              fullWidth
              onChange={handleNewCoffee('region')}
              value={newCoffee.region}
              disabled={newCoffee.isBlend}
            />
            <TextField
              label="Cultivars"
              variant="outlined"
              className={classes.textInputs}
              fullWidth
              onChange={handleNewCoffee('cultivars')}
              value={newCoffee.cultivars}
              disabled={newCoffee.isBlend}
            />
            <TextField
              label="Processing"
              variant="outlined"
              fullWidth
              onChange={handleNewCoffee('processing')}
              className={classes.textInputs}
              value={newCoffee.processing}
              disabled={newCoffee.isBlend}
            />
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <TextField
                label="Elevation"
                variant="outlined"
                onChange={handleNewCoffee('elevation')}
                value={newCoffee.elevation}
                disabled={newCoffee.isBlend}
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
                  value={newCoffee.roastDate}
                  onChange={handleRoastDate}
                />
              </MuiPickersUtilsProvider>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography>Add a Photo:</Typography>
            <Box display="flex" py={2}>
              <S3Uploader setPhoto={handlePic} />
              {newCoffee.coffeePic && (
                <img
                  alt="coffee bag"
                  className={classes.media}
                  src={newCoffee.coffeePic}
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
                    newCoffee.flavorsArray.includes(flavor.id)
                      ? 'primary'
                      : 'default'
                  }
                  onClick={() => handleNewFlavor(flavor.id)}
                />
              ))}
            </Box>
            <TextField
              label="Tasting Notes"
              variant="outlined"
              fullWidth
              className={classes.textInputs}
              multiline
              rows={6}
              onChange={handleNewCoffee('notes')}
              value={newCoffee.notes}
            />
            <Box
              display="flex"
              justifyContent="center"
              className={classes.root}
              py={2}
            >
              <Button
                className={classes.buttons}
                variant="contained"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                className={classes.buttons}
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Add New Coffee
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Snackbars />
    </>
  );
}
