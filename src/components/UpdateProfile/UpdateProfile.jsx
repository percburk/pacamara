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
  Collapse,
  Snackbar,
  Slider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';

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
  subheader: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  uploadLabel: {
    marginBottom: theme.spacing(2),
  },
  label: {
    marginBottom: theme.spacing(5),
  },
  media: {
    height: 200,
    width: 200,
    objectFit: 'cover',
    marginLeft: theme.spacing(5),
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
    methods_default_lrr: user.methods_default_lrr || '',
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

  console.log(newUpdates);

  return (
    <>
      <Box p={3}>
        <Typography variant="h4" className={classes.header}>
          {user.name ? 'Edit Profile' : 'Create New Profile'}
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              className={classes.textInputs}
              onChange={handleNewUpdates('name')}
              value={newUpdates.name}
            />
            <Typography className={classes.subheader}>
              Select Equipment:
            </Typography>
            <TextField
              label="Grinder"
              variant="outlined"
              fullWidth
              className={classes.textInputs}
              onChange={handleNewUpdates('grinder')}
              value={newUpdates.grinder}
            />
            <TextField
              label="Kettle"
              variant="outlined"
              fullWidth
              className={classes.textInputs}
              onChange={handleNewUpdates('kettle')}
              value={newUpdates.kettle}
            />
            <Typography className={classes.header}>
              Select Brew Methods:
            </Typography>
            <Box className={classes.root}>
              {methods.map((item) => {
                return (
                  <Chip
                    className={classes.chips}
                    key={item.id}
                    label={item.name}
                    color={
                      newMethods.indexOf(item.id) > -1 ? 'primary' : 'default'
                    }
                    onClick={() => handleNewMethod(item.id)}
                  />
                );
              })}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.uploadLabel}>
              Upload Profile photo:
            </Typography>
            <Box display="flex" paddingBottom={3}>
              <S3Uploader />
              {user.profile_pic && (
                <img className={classes.media} src={user.profile_pic} />
              )}
            </Box>
            <Box paddingTop={2} paddingBottom={2}>
              <Typography className={classes.label}>Set TDS Window:</Typography>
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
            <Box>
              <Typography className={classes.label}>
                Set Extraction Window:
              </Typography>
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
              className={classes.root}
              paddingTop={4}
            >
              <Button
                className={classes.buttons}
                variant="contained"
                onClick={handleCancel}
              >
                {user.name ? 'Cancel' : 'Cancel and logout'}
              </Button>
              <Button
                variant="contained"
                className={classes.buttons}
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
      </Box>
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
                    onClick={() => {
                      setDefaultMethod(item.id);
                      setNewUpdates({
                        ...newUpdates,
                        methods_default_lrr: item.lrr,
                      });
                    }}
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
