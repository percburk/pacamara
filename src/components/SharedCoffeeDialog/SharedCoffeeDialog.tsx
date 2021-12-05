import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  Avatar,
  makeStyles,
  Button,
  Grid,
  Paper,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
// Hooks
import {
  useAppSelector,
  useAppDispatch,
} from '../../hooks/useAppDispatchSelector';
// Models
import { SharedCoffees } from '../../models/modelResource';
import { SagaActions } from '../../models/redux/sagaResource';
import { ReduxActions } from '../../models/redux/reduxResource';

// Styling
const useStyles = makeStyles((theme) => ({
  avatar: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    marginLeft: theme.spacing(3),
  },
  image: {
    height: 200,
    width: 200,
    objectFit: 'cover',
    margin: theme.spacing(2),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  button: {
    margin: theme.spacing(1),
  },
}));

interface Props {
  dialogOpen: boolean;
  setDialogOpen: (set: boolean) => void;
  selectedCoffee: SharedCoffees;
  setSharedOpen: (open: boolean) => void;
  setAvatarAnchorEl: (set: null) => void;
}

// SharedCoffeeDialog opens when the user clicks on an item from
// SharedCoffeeMenu, displays some brief information about the coffee as
// well as the personal message the sender wrote
export default function SharedCoffeeDialog({
  dialogOpen,
  setDialogOpen,
  selectedCoffee,
  setAvatarAnchorEl,
  setSharedOpen,
}: Props) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const {
    isBlend,
    blendName,
    country,
    producer,
    coffeePic,
    id: coffeeId,
    roaster,
    flavorsArray,
    region,
    elevation,
    cultivars,
    processing,
  } = useAppSelector((store) => store.oneSharedCoffee);
  const sharedCoffees = useAppSelector((store) => store.sharedCoffees);
  const flavors = useAppSelector((store) => store.flavors);
  const {
    id: selectedId,
    username,
    message,
    senderId,
    profilePic,
  } = selectedCoffee;

  const nameToDisplay = isBlend ? blendName : `${country} ${producer}`;

  // If the user doesn't want to add this coffee to their dashboard, they can
  // decline and the message is deleted
  const handleDelete = () => {
    dispatch({
      type: SagaActions.DELETE_SHARED_COFFEE,
      payload: selectedId,
    });
    dispatch({ type: ReduxActions.SNACKBARS_DECLINED_SHARED_COFFEE });
    handleReset();
  };

  // Handles adding this shared coffee to the user's dashboard
  const handleAdd = () => {
    dispatch({
      type: SagaActions.ADD_SHARED_COFFEE_TO_DASHBOARD,
      payload: { coffeesId: coffeeId, sharedById: senderId },
    });
    dispatch({
      type: SagaActions.DELETE_SHARED_COFFEE,
      payload: selectedId,
    });
    dispatch({ type: ReduxActions.SNACKBARS_ADDED_SHARED_COFFEE });
    handleReset();
  };

  const handleReset = () => {
    setDialogOpen(false);
    if (!sharedCoffees) {
      dispatch({ type: ReduxActions.CLEAR_ONE_SHARED_COFFEE });
      setAvatarAnchorEl(null);
      setSharedOpen(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <Box display="flex" alignItems="center">
        <Avatar src={profilePic} className={classes.avatar} />
        <DialogTitle>{username} shared a coffee with you:</DialogTitle>
      </Box>
      <DialogContent>
        <Grid container>
          <Grid item xs={6}>
            <Box display="flex">
              <Paper elevation={4}>
                {coffeePic && (
                  <img
                    alt="coffee bag"
                    src={coffeePic}
                    className={classes.image}
                  />
                )}
              </Paper>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{nameToDisplay}</Typography>
            <Typography>By {roaster}</Typography>
            <Box display="flex" my={1.5}>
              {flavorsArray &&
                flavors.map((flavor) =>
                  flavorsArray.includes(flavor.id) ? (
                    <Chip
                      key={flavor.id}
                      className={classes.chip}
                      variant="outlined"
                      label={flavor.name}
                    />
                  ) : null
                )}
            </Box>
            {!isBlend && (
              <Box my={1}>
                <Typography>Region: {region}</Typography>
                <Typography>Cultivars: {cultivars}</Typography>
                <Typography>Elevation: {elevation} meters</Typography>
                <Typography>Processing: {processing}</Typography>
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <Box my={2}>
              <Typography align="center">"{message}"</Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          className={classes.button}
          variant="contained"
          onClick={() => setDialogOpen(false)}
        >
          Cancel
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          onClick={handleDelete}
        >
          Decline
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleAdd}
          endIcon={<Add />}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
