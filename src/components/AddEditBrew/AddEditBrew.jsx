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

// AddEditBrew is a Dialog that has all the inputs needed to create a
// new brew instance, opens in CoffeeDetails
export default function AddEditBrew({
  coffeeId,
  addEditBrewOpen,
  setAddEditBrewOpen,
  editInstance,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const methods = useSelector((store) => store.methods);
  const { methods_default_id, methods_default_lrr, methods_array } =
    useSelector((store) => store.user);
  const { is_blend, blend_name, country, producer } = useSelector(
    (store) => store.oneCoffee
  );
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [brew, setBrew] = useState(
    editInstance || {
      coffees_id: '',
      methods_id: methods_default_id,
      water_dose: '',
      coffee_dose: '',
      grind: '',
      moisture: 1.5,
      co2: 1,
      tds: '',
      ext: '',
      water_temp: 205,
      time: '',
      lrr: methods_default_lrr,
    }
  );
  const nameToDisplay = is_blend ? blend_name : `${country} ${producer}`;

  // Curried function to handle all text inputs in local state object
  const handleBrew = (key) => (event) => {
    setBrew({ ...brew, [key]: event.target.value });
  };

  // This is the math to calculate the Extraction %, result is rendered
  const adjustedCoffeeDose =
    (brew.coffee_dose * (100 - brew.moisture - brew.co2)) / 100;
  const bevWater = brew.water_dose - adjustedCoffeeDose * brew.lrr;
  const tdsWeight = bevWater / ((100 - brew.tds) / 100) - bevWater;
  const ext = Number((tdsWeight / adjustedCoffeeDose) * 100);
  const extCalc = ext !== 0 && isFinite(ext) ? ext.toFixed(1) : '';

  // This is the math to calculate the brew ratio, result is rendered
  const ratioCalc =
    brew.coffee_dose && brew.water_dose
      ? Number(brew.water_dose / brew.coffee_dose).toFixed(2)
      : '';

  // This adds whatever method was used for the brew into the local state object
  const handleMethod = (id, i) => {
    setBrew({ ...brew, methods_id: id, lrr: methods[i].lrr });
  };

  // Sends the new brew instance to the database
  const handleSubmit = () => {
    if (extCalc && ratioCalc) {
      dispatch({
        type: editInstance ? 'EDIT_BREW' : 'ADD_BREW',
        payload: {
          ...brew,
          coffees_id: editInstance?.coffees_id || coffeeId,
          ratio: ratioCalc,
          ext: extCalc,
        },
      });
      dispatch({
        type: `SNACKBARS_${editInstance ? 'EDITED' : 'ADDED'}_BREW'`,
      });
      setAddEditBrewOpen(false);
      setAdvancedOpen(false);
      !editInstance && clearInputs();
    } else {
      setErrorOpen(true);
    }
  };

  const clearInputs = () => {
    setBrew({
      coffees_id: '',
      methods_id: methods_default_id,
      water_dose: '',
      coffee_dose: '',
      grind: '',
      moisture: 1.5,
      co2: 1,
      tds: '',
      ext: '',
      water_temp: 205,
      time: '',
      lrr: methods_default_lrr,
    });
  };

  return (
    <Dialog open={addEditBrewOpen} onClose={() => setAddEditBrewOpen(false)}>
      <DialogTitle>
        {editInstance ? 'Edit' : 'Add a'} Brew of {nameToDisplay}
      </DialogTitle>
      <DialogContent>
        <Box display="flex" className={classes.root}>
          <TextField
            className={classes.formInputs}
            label="Water"
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="end">g</InputAdornment>,
            }}
            value={brew.water_dose}
            onChange={handleBrew('water_dose')}
          />
          <TextField
            className={classes.formInputs}
            label="Coffee"
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="end">g</InputAdornment>,
            }}
            onChange={handleBrew('coffee_dose')}
            value={brew.coffee_dose}
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
            value={brew.grind}
            onChange={handleBrew('grind')}
          />
        </Box>
        <Box display="flex" className={classes.root}>
          <TextField
            className={classes.formInputs}
            label="Time"
            variant="outlined"
            value={brew.time}
            onChange={handleBrew('time')}
          />
          <TextField
            className={classes.formInputs}
            label="TDS"
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            value={brew.tds}
            onChange={handleBrew('tds')}
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
            {methods.map((method, i) => {
              if (methods_array.includes(method.id)) {
                return (
                  <Chip
                    className={classes.chips}
                    key={method.id}
                    label={method.name}
                    color={
                      method.id === brew.methods_id ? 'primary' : 'default'
                    }
                    onClick={() => handleMethod(method.id, i)}
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
              value={brew.water_temp}
              onChange={handleBrew('water_temp')}
            />
            <TextField
              className={classes.advanced}
              label="Moisture"
              variant="outlined"
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              value={brew.moisture}
              onChange={handleBrew('moisture')}
            />
            <TextField
              className={classes.advanced}
              label="CO2"
              variant="outlined"
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              value={brew.co2}
              onChange={handleBrew('co2')}
            />
            <TextField
              className={classes.advanced}
              label="LRR"
              variant="outlined"
              value={brew.lrr}
              onChange={handleBrew('lrr')}
            />
          </Box>
        </Collapse>
      </DialogContent>
      <DialogActions className={classes.root}>
        <Button
          variant="contained"
          onClick={() => {
            setAddEditBrewOpen(false);
            !editInstance && clearInputs();
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
          Add
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
