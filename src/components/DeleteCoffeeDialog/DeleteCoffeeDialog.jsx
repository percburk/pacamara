import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  makeStyles,
} from '@material-ui/core';
// Custom hooks
import useQuery from '../../hooks/useQuery';

// Component styling classes
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

// Opens to make sure a user wants to delete a coffee from their dashboard
function DeleteCoffeeDialog({ open, setOpen, id }) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const query = useQuery();

  // Checks to see if there is a search query in the URL
  const searchQuery = query.get('q');

  // Deletes the coffee from the user's dashboard
  const handleDelete = () => {
    setOpen(false);
    dispatch({
      type: 'DELETE_COFFEE',
      payload: { id, q: searchQuery || '' },
    });
    dispatch({ type: 'SNACKBARS_DELETED_COFFEE' });
    dispatch({ type: 'FETCH_SHARED_COFFEES' });
    searchQuery
      ? history.push(`/dashboard/?q=${searchQuery}`)
      : history.push('/dashboard');
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle align="center">Delete Coffee</DialogTitle>
      <DialogContent align="center">
        <DialogContentText>
          Are you sure you want to delete this coffee?
        </DialogContentText>
      </DialogContent>
      <Box display="flex" justifyContent="center">
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => setOpen(false)}
            className={classes.button}
          >
            No
          </Button>
          <Button
            variant="contained"
            onClick={handleDelete}
            className={classes.button}
          >
            Yes
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default DeleteCoffeeDialog;
