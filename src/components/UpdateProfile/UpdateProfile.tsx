import { useState, useEffect, ChangeEvent } from 'react';
import { useHistory } from 'react-router-dom';
import {
  useAppDispatch,
  useAppSelector,
} from '../../hooks/useAppDispatchSelector';
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
import { UpdateProfileState } from '../../models/stateResource';
import { SagaActions } from '../../models/redux/sagaResource';
import { ReduxActions } from '../../models/redux/reduxResource';

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
  centerText: {
    textAlign: 'center',
  },
}));
export type UseStylesReturnType = ReturnType<typeof useStyles>;

// UpdateProfile handles any changes in profile information for new or existing
// users. Handles all changes in local state.
export default function UpdateProfile() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const methods = useAppSelector((store) => store.methods);
  const {
    name,
    profilePic,
    methodsDefaultId,
    methodsDefaultLrr,
    kettle,
    grinder,
    tdsMin,
    tdsMax,
    extMin,
    extMax,
    methodsArray,
  } = useAppSelector((store) => store.user);
  const [defaultDialogOpen, setDefaultDialogOpen] = useState<boolean>(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false);
  const [inputError, setInputError] = useState<boolean>(false);
  const [newUpdates, setNewUpdates] = useState<UpdateProfileState>({
    name: name || '',
    profilePic: profilePic || '',
    methodsDefaultId: methodsDefaultId || null,
    methodsDefaultLrr: methodsDefaultLrr || null,
    kettle: kettle || '',
    grinder: grinder || '',
    methodsArray: methodsArray ?? [],
    tdsRange: [tdsMin || 1.37, tdsMax || 1.43],
    extRange: [extMin || 20, extMax || 23.5],
  });

  useEffect(() => {
    dispatch({ type: SagaActions.FETCH_METHODS });
  }, [dispatch]);

  // Handles toggling of methods being added to a user's profile
  const handleNewMethod = (methodId: number) => {
    setNewUpdates({
      ...newUpdates,
      methodsArray: newUpdates.methodsArray.includes(methodId)
        ? newUpdates.methodsArray.filter((index) => index !== methodId)
        : [...newUpdates.methodsArray, methodId],
    });
  };

  // Curried function which handles all text inputs
  const handleNewUpdates =
    (key: keyof UpdateProfileState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setNewUpdates({ ...newUpdates, [key]: event.target.value });
    };

  // Curried function which handles both sliders on the page, tds and ext
  const handleSliders =
    (moved: 'tdsRange' | 'extRange') =>
    (event: ChangeEvent<{}>, newVal: number[] | number) => {
      setNewUpdates({ ...newUpdates, [moved]: newVal as number[] });
    };

  // Submits any profile updates. This is a PUT route for both a new and
  // existing user, since the username and password is made first
  const handleSubmit = () => {
    dispatch({
      type: SagaActions.UPDATE_PROFILE,
      payload: {
        ...newUpdates,
        tdsMin: newUpdates.tdsRange[0],
        tdsMax: newUpdates.tdsRange[1],
        extMin: newUpdates.extRange[0],
        extMax: newUpdates.extRange[1],
      },
    });
    !name
      ? dispatch({ type: ReduxActions.SNACKBARS_CREATED_PROFILE })
      : dispatch({ type: ReduxActions.SNACKBARS_UPDATED_PROFILE });
    clearInputs();
    history.push('/dashboard');
  };

  // Handles whether the user continues to choose a default method, submits
  // only one method which becomes their default, or get an error for not
  // entering the minimum amount of required info
  const handleDoneButton = () => {
    if (newUpdates.name && newUpdates.methodsArray[0]) {
      if (newUpdates.methodsArray.length === 1) {
        const methodLrr = methods.find(
          (method) => method.id === newUpdates.methodsArray[0]
        )?.lrr;
        setNewUpdates({
          ...newUpdates,
          methodsDefaultId: newUpdates.methodsArray[0],
          methodsDefaultLrr: methodLrr ?? null,
        });
        handleSubmit();
      } else {
        setDefaultDialogOpen(true);
      }
    } else {
      setInputError(!newUpdates.name);
      !newUpdates.methodsArray[0] &&
        dispatch({ type: ReduxActions.SNACKBARS_METHODS_ERROR });
    }
  };

  // Cancels any updates and sends the user to the previous page
  const handleCancel = () => {
    dispatch({ type: ReduxActions.CLEAR_SNACKBARS });
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
    setNewUpdates({
      name: '',
      profilePic: '',
      methodsDefaultId: null,
      methodsDefaultLrr: null,
      kettle: '',
      grinder: '',
      methodsArray: [],
      tdsRange: [],
      extRange: [],
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
                  color={
                    newUpdates.methodsArray?.includes(method.id)
                      ? 'primary'
                      : 'default'
                  }
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
              <S3Uploader
                setPhoto={(picUrl: string) =>
                  setNewUpdates({ ...newUpdates, profilePic: picUrl })
                }
              />
              {newUpdates.profilePic && (
                <img
                  alt="profile"
                  className={classes.media}
                  src={newUpdates.profilePic}
                />
              )}
            </Box>
            <Box paddingTop={2} paddingBottom={2}>
              <Typography className={classes.label}>Set TDS Window:</Typography>
              <Slider
                onChange={handleSliders('tdsRange')}
                valueLabelDisplay="on"
                value={newUpdates.tdsRange}
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
                onChange={handleSliders('extRange')}
                valueLabelDisplay="on"
                value={newUpdates.extRange}
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
