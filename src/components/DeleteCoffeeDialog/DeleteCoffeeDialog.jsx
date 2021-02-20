import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@material-ui/core';
import useQuery from '../../hooks/useQuery';

function DeleteCoffeeDialog({ open, setOpen, id }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const query = useQuery();

  const searchQuery = query.get('q');

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
        Are you sure you want to delete this coffee?
      </DialogContent>
      <Box display="flex" justifyContent="center">
        <DialogActions>
          <Button variant="contained" onClick={() => setOpen(false)}>
            No
          </Button>
          <Button variant="contained" onClick={handleDelete}>
            Yes
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default DeleteCoffeeDialog;
