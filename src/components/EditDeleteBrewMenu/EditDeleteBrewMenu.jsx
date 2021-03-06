import { useState } from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@material-ui/core';
import { DeleteOutline, MoreVert, Edit } from '@material-ui/icons';
// Components
import DeleteCoffeeBrewDialog from '../DeleteCoffeeBrewDialog/DeleteCoffeeBrewDialog';
import AddEditBrew from '../AddEditBrew/AddEditBrew';

// EditDeleteBrewMenu appears when the 'more' icon is clicked on a BrewInstance
// accordion
export default function EditDeleteBrewMenu({ instance }) {
  const { id: brewId, coffees_id: coffeeId } = instance;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addEditBrewOpen, setAddEditBrewOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
        <MoreVert />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setAddEditBrewOpen(true);
          }}
        >
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText primary="Edit Brew" />
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
          <ListItemText primary="Delete Brew" />
        </MenuItem>
      </Menu>
      <AddEditBrew
        addEditBrewOpen={addEditBrewOpen}
        setAddEditBrewOpen={setAddEditBrewOpen}
        editInstance={instance}
      />
      <DeleteCoffeeBrewDialog
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        brewId={brewId}
        coffeeId={coffeeId}
      />
    </>
  );
}
