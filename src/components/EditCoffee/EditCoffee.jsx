import { useEffect } from 'react';
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
  Button,
  FormControlLabel,
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

function AddCoffee() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  let { id } = useParams();
  const flavors = useSelector((store) => store.flavors);
  const oneCoffee = useSelector((store) => store.oneCoffee);

  useEffect(() => {
    dispatch({ type: 'FETCH_FLAVORS' });
    dispatch({ type: 'FETCH_ONE_COFFEE', payload: id });
  }, []);

  const handleEditInputs = (key) => (event) => {
    dispatch({
      type: 'EDIT_INPUTS',
      payload: { key, change: event.target.value },
    });
  };

  const handleEditDate = (date) => {
    const formattedDate = DateTime.fromMillis(date.ts).toLocaleString();
    dispatch({ type: 'EDIT_ROAST_DATE', payload: formattedDate });
  };

  const handleSubmitEdit = () => {
    dispatch({ type: 'SNACKBAR_EDITED_COFFEE' });
    dispatch({
      type: 'EDIT_COFFEE',
      payload: oneCoffee,
    });
    history.push('/dashboard');
  };

  console.log(oneCoffee.brewing);

  return (
    <>
      <Box paddingBottom={3}>
        <Typography variant="h4">Edit Coffee</Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Box p={3}>
            <TextField
              label="Roaster"
              variant="outlined"
              fullWidth
              defaultValue=" "
              value={oneCoffee.roaster}
              onChange={handleEditInputs('roaster')}
            />
            <Grid container alignItems="center" spacing={1}>
              <Grid item>Single Origin</Grid>
              <Grid item>
                <Switch
                  checked={oneCoffee.is_blend}
                  onChange={(event) =>
                    dispatch({
                      type: 'EDIT_SWITCH',
                      payload: event.target.name,
                    })
                  }
                  color="primary"
                  name="is_blend"
                />
              </Grid>
              <Grid item>Blend</Grid>
            </Grid>
            <TextField
              label={oneCoffee.is_blend ? 'Blend Name' : 'Country'}
              variant="outlined"
              fullWidth
              defaultValue=" "
              value={
                oneCoffee.is_blend ? oneCoffee.blend_name : oneCoffee.country
              }
              onChange={
                oneCoffee.is_blend
                  ? handleEditInputs('blend_name')
                  : handleEditInputs('country')
              }
            />
            <TextField
              label="Producer"
              variant="outlined"
              fullWidth
              defaultValue=" "
              value={oneCoffee.producer}
              disabled={oneCoffee.is_blend}
              onChange={handleEditInputs('producer')}
            />
            <TextField
              label="Region"
              variant="outlined"
              fullWidth
              defaultValue=" "
              value={oneCoffee.region}
              disabled={oneCoffee.is_blend}
              onChange={handleEditInputs('region')}
            />
            <Box display="flex" alignItems="center">
              <TextField
                label="Elevation"
                variant="outlined"
                defaultValue=" "
                value={oneCoffee.elevation}
                disabled={oneCoffee.is_blend}
                onChange={handleEditInputs('elevation')}
              />
              <Typography>meters</Typography>
            </Box>
            <TextField
              label="Cultivars"
              variant="outlined"
              fullWidth
              defaultValue=" "
              value={oneCoffee.cultivars}
              disabled={oneCoffee.is_blend}
              onChange={handleEditInputs('cultivars')}
            />
            <TextField
              label="Processing"
              variant="outlined"
              fullWidth
              defaultValue=" "
              value={oneCoffee.processing}
              disabled={oneCoffee.is_blend}
              onChange={handleEditInputs('processing')}
            />
            <MuiPickersUtilsProvider utils={LuxonUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yy"
                margin="normal"
                label="Roast Date"
                value={oneCoffee.roast_date}
                onChange={handleEditDate}
              />
            </MuiPickersUtilsProvider>
            <FormControlLabel
              label="Currently Brewing"
              labelPlacement="start"
              control={
                <Switch
                  checked={oneCoffee.brewing}
                  name="brewing"
                  onChange={(event) =>
                    dispatch({
                      type: 'EDIT_SWITCH',
                      payload: event.target.name,
                    })
                  }
                  color="primary"
                />
              }
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box p={3}>
            <TextField
              label="Coffee Photo URL"
              variant="outlined"
              defaultValue=" "
              fullWidth
              value={oneCoffee.coffee_pic}
              onChange={handleEditInputs('coffee_pic')}
            />
          </Box>
          <Typography>Flavor Palette:</Typography>
          <Box
            className={classes.root}
            display="flex"
            flexWrap="wrap"
            justifyContent="center"
          >
            {oneCoffee.flavors_array &&
              flavors.map((item) => {
                return (
                  <Chip
                    key={item.id}
                    label={item.name}
                    color={
                      oneCoffee.flavors_array.indexOf(item.id) === -1
                        ? 'default'
                        : 'primary'
                    }
                    onClick={() =>
                      dispatch({
                        type: 'EDIT_FLAVORS_ARRAY',
                        payload: item.id,
                      })
                    }
                  />
                );
              })}
          </Box>
          <Box p={3}>
            <TextField
              label="Tasting Notes"
              variant="outlined"
              defaultValue=" "
              fullWidth
              multiline
              rows={5}
              value={oneCoffee.notes}
              onChange={handleEditInputs('notes')}
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
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitEdit}
            >
              Update Coffee
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default AddCoffee;
