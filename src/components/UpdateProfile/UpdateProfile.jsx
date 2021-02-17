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
  IconButton,
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
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [dialogsOpen, setDialogsOpen] = useState({
    default: false,
    cancel: false,
  });

  const [newMethods, setNewMethods] = useState(user.methods_array || []);

  const [newTds, setNewTds] = useState([
    user.tds_min || 1.37,
    user.tds_max || 1.43,
  ]);

  const [newExt, setNewExt] = useState([
    user.ext_min || 20,
    user.ext_max || 23.5,
  ]);

  const [newPic, setNewPic] = useState(user.profile_pic || '');

  const [newUpdates, setNewUpdates] = useState({
    name: user.name || '',
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
      setDialogsOpen({ ...dialogsOpen, cancel: true });
    }
  };

  const clearInputs = () => {
    setDialogsOpen({});
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
                {user.name ? 'Cancel' : 'Cancel and logout'}
              </Button>
              <Button
                variant="contained"
                className={classes.buttons}
                color="primary"
                onClick={() =>
                  newMethods.length === 1
                    ? handleSubmit(newMethods[0])
                    : setDialogsOpen({ ...dialogsOpen, default: true })
                }
              >
                {user.name ? 'Submit' : 'Create'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Dialog
        open={dialogsOpen.default}
        onClose={() => setDialogsOpen({ ...dialogsOpen, default: false })}
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
                    color={
                      item.id === newUpdates.methods_default_id
                        ? 'primary'
                        : 'default'
                    }
                    onClick={() => {
                      setNewUpdates({
                        ...newUpdates,
                        methods_default_id: item.id,
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
                setDialogsOpen({ ...dialogsOpen, default: false });
                setNewUpdates({ ...newUpdates, methods_default_id: '' });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setNewUpdates({ ...newUpdates, methods_default_id: '' });
                handleSubmit();
              }}
            >
              No Thanks
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                !newUpdates.methods_default_id
                  ? setCollapseOpen(true)
                  : handleSubmit()
              }
            >
              Submit
            </Button>
          </DialogActions>
        </Box>
        <Collapse in={collapseOpen}>
          <Alert
            severity="error"
            action={
              <IconButton size="small" onClick={() => setCollapseOpen(false)}>
                <Close fontSize="inherit" />
              </IconButton>
            }
          >
            Please select a default brew method, or click 'No Thanks'
          </Alert>
        </Collapse>
      </Dialog>
      <Dialog
        open={dialogsOpen.cancel}
        onClose={() => setDialogsOpen({ ...dialogsOpen, cancel: false })}
      >
        <DialogTitle align="center">Are you sure?</DialogTitle>
        <DialogContent>
          This will log you out of your new account.
        </DialogContent>
        <Box display="flex" justifyContent="center">
          <DialogActions>
            <Button
              variant="contained"
              onClick={() => setDialogsOpen({ ...dialogsOpen, cancel: false })}
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
