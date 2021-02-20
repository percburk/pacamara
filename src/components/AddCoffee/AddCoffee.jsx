import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { DateTime } from 'luxon';
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
import LuxonUtils from '@date-io/luxon';

import S3Uploader from '../S3Uploader/S3Uploader';

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

function AddCoffee() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const flavors = useSelector((store) => store.flavors);
  const [newFlavors, setNewFlavors] = useState([]);
  const [newPic, setNewPic] = useState('');
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
  });

  useEffect(() => dispatch({ type: 'FETCH_FLAVORS' }), []);

  const handleNewCoffee = (key) => (event) => {
    setNewCoffee({ ...newCoffee, [key]: event.target.value });
  };

  const handleRoastDate = (date) => {
    const formattedDate = DateTime.fromMillis(date.ts).toLocaleString();
    setNewCoffee({ ...newCoffee, roast_date: formattedDate });
  };

  const handleNewFlavor = (id) => {
    newFlavors.indexOf(id) === -1
      ? setNewFlavors([...newFlavors, id])
      : setNewFlavors(newFlavors.filter((index) => index !== id));
  };

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

  const handleNew = () => {
    dispatch({ type: 'SNACKBARS_ADDED_COFFEE' });
    dispatch({
      type: 'ADD_COFFEE',
      payload: {
        ...newCoffee,
        flavors_array: newFlavors,
        coffee_pic: newPic,
      },
    });
    dispatch({ type: 'FETCH_SHARED_COFFEES' });
    clearInputs();
    history.push('/dashboard');
  };

  const handlePreparedInputs = () => {
    setNewCoffee({
      ...newCoffee,
      roaster: 'Intelligentsia',
      country: 'Peru',
      producer: 'Rayos Del Sol',
      region: 'Alto Ihuamaca',
      elevation: '1500-1800',
      cultivars: 'Bourbon, Caturra, Pache',
      processing: 'Washed',
      notes: `Nuanced coffee from Peru with notes of Honeycrisp apple, demerara, and dark chocolate.`,
    });
  };

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
        <Typography
          variant="h4"
          className={classes.header}
          onClick={handlePreparedInputs}
        >
          Add a New Coffee
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <TextField
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
            <TextField
              label="Coffee Photo URL"
              variant="outlined"
              className={classes.textInputs}
              fullWidth
              onChange={(event) => setNewPic(event.target.value)}
              value={newPic}
            />
            <Box display="flex" paddingBottom={3} paddingTop={1}>
              <S3Uploader setPhoto={setNewPic} />
              {newPic && <img className={classes.media} src={newPic} />}
            </Box>
            <Typography>Flavor Palette:</Typography>
            <Box className={classes.root} display="flex" flexWrap="wrap" py={2}>
              {newFlavors &&
                flavors.map((item) => {
                  return (
                    <Chip
                      className={classes.chips}
                      key={item.id}
                      label={item.name}
                      color={
                        newFlavors.indexOf(item.id) === -1
                          ? 'default'
                          : 'primary'
                      }
                      onClick={() => handleNewFlavor(item.id)}
                    />
                  );
                })}
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
                onClick={handleNew}
              >
                Add New Coffee
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default AddCoffee;
