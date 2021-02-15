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
import { Add, ExpandLess, ExpandMore } from '@material-ui/icons';

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
  formText: {
    flexBasis: '15%',
    flexShrink: 0,
    alignSelf: 'center',
  },
  advanced: {
    flexBasis: '15%',
    flexShrink: 0,
  },
  chips: {
    width: '20ch',
    alignSelf: 'center',
  },
}));

function AddBrew({ id, addBrew, setAddBrew, nameToDisplay }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const methods = useSelector((store) => store.methods);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [ratio, setRatio] = useState('');
  const [ext, setExt] = useState('');
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

  const handleNewBrew = (key) => (event) => {
    setNewBrew({ ...newBrew, [key]: event.target.value });
    if (key === 'water_dose') {
      const ratioMath =
        Number(event.target.value) / Number(newBrew.coffee_dose);
      ratioMath !== 0 && Number.isFinite(ratioMath)
        ? setRatio(ratioMath.toFixed(2))
        : setRatio('');
    } else if (key === 'coffee_dose') {
      const ratioMath = Number(newBrew.water_dose) / Number(event.target.value);
      ratioMath !== 0 && Number.isFinite(ratioMath)
        ? setRatio(ratioMath.toFixed(2))
        : setRatio('');
    } else if (key === 'tds') {
      const adjustedCoffeeDose =
        (newBrew.coffee_dose * (100 - newBrew.moisture - newBrew.co2)) / 100;
      const bevWater = newBrew.water_dose - adjustedCoffeeDose * newBrew.lrr;
      const tdsWeight =
        bevWater / ((100 - Number(event.target.value)) / 100) - bevWater;
      const extraction = (tdsWeight / adjustedCoffeeDose) * 100;
      extraction !== 0 && Number.isFinite(extraction)
        ? setExt(extraction.toFixed(1))
        : setExt('');
    }
  };

  const handleMethod = (id, i) => {
    setNewBrew({ ...newBrew, methods_id: id, lrr: methods[i].lrr });
  };

  const handleSubmit = () => {
    dispatch({
      type: 'ADD_BREW',
      payload: {
        ...newBrew,
        coffees_id: id,
        ratio,
        ext,
      },
    });
    dispatch({ type: 'SNACKBARS_ADDED_BREW' });
    setAddBrew(false);
    setAdvancedOpen(false);
    clearInputs();
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
    setRatio('');
    setExt('');
  };

  return (
    <Dialog
      open={addBrew}
      onClose={() => setAddBrew(false)}
      fullWidth
      maxWidth="md"
    >
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
          <Typography className={classes.formText}>Ratio: {ratio}</Typography>
          <Typography className={classes.formText}>
            Extraction: {ext}%
          </Typography>
        </Box>
        <Box display="flex" className={classes.root} alignItems="center">
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
    </Dialog>
  );
}

export default AddBrew;
