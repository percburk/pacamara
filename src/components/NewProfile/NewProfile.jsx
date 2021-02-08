import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  makeStyles,
  Button,
  Chip,
  Snackbar,
  Slider,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1.5),
      width: '25ch',
    },
  },
}));

function NewProfile() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const methods = useSelector((state) => state.methods);
  const [newMethods, setNewMethods] = useState([]);
  const [newTds, setNewTds] = useState([1.37, 1.43]);
  const [newExt, setNewExt] = useState([20, 23]);
  const [newUser, setNewUser] = useState({
    name: '',
    methods_default_id: '',
    kettle: '',
    grinder: '',
  });

  useEffect(() => dispatch({ type: 'FETCH_METHODS' }), []);

  const handleNewMethod = (id) => {
    newMethods.indexOf(id) === -1
      ? setNewMethods([...newMethods, id])
      : setNewMethods(newMethods.filter((index) => index !== id));
  };

  const handleNewUser = (key) => (event) => {
    setNewUser({ ...newUser, [key]: event.target.value });
  };

  const handleSliders = (moved) => (event, newVal) => {
    moved === 'tds' ? setNewTds(newVal) : setNewExt(newVal);
  };

  return (
    <>
      <Box paddingBottom={3}>
        <Typography variant="h4">Create New Profile</Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Box p={3}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              onChange={handleNewUser('name')}
              value={newUser.name}
            />
          </Box>
          <Box p={3}>
            <Typography>Select Equipment:</Typography>
            <TextField
              label="Grinder"
              variant="outlined"
              fullWidth
              onChange={handleNewUser('grinder')}
              value={newUser.grinder}
            />
            <TextField
              label="Kettle"
              variant="outlined"
              fullWidth
              onChange={handleNewUser('kettle')}
              value={newUser.kettle}
            />
          </Box>
          <Box p={3}>
            <Typography>Select Brew Methods:</Typography>
            <Box className={classes.root}>
              {methods.map((item) => {
                return (
                  <Chip
                    key={item.id}
                    label={item.name}
                    color={
                      newMethods.indexOf(item.id) === -1 ? 'default' : 'primary'
                    }
                    onClick={() => handleNewMethod(item.id)}
                  />
                );
              })}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box p={3}>
            <Typography>Set TDS Window:</Typography>
            <Slider
              value={newTds}
              onChange={handleSliders('tds')}
              valueLabelDisplay="auto"
              valueLabelDisplay="on"
              step={0.01}
              min={1.3}
              max={1.5}
            />
          </Box>
          <Box p={3}>
            <Typography>Set Extraction Window:</Typography>
            <Slider
              value={newExt}
              onChange={handleSliders('ext')}
              valueLabelDisplay="auto"
              valueLabelDisplay="on"
              step={0.1}
              min={17}
              max={25}
            />
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            p={3}
            className={classes.root}
          >
            <Button variant="contained">Cancel</Button>
            <Button variant="contained" color="primary">
              Create New Profile
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default NewProfile;
