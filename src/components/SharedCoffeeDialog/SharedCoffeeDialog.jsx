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
} from '@material-ui/core';
import { Add } from '@material-ui/icons';

import useQuery from '../../hooks/useQuery';

const useStyles = makeStyles((theme) => ({
  avatar: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  image: {
    height: 150,
    width: 150,
    objectFit: 'cover',
    margin: theme.spacing(3),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

function SharedCoffeeDialog({ dialogOpen, setDialogOpen, openSharedCoffee }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const query = useQuery();
  const {
    is_blend,
    country,
    producer,
    coffee_pic,
    id,
    roaster,
    flavors_array,
    region,
    elevation,
    cultivars,
    processing,
  } = useSelector((store) => store.oneSharedCoffee);
  const flavors = useSelector((store) => store.flavors);
  const searchQuery = query.get('q');

  const nameToDisplay = is_blend ? blend_name : `${country} ${producer}`;

  const handleDelete = () => {
    dispatch({
      type: 'DELETE_SHARED_COFFEE',
      payload: { coffeeId: openSharedCoffee.id, query: searchQuery || '' },
    });
    dispatch({ type: 'CLEAR_ONE_SHARED_COFFEE' });
    dispatch({ type: 'SNACKBARS_DECLINED_SHARED_COFFEE' });
    setDialogOpen(false);
  };

  const handleAdd = () => {
    dispatch({
      type: 'ADD_SHARED_COFFEE',
      payload: { coffees_id: id, shared_by_id: openSharedCoffee.sender_id },
    });
    dispatch({ type: 'CLEAR_ONE_SHARED_COFFEE' });
    dispatch({ type: 'SNACKBARS_ADDED_SHARED_COFFEE' });
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <Box display="flex" alignItems="center">
        <Avatar src={openSharedCoffee.profile_pic} className={classes.avatar} />
        <DialogTitle>
          {openSharedCoffee.username} shared a coffee with you:
        </DialogTitle>
      </Box>
      <DialogContent>
        <Grid container>
          <Grid item xs={6}>
            {coffee_pic && <img src={coffee_pic} className={classes.image} />}
          </Grid>
          <Grid item xs={6}>
            <Typography>{nameToDisplay}</Typography>
            <Typography>By {roaster}</Typography>
            <Box display="flex">
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
            <Typography>Region: {region}</Typography>
            <Typography>Cultivars: {cultivars}</Typography>
            <Typography>Elevation: {elevation} meters</Typography>
            <Typography>Processing: {processing}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography align="center">"{openSharedCoffee.message}"</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => setDialogOpen(false)}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleDelete}>
          Decline
        </Button>
        <Button
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
