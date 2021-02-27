import { useSelector, useDispatch } from 'react-redux';
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

// Component styling classes
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

// SharedCoffeeDialog opens when the user clicks on an item from
// SharedCoffeeMenu, displays some brief information about the coffee as
// well as the personal message the sender wrote
function SharedCoffeeDialog({
  dialogOpen,
  setDialogOpen,
  selectedCoffee,
  setAvatarAnchorEl,
  setSharedOpen,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    is_blend,
    blend_name,
    country,
    producer,
    coffee_pic,
    id: coffeeId,
    roaster,
    flavors_array,
    region,
    elevation,
    cultivars,
    processing,
  } = useSelector((store) => store.oneSharedCoffee);
  const sharedCoffees = useSelector((store) => store.sharedCoffees);
  const flavors = useSelector((store) => store.flavors);
  const {
    id: selectedId,
    username,
    message,
    sender_id,
    profile_pic,
  } = selectedCoffee;

  const nameToDisplay = is_blend ? blend_name : `${country} ${producer}`;

  // If the user doesn't want to add this coffee to their dashboard, they can
  // decline and the message is deleted
  const handleDelete = () => {
    dispatch({
      type: 'DELETE_SHARED_COFFEE',
      payload: selectedId,
    });
    dispatch({ type: 'SNACKBARS_DECLINED_SHARED_COFFEE' });
    handleReset();
  };

  // Handles adding this shared coffee to the user's dashboard
  const handleAdd = () => {
    dispatch({
      type: 'ADD_SHARED_COFFEE_TO_DASHBOARD',
      payload: { coffees_id: coffeeId, shared_by_id: sender_id },
    });
    dispatch({
      type: 'DELETE_SHARED_COFFEE',
      payload: selectedId,
    });
    dispatch({ type: 'SNACKBARS_ADDED_SHARED_COFFEE' });
    handleReset();
  };

  const handleReset = () => {
    setDialogOpen(false);
    if (!sharedCoffees) {
      dispatch({ type: 'CLEAR_ONE_SHARED_COFFEE' });
      setAvatarAnchorEl(false);
      setSharedOpen(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <Box display="flex" alignItems="center">
        <Avatar src={profile_pic} className={classes.avatar} />
        <DialogTitle>{username} shared a coffee with you:</DialogTitle>
      </Box>
      <DialogContent>
        <Grid container>
          <Grid item xs={6}>
            <Box display="flex">
              <Paper elevation={4}>
                {coffee_pic && (
                  <img src={coffee_pic} className={classes.image} />
                )}
              </Paper>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{nameToDisplay}</Typography>
            <Typography>By {roaster}</Typography>
            <Box display="flex" my={1.5}>
              {flavors_array &&
                flavors.map((item) => {
                  if (flavors_array.indexOf(item.id) > -1) {
                    return (
                      <Chip
                        key={item.id}
                        className={classes.chip}
                        variant="outlined"
                        label={item.name}
                      />
                    );
                  }
                })}
            </Box>
            {!is_blend && (
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

export default SharedCoffeeDialog;
