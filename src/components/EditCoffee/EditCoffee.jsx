import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { blue } from '@material-ui/core/colors';
// Components
import S3Uploader from '../S3Uploader/S3Uploader';
import Snackbars from '../Snackbars/Snackbars';

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

// EditCoffee contains all the inputs to edit an existing coffee entry
// All editing is done in Redux
export default function EditCoffee() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const flavors = useSelector((store) => store.flavors);
  const oneCoffee = useSelector((store) => store.oneCoffee);
  const {
    roaster,
    roast_date,
    is_blend,
    blend_name,
    country,
    producer,
    region,
    elevation,
    cultivars,
    processing,
    notes,
    coffee_pic,
    flavors_array,
    brewing,
  } = oneCoffee;
  const [roasterError, setRoasterError] = useState(false);
  const [blendCountryError, setBlendCountryError] = useState(false);

  useEffect(() => {
    dispatch({ type: 'FETCH_FLAVORS' });
    dispatch({ type: 'FETCH_ONE_COFFEE', payload: id });
  }, []);

  // Handles all text input edits
  const handleEditInputs = (key) => (event) => {
    const { value, checked } = event.target;
    dispatch({
      type: 'EDIT_INPUTS',
      payload: { key, change: value || checked },
    });
  };

  // Handles a new pic uploaded from S3Uploader
  const handleEditPic = (newUrl) => {
    dispatch({
      type: 'EDIT_INPUTS',
      payload: { key: 'coffee_pic', change: newUrl },
    });
  };

  // Formats the date using Luxon
  const handleEditDate = (date) => {
    const formattedDate = date.toLocaleString();
    console.log(formattedDate);
    dispatch({
      type: 'EDIT_INPUTS',
      payload: { key: 'roast_date', change: formattedDate },
    });
  };

  // Submits the edited coffee to the database with input validation
  const handleSubmitEdit = () => {
    if (roaster && (is_blend ? blend_name : country) && flavors_array[0]) {
      dispatch({ type: 'SNACKBARS_EDITED_COFFEE' });
      dispatch({ type: 'EDIT_COFFEE', payload: oneCoffee });
      history.goBack();
    } else {
      setRoasterError(!roaster);
      setBlendCountryError(is_blend ? !country : !blend_name);
      !flavors_array[0] && dispatch({ type: 'SNACKBARS_FLAVORS_ERROR' });
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
                    checked={!!is_blend}
                    onChange={handleEditInputs('is_blend')}
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
                (is_blend
                  ? 'Please enter the blend name.'
                  : 'Please enter the country of origin.')
              }
              label={is_blend ? 'Blend Name' : 'Country'}
              variant="outlined"
              className={classes.textInputs}
              fullWidth
              value={is_blend ? blend_name || '' : country || ''}
              onChange={
                is_blend
                  ? handleEditInputs('blend_name')
                  : handleEditInputs('country')
              }
            />
            <TextField
              label="Producer"
              variant="outlined"
              className={classes.textInputs}
              fullWidth
              value={producer || ''}
              disabled={is_blend}
              onChange={handleEditInputs('producer')}
            />
            <TextField
              label="Region"
              variant="outlined"
              className={classes.textInputs}
              fullWidth
              value={region || ''}
              disabled={is_blend}
              onChange={handleEditInputs('region')}
            />
            <TextField
              label="Cultivars"
              variant="outlined"
              className={classes.textInputs}
              fullWidth
              value={cultivars || ''}
              disabled={is_blend}
              onChange={handleEditInputs('cultivars')}
            />
            <TextField
              label="Processing"
              variant="outlined"
              className={classes.textInputs}
              fullWidth
              value={processing || ''}
              disabled={is_blend}
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
                disabled={is_blend}
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
                  value={roast_date}
                  onChange={handleEditDate}
                />
              </MuiPickersUtilsProvider>
            </Box>
          </Grid>
          <Grid item xs={6} className={classes.gridItem}>
            <Typography>Add a Photo:</Typography>
            <Box display="flex" py={2}>
              <S3Uploader setPhoto={handleEditPic} />
              {coffee_pic && <img className={classes.media} src={coffee_pic} />}
            </Box>
            <Typography>Flavor Palette:</Typography>
            <Box className={classes.root} display="flex" flexWrap="wrap" py={2}>
              {flavors.map((flavor) => (
                <Chip
                  className={classes.chips}
                  key={flavor.id}
                  label={flavor.name}
                  color={
                    flavors_array?.includes(flavor.id) ? 'primary' : 'default'
                  }
                  onClick={() =>
                    dispatch({
                      type: 'EDIT_FLAVORS_ARRAY',
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
                  dispatch({ type: 'CLEAR_SNACKBARS' });
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
