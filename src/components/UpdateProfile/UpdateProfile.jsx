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
  Slider,
} from '@material-ui/core';

import S3Uploader from '../S3Uploader/S3Uploader';
import CancelProfileDialog from '../CancelProfileDialog/CancelProfileDialog';
import DefaultMethodDialog from '../DefaultMethodDialog/DefaultMethodDialog';

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
                {name ? 'Cancel' : 'Cancel and logout'}
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
    </>
  );
}

export default UpdateProfile;
