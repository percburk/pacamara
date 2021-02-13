import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from '@material-ui/core';
import { DeleteOutline, MoreVert, Edit } from '@material-ui/icons';

function EditDeleteMenu({ id }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDelete = () => {
    setDialogOpen(false);
    dispatch({ type: 'DELETE_COFFEE', payload: id });
    dispatch({ type: 'SNACKBARS_DELETED_COFFEE' });
    history.push('/dashboard');
  };

  return (
    <>
      <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
        <MoreVert />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            history.push(`/editCoffee/${id}`);
          }}
        >
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText primary="Edit Coffee" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setDialogOpen(true);
          }}
        >
          <ListItemIcon>
            <DeleteOutline />
          </ListItemIcon>
          <ListItemText primary="Delete Coffee" />
        </MenuItem>
      </Menu>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle align="center">Delete Coffee</DialogTitle>
        <DialogContent align="center">
          Are you sure you want to delete this coffee?
        </DialogContent>
        <Box display="flex" justifyContent="center">
          <DialogActions>
            <Button variant="contained" onClick={() => setDialogOpen(false)}>
              No
            </Button>
            <Button variant="contained" onClick={handleDelete}>
              Yes
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}

export default EditDeleteMenu;
