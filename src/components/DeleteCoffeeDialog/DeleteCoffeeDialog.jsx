import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
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

// Component styling classes
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

// Opens to make sure a user wants to delete a coffee from their dashboard
function DeleteCoffeeDialog({ deleteDialogOpen, setDeleteDialogOpen, id }) {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  // Checks to see if there is a search query in the URL
  const { textSearch } = queryString.parse(location.search);

  // Deletes the coffee from the user's dashboard
  const handleDelete = () => {
    setDeleteDialogOpen(false);
    dispatch({
      type: 'DELETE_COFFEE',
      payload: { id, textSearch },
    });
    dispatch({ type: 'SNACKBARS_DELETED_COFFEE' });
    dispatch({ type: 'FETCH_SHARED_COFFEES' });
    location.search
      ? history.push(`/dashboard/${location.search}`)
      : history.push('/dashboard');
  };

  return (
    <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
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
            onClick={() => setDeleteDialogOpen(false)}
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
