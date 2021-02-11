import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import {
  Box,
  makeStyles,
  Typography,
  Grid,
  TextField,
  Switch,
  Chip,
  Snackbar,
  Button,
} from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import LuxonUtils from '@date-io/luxon';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

function AddEditCoffee() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  let { id } = useParams();
  const flavors = useSelector((store) => store.flavors);
  const coffees = useSelector((store) => store.coffees);
  const [newFlavors, setNewFlavors] = useState(
    id === 'new' ? [] : coffees[id].flavors_array
  );
  const [newCoffee, setNewCoffee] = useState(
    id === 'new'
      ? {
          roaster: '',
          roast_date: new Date(),
          is_blend: false,
          blend_name: '',
          country: '',
          producer: '',
          region: '',
          elevation: '',
          cultivars: '',
          processing: '',
          notes: '',
          coffee_pic: '',
        }
      : coffees[id]
  );

  useEffect(() => {
    dispatch({ type: 'FETCH_COFFEES' });
    dispatch({ type: 'FETCH_FLAVORS' });
  }, []);

  const handleNewCoffee = (key) => (event) => {
    setNewCoffee({ ...newCoffee, [key]: event.target.value });
  };

  const handleRoastDate = (date) => {
    const formattedDate = DateTime.fromMillis(date.ts).toLocaleString();
    console.log(formattedDate);
    setNewCoffee({ ...newCoffee, roast_date: formattedDate });
  };

  const handleNewFlavor = (id) => {
    newFlavors.indexOf(id) === -1
      ? setNewFlavors([...newFlavors, id])
      : setNewFlavors(newFlavors.filter((index) => index !== id));
  };

  const handleBlendSwitch = () => {
    setNewCoffee({
      ...newCoffee,
      is_blend: !newCoffee.is_blend,
      country: '',
      blend_name: '',
    });
  };

  const handleNew = () => {
    dispatch({type: 'SNACKBAR_ADDED_COFFEE'})
    dispatch({
      type: 'ADD_COFFEE',
      payload: { ...newCoffee, flavors_array: newFlavors },
    });
    clearInputs();
    history.push('/dashboard'); // Change to CoffeeDetails!!
  };

  const handleUpdate = () => {
    dispatch({
      type: 'EDIT_COFFEE',
      payload: { ...newCoffee, flavors_array: newFlavors },
    });
    clearInputs();
    dispatch({ type: 'SNACKBARS_UPDATED_COFFEE' });
    history.push('/dashboard');
  };

  const clearInputs = () => {
    setNewCoffee({
      roaster: '',
      roast_date: new Date(),
      is_blend: false,
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
      <Box paddingBottom={3}>
        <Typography variant="h4">
          {id === 'new' ? 'Add New Coffee' : 'Update Coffee'}
        </Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Box p={3}>
            <TextField
              label="Roaster"
              variant="outlined"
              fullWidth
              onChange={handleNewCoffee('roaster')}
              value={newCoffee.roaster}
            />
            <Grid container alignItems="center" spacing={1}>
              <Grid item>Single Origin</Grid>
              <Grid item>
                <Switch
                  checked={newCoffee.is_blend}
                  onChange={handleBlendSwitch}
                  color="primary"
                />
              </Grid>
              <Grid item>Blend</Grid>
            </Grid>
            <TextField
              label={newCoffee.is_blend ? 'Blend Name' : 'Country'}
              variant="outlined"
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
              fullWidth
              onChange={handleNewCoffee('producer')}
              value={newCoffee.producer}
              disabled={newCoffee.is_blend}
            />
            <TextField
              label="Region"
              variant="outlined"
              fullWidth
              onChange={handleNewCoffee('region')}
              value={newCoffee.region}
              disabled={newCoffee.is_blend}
            />
            <Box display="flex" alignItems="center">
              <TextField
                label="Elevation"
                variant="outlined"
                onChange={handleNewCoffee('elevation')}
                value={newCoffee.elevation}
                disabled={newCoffee.is_blend}
              />
              <Typography>meters</Typography>
            </Box>
            <TextField
              label="Cultivars"
              variant="outlined"
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
              value={newCoffee.processing}
              disabled={newCoffee.is_blend}
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
          <Box p={3}>
            <TextField
              label="Coffee Photo URL"
              variant="outlined"
              fullWidth
              onChange={handleNewCoffee('coffee_pic')}
              value={newCoffee.coffee_pic}
            />
          </Box>
          <Typography>Flavor Palette:</Typography>
          <Box
            className={classes.root}
            display="flex"
            flexWrap="wrap"
            justifyContent="center"
          >
            {flavors.map((item) => {
              return (
                <Chip
                  key={item.id}
                  label={item.name}
                  color={
                    newFlavors.indexOf(item.id) === -1 ? 'default' : 'primary'
                  }
                  onClick={() => handleNewFlavor(item.id)}
                />
              );
            })}
          </Box>
          <Box p={3}>
            <TextField
              label="Tasting Notes"
              variant="outlined"
              fullWidth
              multiline
              rows={5}
              onChange={handleNewCoffee('notes')}
              value={newCoffee.notes}
            />
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            p={3}
            className={classes.root}
          >
            <Button
              variant="contained"
              onClick={() => {
                dispatch({ type: 'CLEAR_SNACKBARS' });
                history.push('/dashboard');
                clearInputs();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={id === 'new' ? handleNew : handleUpdate}
            >
              {id === 'new' ? 'Add New Coffee' : 'Update Coffee'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default AddEditCoffee;
