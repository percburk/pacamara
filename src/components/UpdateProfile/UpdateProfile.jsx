import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  IconButton,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

function UpdateProfile() {
  const classes = useStyles();
  const history = useHistory();
  let { id } = useParams();
  const dispatch = useDispatch();
  const methods = useSelector((store) => store.methods);
  const user = useSelector((store) => store.user);
  const [defaultDialogOpen, setDefaultDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [defaultMethod, setDefaultMethod] = useState(0);
  const [newMethods, setNewMethods] = useState(user.methods_array || []);

  const [newTds, setNewTds] = useState([
    user.tds_min || 1.37,
    user.tds_max || 1.43,
  ]);

  const [newExt, setNewExt] = useState([
    user.ext_min || 20,
    user.ext_max || 23.5,
  ]);

  const [newUpdates, setNewUpdates] = useState({
    name: user.name || '',
    profile_pic: user.profile_pic || '',
    methods_default_id: user.methods_default_id || '',
    kettle: user.kettle || '',
    grinder: user.grinder || '',
  });

  useEffect(() => dispatch({ type: 'FETCH_METHODS' }), []);

  const handleNewMethod = (id) => {
    newMethods.indexOf(id) === -1
      ? setNewMethods([...newMethods, id])
      : setNewMethods(newMethods.filter((index) => index !== id));
  };

  const handleNewUpdates = (key) => (event) => {
    setNewUpdates({ ...newUpdates, [key]: event.target.value });
  };

  const handleSliders = (moved) => (event, newVal) => {
    moved === 'tds' ? setNewTds(newVal) : setNewExt(newVal);
  };

  const handleSubmit = (defaultId) => {
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: {
        ...newUpdates,
        tds_min: newTds[0],
        tds_max: newTds[1],
        ext_min: newExt[0],
        ext_max: newExt[1],
        methods_array: newMethods,
        methods_default_id: defaultId,
      },
    });
    id === 'new'
      ? dispatch({ type: 'SNACKBARS_CREATED_PROFILE' })
      : dispatch({ type: 'SNACKBARS_UPDATED_PROFILE' });
    clearInputs();
    history.push('/dashboard');
  };

  const handleCancel = () => {
    dispatch({ type: 'CLEAR_SNACKBARS' });
    if (user.name) {
      history.push('/dashboard');
      clearInputs();
    } else {
      setCancelDialogOpen(true);
    }
  };

  const clearInputs = () => {
    setNewTds([1.37, 1.43]);
    setNewExt([20, 23]);
    setDefaultMethod(0);
    setNewMethods([]);
    setNewUpdates({
      name: '',
      profile_pic: '',
      methods_default_id: '',
      kettle: '',
      grinder: '',
    });
  };

  return (
    <>
      <Box paddingBottom={3}>
        <Typography variant="h4">
          {user.name ? 'Edit Profile' : 'Create New Profile'}
        </Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Box p={3}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              onChange={handleNewUpdates('name')}
              value={newUpdates.name}
            />
            <TextField
              label="Profile Pic"
              variant="outlined"
              fullWidth
              onChange={handleNewUpdates('profile_pic')}
              value={newUpdates.profile_pic}
            />
          </Box>
          <Box p={3}>
            <Typography>Select Equipment:</Typography>
            <TextField
              label="Grinder"
              variant="outlined"
              fullWidth
              onChange={handleNewUpdates('grinder')}
              value={newUpdates.grinder}
            />
            <TextField
              label="Kettle"
              variant="outlined"
              fullWidth
              onChange={handleNewUpdates('kettle')}
              value={newUpdates.kettle}
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
              onChange={handleSliders('tds')}
              valueLabelDisplay="auto"
              valueLabelDisplay="on"
              value={newTds}
              step={0.01}
              min={1.3}
              max={1.55}
            />
          </Box>
          <Box p={3}>
            <Typography>Set Extraction Window:</Typography>
            <Slider
              onChange={handleSliders('ext')}
              valueLabelDisplay="auto"
              valueLabelDisplay="on"
              value={newExt}
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
            <Button variant="contained" onClick={handleCancel}>
              {user.name ? 'Cancel' : 'Cancel and logout'}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                newMethods.length === 1
                  ? handleSubmit(newMethods[0])
                  : setDefaultDialogOpen(true)
              }
            >
              {user.name ? 'Submit' : 'Create'}
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Dialog
        open={defaultDialogOpen}
        onClose={() => setDefaultDialogOpen(false)}
      >
        <DialogTitle align="center">Default Brew Method</DialogTitle>
        <DialogContent>
          <DialogContentText align="center">
            Would you like to set a brew method as your default?
          </DialogContentText>
          <Box className={classes.root} display="flex" justifyContent="center">
            {methods.map((item) => {
              if (newMethods.indexOf(item.id) > -1) {
                return (
                  <Chip
                    key={item.id}
                    label={item.name}
                    color={item.id === defaultMethod ? 'primary' : 'default'}
                    onClick={() => setDefaultMethod(item.id)}
                  />
                );
              }
            })}
          </Box>
        </DialogContent>
        <Box display="flex" justifyContent="center">
          <DialogActions>
            <Button
              variant="contained"
              onClick={() => {
                setDefaultDialogOpen(false);
                setDefaultMethod(0);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                handleSubmit(null);
                setDefaultMethod(0);
              }}
            >
              No Thanks
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                !defaultMethod
                  ? alert('Please select a default brew method.')
                  : // Change from 'alert' to Snackbar!!
                    handleSubmit(defaultMethod)
              }
            >
              Submit
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle align="center">Are you sure?</DialogTitle>
        <DialogContent>
          This will log you out of your new account.
        </DialogContent>
        <Box display="flex" justifyContent="center">
          <DialogActions>
            <Button
              variant="contained"
              onClick={() => setCancelDialogOpen(false)}
            >
              No
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                dispatch({ type: 'LOGOUT' });
                history.push('/home');
              }}
            >
              Yes
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}

export default UpdateProfile;
