import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { DateTime } from 'luxon';
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
}));

// AddCoffee includes all the inputs to add a new coffee to a user's dashboard
export default function AddCoffee() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const flavors = useSelector((store) => store.flavors);
  const [roasterError, setRoasterError] = useState(false);
  const [blendCountryError, setBlendCountryError] = useState(false);
  const [newFlavors, setNewFlavors] = useState([]);
  const [newCoffee, setNewCoffee] = useState({
    roaster: '',
    roast_date: new Date(),
    is_blend: false,
    brewing: false,
    blend_name: '',
    country: '',
    producer: '',
    region: '',
    elevation: '',
    cultivars: '',
    processing: '',
    notes: '',
    coffee_pic: '',
  });

  useEffect(() => dispatch({ type: 'FETCH_FLAVORS' }), []);

  // Handles all text inputs, adds to local state object
  const handleNewCoffee = (key) => (event) => {
    setNewCoffee({ ...newCoffee, [key]: event.target.value });
  };

  // Formats the date chosen from MuiDatePicker using Luxon
  const handleRoastDate = (date) => {
    const formattedDate = DateTime.fromMillis(date.ts).toLocaleString();
    setNewCoffee({ ...newCoffee, roast_date: formattedDate });
  };

  // Handles setting the coffee pic url if S3Uploader is used
  const handlePic = (url) => {
    setNewCoffee({ ...newCoffee, coffee_pic: url });
  };

  // Toggles adding and removing flavors for the coffee in local state array
  const handleNewFlavor = (id) => {
    !newFlavors.includes(id)
      ? setNewFlavors([...newFlavors, id])
      : setNewFlavors(newFlavors.filter((index) => index !== id));
  };

  // Handles the two switches on the page, for 'is_blend' and 'brewing'
  const handleSwitch = (event) => {
    event.target.name === 'is_blend'
      ? setNewCoffee({
          ...newCoffee,
          is_blend: event.target.checked,
          country: '',
          blend_name: '',
        })
      : setNewCoffee({ ...newCoffee, brewing: event.target.checked });
  };

  // Adds the new coffee to the database with input validation
  const handleSubmit = () => {
    if (
      newCoffee.roaster &&
      (newCoffee.country || newCoffee.blend_name) &&
      newFlavors[0]
    ) {
      dispatch({ type: 'SNACKBARS_ADDED_COFFEE' });
      dispatch({
        type: 'ADD_COFFEE',
        payload: {
          ...newCoffee,
          flavors_array: newFlavors,
        },
      });
      dispatch({ type: 'FETCH_SHARED_COFFEES' });
      clearInputs();
      history.push('/dashboard');
    } else {
      newCoffee.roaster ? setRoasterError(false) : setRoasterError(true);
      newCoffee.country || newCoffee.blend_name
        ? setBlendCountryError(false)
        : setBlendCountryError(true);
      if (!newFlavors[0]) {
        dispatch({ type: 'SNACKBARS_FLAVORS_ERROR' });
      }
    }
  };

  // Clears all local state data and sends user back to their dashboard
  const handleCancel = () => {
    dispatch({ type: 'CLEAR_SNACKBARS' });
    clearInputs();
    history.goBack();
  };

  const clearInputs = () => {
    setNewCoffee({
      roaster: '',
      roast_date: new Date(),
      is_blend: false,
      brewing: false,
      blend_name: '',
      country: '',
      producer: '',
      region: '',
      elevation: '',
      cultivars: '',
      processing: '',
      notes: '',
      coffee_pic: '',
    });
    setNewFlavors([]);
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
                    checked={newCoffee.is_blend}
                    onChange={handleSwitch}
                    color="primary"
                    name="is_blend"
                  />
                </Grid>
                <Grid item>Blend</Grid>
              </Grid>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>Currently Brewing:</Grid>
                <Grid item>
                  <Switch
                    checked={newCoffee.brewing}
                    name="brewing"
                    onChange={handleSwitch}
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
                (newCoffee.is_blend
                  ? 'Please enter the blend name.'
                  : 'Please enter the country of origin.')
              }
              label={newCoffee.is_blend ? 'Blend Name' : 'Country'}
              variant="outlined"
              className={classes.textInputs}
              fullWidth
              onChange={
                newCoffee.is_blend
                  ? handleNewCoffee('blend_name')
                  : handleNewCoffee('country')
              }
              value={
                newCoffee.is_blend ? newCoffee.blend_name : newCoffee.country
              }
            />
            <TextField
              label="Producer"
              variant="outlined"
              className={classes.textInputs}
              fullWidth
              onChange={handleNewCoffee('producer')}
              value={newCoffee.producer}
              disabled={newCoffee.is_blend}
            />
            <TextField
              label="Region"
              variant="outlined"
              className={classes.textInputs}
              fullWidth
              onChange={handleNewCoffee('region')}
              value={newCoffee.region}
              disabled={newCoffee.is_blend}
            />
            <TextField
              label="Cultivars"
              variant="outlined"
              className={classes.textInputs}
              fullWidth
              onChange={handleNewCoffee('cultivars')}
              value={newCoffee.cultivars}
              disabled={newCoffee.is_blend}
            />
            <TextField
              label="Processing"
              variant="outlined"
              fullWidth
              onChange={handleNewCoffee('processing')}
              className={classes.textInputs}
              value={newCoffee.processing}
              disabled={newCoffee.is_blend}
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
                disabled={newCoffee.is_blend}
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
                  value={newCoffee.roast_date}
                  onChange={handleRoastDate}
                />
              </MuiPickersUtilsProvider>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography>Add a Photo:</Typography>
            <Box display="flex" py={2}>
              <S3Uploader setPhoto={handlePic} />
              {newCoffee.coffee_pic && (
                <img className={classes.media} src={newCoffee.coffee_pic} />
              )}
            </Box>
            <Typography>Flavor Palette:</Typography>
            <Box className={classes.root} display="flex" flexWrap="wrap" py={2}>
              {flavors.map((item) => (
                <Chip
                  className={classes.chips}
                  key={item.id}
                  label={item.name}
                  color={newFlavors.includes(item.id) ? 'primary' : 'default'}
                  onClick={() => handleNewFlavor(item.id)}
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