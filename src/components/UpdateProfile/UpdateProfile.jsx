import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Grid,
  makeStyles,
  Button,
  Chip,
  Slider,
} from '@material-ui/core';
// Components
import S3Uploader from '../S3Uploader/S3Uploader';
import CancelProfileDialog from '../CancelProfileDialog/CancelProfileDialog';
import DefaultMethodDialog from '../DefaultMethodDialog/DefaultMethodDialog';
import Snackbars from '../Snackbars/Snackbars';

// Component styling classes
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

// UpdateProfile handles any changes in profile information for new or existing
// users. Handles all changes in local state.
export default function UpdateProfile() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const methods = useSelector((store) => store.methods);
  const {
    name,
    profile_pic,
    methods_default_id,
    methods_default_lrr,
    kettle,
    grinder,
    tds_min,
    tds_max,
    ext_min,
    ext_max,
    methods_array,
  } = useSelector((store) => store.user);
  const [defaultDialogOpen, setDefaultDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [newMethods, setNewMethods] = useState(methods_array || []);
  const [newTds, setNewTds] = useState([tds_min || 1.37, tds_max || 1.43]);
  const [newExt, setNewExt] = useState([ext_min || 20, ext_max || 23.5]);
  const [newPic, setNewPic] = useState(profile_pic || '');
  const [newUpdates, setNewUpdates] = useState({
    name: name || '',
    methods_default_id: methods_default_id || '',
    methods_default_lrr: methods_default_lrr || '',
    kettle: kettle || '',
    grinder: grinder || '',
  });

  useEffect(() => dispatch({ type: 'FETCH_METHODS' }), []);

  // Handles toggling of methods being added to a user's profile
  const handleNewMethod = (methodId) => {
    newMethods.includes(methodId)
      ? setNewMethods(newMethods.filter((index) => index !== methodId))
      : setNewMethods([...newMethods, methodId]);
  };

  // Curried function which handles all text inputs
  const handleNewUpdates = (key) => (event) => {
    setNewUpdates({ ...newUpdates, [key]: event.target.value });
  };

  // Curried function which handles both sliders on the page, tds and ext
  const handleSliders = (moved) => (event, newVal) => {
    moved === 'tds' ? setNewTds(newVal) : setNewExt(newVal);
  };

  // Submits any profile updates. This is a PUT route for both a new and
  // existing user, since the username and password is made first
  const handleSubmit = () => {
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: {
        ...newUpdates,
        tds_min: newTds[0],
        tds_max: newTds[1],
        ext_min: newExt[0],
        ext_max: newExt[1],
        methods_array: newMethods,
        profile_pic: newPic,
      },
    });
    !name
      ? dispatch({ type: 'SNACKBARS_CREATED_PROFILE' })
      : dispatch({ type: 'SNACKBARS_UPDATED_PROFILE' });
    clearInputs();
    history.push('/dashboard');
  };

  // Handles whether the user continues to choose a default method, submits
  // only one method which becomes their default, or get an error for not
  // entering the minimum amount of required info
  const handleDoneButton = () => {
    if (newUpdates.name && newMethods[0]) {
      if (newMethods.length === 1) {
        setNewUpdates({
          ...newUpdates,
          methods_default_id: newMethods[0].id,
          methods_default_lrr: newMethods[0].lrr,
        });
        handleSubmit();
      } else {
        setDefaultDialogOpen(true);
      }
    } else {
      setInputError(!newUpdates.name);
      !newMethods[0] && dispatch({ type: 'SNACKBARS_METHODS_ERROR' });
    }
  };

  // Cancels any updates and sends the user to the previous page
  const handleCancel = () => {
    dispatch({ type: 'CLEAR_SNACKBARS' });
    if (name) {
      history.goBack();
      clearInputs();
    } else {
      setCancelDialogOpen(true);
    }
  };

  const clearInputs = () => {
    setDefaultDialogOpen(false);
    setCancelDialogOpen(false);
    setNewTds([1.37, 1.43]);
    setNewExt([20, 23]);
    setNewMethods([]);
    setNewPic('');
    setNewUpdates({
      name: '',
      methods_default_id: '',
      methods_default_lrr: '',
      kettle: '',
      grinder: '',
    });
  };

  return (
    <>
      <Box p={3}>
        <Typography variant="h4" className={classes.header}>
          {name ? 'Edit Profile' : 'Create New Profile'}
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <TextField
              required
              error={inputError}
              helperText={inputError && 'Please enter your name.'}
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
              Select Brew Methods*:
            </Typography>
            <Box className={classes.root}>
              {methods.map((method) => (
                <Chip
                  className={classes.chips}
                  key={method.id}
                  label={method.name}
                  color={newMethods.includes(method.id) ? 'primary' : 'default'}
                  onClick={() => handleNewMethod(method.id)}
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.uploadLabel}>
              Upload Profile photo:
            </Typography>
            <Box display="flex" paddingBottom={3}>
              <S3Uploader setPhoto={setNewPic} />
              {newPic && <img className={classes.media} src={newPic} />}
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
                {name ? 'Cancel' : 'Cancel and logout'}
              </Button>
              <Button
                variant="contained"
                className={classes.buttons}
                color="primary"
                onClick={handleDoneButton}
              >
                {name ? 'Submit' : 'Create'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <DefaultMethodDialog
        newMethods={newMethods}
        newUpdates={newUpdates}
        setNewUpdates={setNewUpdates}
        defaultDialogOpen={defaultDialogOpen}
        setDefaultDialogOpen={setDefaultDialogOpen}
        classes={classes}
        handleSubmit={handleSubmit}
      />
      <CancelProfileDialog
        cancelDialogOpen={cancelDialogOpen}
        setCancelDialogOpen={setCancelDialogOpen}
      />
      <Snackbars />
    </>
  );
}
