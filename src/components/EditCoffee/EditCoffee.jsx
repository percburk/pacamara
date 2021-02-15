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
  InputAdornment,
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
    },
  },
  textInputs: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  chips: {
    width: '20ch',
  },
  buttons: {
    width: '25ch',
  },
  header: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
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
    dispatch({ type: 'SNACKBARS_EDITED_COFFEE' });
    dispatch({
      type: 'EDIT_COFFEE',
      payload: oneCoffee,
    });
    history.goBack();
  };

  return (
    <>
      <Box p={3}>
        <Typography variant="h4" className={classes.header}>
          Edit Coffee
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <TextField
              label="Roaster"
              variant="outlined"
              className={classes.textInputs}
              fullWidth
              defaultValue=" "
              value={oneCoffee.roaster}
              onChange={handleEditInputs('roaster')}
            />
            <Box display="flex">
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
              <Grid container alignItems="center" spacing={1}>
                <Grid item>Currently Brewing:</Grid>
                <Grid item>
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
                </Grid>
              </Grid>
            </Box>
            <TextField
              label={oneCoffee.is_blend ? 'Blend Name' : 'Country'}
              variant="outlined"
              className={classes.textInputs}
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
              className={classes.textInputs}
              fullWidth
              defaultValue=" "
              value={oneCoffee.producer}
              disabled={oneCoffee.is_blend}
              onChange={handleEditInputs('producer')}
            />
            <TextField
              label="Region"
              variant="outlined"
              className={classes.textInputs}
              fullWidth
              defaultValue=" "
              value={oneCoffee.region}
              disabled={oneCoffee.is_blend}
              onChange={handleEditInputs('region')}
            />
            <TextField
              label="Cultivars"
              variant="outlined"
              className={classes.textInputs}
              fullWidth
              defaultValue=" "
              value={oneCoffee.cultivars}
              disabled={oneCoffee.is_blend}
              onChange={handleEditInputs('cultivars')}
            />
            <TextField
              label="Processing"
              variant="outlined"
              className={classes.textInputs}
              fullWidth
              defaultValue=" "
              value={oneCoffee.processing}
              disabled={oneCoffee.is_blend}
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
                defaultValue=" "
                value={oneCoffee.elevation}
                disabled={oneCoffee.is_blend}
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
                  value={oneCoffee.roast_date}
                  onChange={handleEditDate}
                />
              </MuiPickersUtilsProvider>
            </Box>
          </Grid>
          <Grid item xs={6} className={classes.gridItem}>
            <TextField
              label="Coffee Photo URL"
              variant="outlined"
              defaultValue=" "
              fullWidth
              className={classes.textInputs}
              value={oneCoffee.coffee_pic}
              onChange={handleEditInputs('coffee_pic')}
            />
            <Typography>Flavor Palette:</Typography>
            <Box className={classes.root} display="flex" flexWrap="wrap" py={2}>
              {oneCoffee.flavors_array &&
                flavors.map((item) => {
                  return (
                    <Chip
                      className={classes.chips}
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
            <TextField
              label="Tasting Notes"
              variant="outlined"
              defaultValue=" "
              className={classes.textInputs}
              fullWidth
              multiline
              rows={6}
              value={oneCoffee.notes}
              onChange={handleEditInputs('notes')}
            />
            <Box
              display="flex"
              flexDirection="row-reverse"
              className={classes.root}
              py={2}
            >
              <Button
                className={classes.buttons}
                variant="contained"
                color="primary"
                onClick={handleSubmitEdit}
              >
                Update Coffee
              </Button>
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
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default AddCoffee;
