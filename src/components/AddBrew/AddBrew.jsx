import { useState } from 'react';
import { useSelector } from 'react-redux';
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
      width: '25ch',
    },
  },
}));

function AddBrew({ id, addBrew, setAddBrew }) {
  const classes = useStyles();
  const user = useSelector((store) => store.user);
  const methods = useSelector((store) => store.methods);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [ratio, setRatio] = useState('');
  const [extraction, setExtraction] = useState('');
  const [newBrew, setNewBrew] = useState({
    methods_id: '',
    water_dose: '',
    coffee_dose: '',
    grind: '',
    moisture: 1.5,
    co2: 1,
    tds: '',
    ext: '',
    water_temp: 205,
    time: '',
    lrr: '',
    bev_weight: '',
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
    }
  };

  const handleExtraction = () => {};

  const clearInputs = () => {
    setNewBrew({
      methods_id: '',
      water_dose: '',
      coffee_dose: '',
      grind: '',
      moisture: 1.5,
      co2: 1,
      tds: '',
      ext: '',
      water_temp: 205,
      time: '',
      lrr: '',
      bev_weight: '',
    });
    setRatio('');
  };

  return (
    <Dialog open={addBrew} onClose={setAddBrew}>
      <DialogTitle>Add a Brew</DialogTitle>
      <DialogContent>
        <TextField
          label="Water"
          variant="outlined"
          InputProps={{
            endAdornment: <InputAdornment position="end">g</InputAdornment>,
          }}
          value={newBrew.water_dose}
          onChange={handleNewBrew('water_dose')}
        />
        <TextField
          label="Coffee"
          variant="outlined"
          InputProps={{
            endAdornment: <InputAdornment position="end">g</InputAdornment>,
          }}
          onChange={handleNewBrew('coffee_dose')}
          value={newBrew.coffee_dose}
        />
        <Typography>Ratio: {ratio}</Typography>
        <TextField
          label="Grind"
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">#</InputAdornment>,
          }}
          value={newBrew.grind}
          onChange={handleNewBrew('grind')}
        />
        <TextField
          label="Time"
          variant="outlined"
          value={newBrew.time}
          onChange={handleNewBrew('time')}
        />
        <TextField
          label="TDS"
          variant="outlined"
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
          value={newBrew.tds}
          onChange={handleNewBrew('tds')}
        />
        <Typography>Extraction: {extraction}</Typography>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => setAdvancedOpen(!advancedOpen)}>
            {advancedOpen ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
          <Typography>Advanced Settings</Typography>
        </Box>
        <Collapse in={advancedOpen}>
          <TextField
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
            label="Moisture"
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            value={newBrew.moisture}
            onChange={handleNewBrew('moisture')}
          />
          <TextField
            label="CO2"
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            value={newBrew.co2}
            onChange={handleNewBrew('co2')}
          />
          <TextField
            label="LRR"
            variant="outlined"
            value={newBrew.bev_weight}
            onChange={handleNewBrew('bev_weight')}
          />
        </Collapse>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            setAddBrew(false);
            clearInputs();
          }}
        >
          Cancel
        </Button>
        <Button color="primary" variant="contained" endIcon={<Add />}>
          ADD
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddBrew;
