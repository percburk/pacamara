import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  makeStyles,
  Chip,
  InputAdornment,
  Collapse,
  IconButton,
} from '@material-ui/core';
import { Add, ExpandLess, ExpandMore, Close } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';

// Component styling classes
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  formInputs: {
    flexBasis: '25%',
    flexShrink: 0,
    alignSelf: 'center',
  },
  ratioExtBox: {
    flexBasis: '15%',
    flexShrink: 0,
  },
  formText: {
    fontWeight: 700,
  },
  advanced: {
    flexBasis: '20%',
    flexShrink: 0,
  },
  chips: {
    width: '18ch',
    alignSelf: 'center',
  },
}));

// AddBrew is a Dialog that has all the inputs needed to create a
// new brew instance, opens in CoffeeDetails
function AddBrew({ id, addBrew, setAddBrew, nameToDisplay }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const methods = useSelector((store) => store.methods);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [newBrew, setNewBrew] = useState({
    coffees_id: '',
    methods_id: user.methods_default_id,
    water_dose: '',
    coffee_dose: '',
    grind: '',
    moisture: 1.5,
    co2: 1,
    tds: '',
    ext: '',
    water_temp: 205,
    time: '',
    lrr: user.methods_default_lrr,
  });

  // Curried function to handle all text inputs in local state object
  const handleNewBrew = (key) => (event) => {
    setNewBrew({ ...newBrew, [key]: event.target.value });
  };

  // This is the math to calculate the Extraction %, result is rendered
  const adjustedCoffeeDose =
    (newBrew.coffee_dose * (100 - newBrew.moisture - newBrew.co2)) / 100;
  const bevWater = newBrew.water_dose - adjustedCoffeeDose * newBrew.lrr;
  const tdsWeight = bevWater / ((100 - newBrew.tds) / 100) - bevWater;
  const ext = Number((tdsWeight / adjustedCoffeeDose) * 100);
  const extCalc = ext !== 0 && isFinite(ext) ? ext.toFixed(1) : '';

  // This is the math to calculate the brew ratio, result is rendered
  const ratioCalc =
    newBrew.coffee_dose && newBrew.water_dose
      ? Number(newBrew.water_dose / newBrew.coffee_dose).toFixed(2)
      : '';

  // This adds whatever method was used for the brew into the local state object
  const handleMethod = (id, i) => {
    setNewBrew({ ...newBrew, methods_id: id, lrr: methods[i].lrr });
  };

  // Sends the new brew instance to the database
  const handleSubmit = () => {
    if (extCalc && ratioCalc) {
      dispatch({
        type: 'ADD_BREW',
        payload: {
          ...newBrew,
          coffees_id: id,
          ratio: ratioCalc,
          ext: extCalc,
        },
      });
      dispatch({ type: 'SNACKBARS_ADDED_BREW' });
      setAddBrew(false);
      setAdvancedOpen(false);
      clearInputs();
    } else {
      setErrorOpen(true);
    }
  };

  const clearInputs = () => {
    setNewBrew({
      coffees_id: '',
      methods_id: user.methods_default_id,
      water_dose: '',
      coffee_dose: '',
      grind: '',
      moisture: 1.5,
      co2: 1,
      tds: '',
      ext: '',
      water_temp: 205,
      time: '',
      lrr: user.methods_default_lrr,
    });
  };

  return (
    <Dialog open={addBrew} onClose={() => setAddBrew(false)}>
      <DialogTitle>Add a Brew of {nameToDisplay}</DialogTitle>
      <DialogContent>
        <Box display="flex" className={classes.root}>
          <TextField
            className={classes.formInputs}
            label="Water"
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="end">g</InputAdornment>,
            }}
            value={newBrew.water_dose}
            onChange={handleNewBrew('water_dose')}
          />
          <TextField
            className={classes.formInputs}
            label="Coffee"
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="end">g</InputAdornment>,
            }}
            onChange={handleNewBrew('coffee_dose')}
            value={newBrew.coffee_dose}
          />
          <TextField
            className={classes.formInputs}
            label="Grind"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">#</InputAdornment>
              ),
            }}
            value={newBrew.grind}
            onChange={handleNewBrew('grind')}
          />
        </Box>
        <Box display="flex" className={classes.root}>
          <TextField
            className={classes.formInputs}
            label="Time"
            variant="outlined"
            value={newBrew.time}
            onChange={handleNewBrew('time')}
          />
          <TextField
            className={classes.formInputs}
            label="TDS"
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            value={newBrew.tds}
            onChange={handleNewBrew('tds')}
          />
          <Box className={classes.ratioExtBox}>
            <Typography>{ratioCalc && 'Ratio:'}</Typography>
            <Typography className={classes.formText}>{ratioCalc}</Typography>
          </Box>
          <Box className={classes.ratioExtBox}>
            <Typography>{extCalc && 'Extraction:'}</Typography>
            <Typography className={classes.formText}>
              {extCalc}
              {extCalc && '%'}
            </Typography>
          </Box>
        </Box>
        <Box className={classes.root}>
          <Typography>Brew Method Used:</Typography>
          <Box className={classes.root}>
            {methods.map((item, i) => {
              if (user.methods_array.indexOf(item.id) > -1) {
                return (
                  <Chip
                    className={classes.chips}
                    key={item.id}
                    label={item.name}
                    color={
                      item.id === newBrew.methods_id ? 'primary' : 'default'
                    }
                    onClick={() => handleMethod(item.id, i)}
                  />
                );
              }
            })}
          </Box>
        </Box>
        <Box display="flex" className={classes.root} alignItems="center">
          <Typography>Advanced Settings</Typography>
          <IconButton onClick={() => setAdvancedOpen(!advancedOpen)}>
            {advancedOpen ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        <Collapse in={advancedOpen}>
          <Box display="flex" className={classes.root}>
            <TextField
              className={classes.advanced}
              label="Water Temp"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">&deg;</InputAdornment>
                ),
              }}
              value={newBrew.water_temp}
              onChange={handleNewBrew('water_temp')}
            />
            <TextField
              className={classes.advanced}
              label="Moisture"
              variant="outlined"
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              value={newBrew.moisture}
              onChange={handleNewBrew('moisture')}
            />
            <TextField
              className={classes.advanced}
              label="CO2"
              variant="outlined"
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              value={newBrew.co2}
              onChange={handleNewBrew('co2')}
            />
            <TextField
              className={classes.advanced}
              label="LRR"
              variant="outlined"
              value={newBrew.lrr}
              onChange={handleNewBrew('lrr')}
            />
          </Box>
        </Collapse>
      </DialogContent>
      <DialogActions className={classes.root}>
        <Button
          variant="contained"
          onClick={() => {
            setAddBrew(false);
            clearInputs();
          }}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          endIcon={<Add />}
          onClick={handleSubmit}
        >
          ADD
        </Button>
      </DialogActions>
      <Collapse in={errorOpen}>
        <Alert
          severity="error"
          action={
            <IconButton size="small" onClick={() => setErrorOpen(false)}>
              <Close fontSize="inherit" />
            </IconButton>
          }
        >
          Please fill out all fields.
        </Alert>
      </Collapse>
    </Dialog>
  );
}

export default AddBrew;
