import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@material-ui/core';
import { DeleteOutline, MoreVert, Edit, Share } from '@material-ui/icons';
// Imported components
import DeleteCoffeeDialog from '../DeleteCoffeeDialog/DeleteCoffeeDialog';
import SendCoffeeDialog from '../SendCoffeeDialog/SendCoffeeDialog';

// EditDeleteShareMenu appears when the 'more' icon is clicked on a CoffeeCard
// or in CoffeeDetails, where users can edit, delete, or share a coffee
function EditDeleteShareMenu({ id, coffeeName, pic }) {
  const history = useHistory();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Opens the menu
  const openShare = () => {
    setSendDialogOpen(true);
    setAnchorEl(null);
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
        <MenuItem onClick={openShare}>
          <ListItemIcon>
            <Share />
          </ListItemIcon>
          <ListItemText primary="Share Coffee" />
        </MenuItem>
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
            setDeleteDialogOpen(true);
          }}
        >
          <ListItemIcon>
            <DeleteOutline />
          </ListItemIcon>
          <ListItemText primary="Delete Coffee" />
        </MenuItem>
      </Menu>
      <DeleteCoffeeDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        id={id}
      />
      <SendCoffeeDialog
        open={sendDialogOpen}
        setOpen={setSendDialogOpen}
        id={id}
        coffeeName={coffeeName}
        pic={pic}
      />
    </>
  );
}

export default EditDeleteShareMenu;
