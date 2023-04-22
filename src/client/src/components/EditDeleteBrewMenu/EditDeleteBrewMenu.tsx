import { useState } from 'react'
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@material-ui/core'
import { DeleteOutline, MoreVert, Edit } from '@material-ui/icons'
// Models
import { Brew } from '../../models/modelResource'
// Components
import AddEditBrew from '../AddEditBrew/AddEditBrew'
import DeleteCoffeeBrewDialog from '../DeleteCoffeeBrewDialog/DeleteCoffeeBrewDialog'

// EditDeleteBrewMenu appears when the 'more' icon is clicked on a BrewInstance
// accordion
export default function EditDeleteBrewMenu({ instance }: { instance: Brew }) {
  const { id: brewId, coffeesId: coffeeId } = instance
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [addEditBrewOpen, setAddEditBrewOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLButtonElement) | null>(
    null
  )

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
            setAnchorEl(null)
            setAddEditBrewOpen(true)
          }}
        >
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText primary="Edit Brew" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null)
            setDeleteDialogOpen(true)
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
  )
}
