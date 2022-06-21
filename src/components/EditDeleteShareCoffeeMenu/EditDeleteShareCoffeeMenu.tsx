import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@material-ui/core'
import { DeleteOutline, MoreVert, Edit, Share } from '@material-ui/icons'
// Components
import DeleteCoffeeBrewDialog from '../DeleteCoffeeBrewDialog/DeleteCoffeeBrewDialog'
import SendCoffeeDialog from '../SendCoffeeDialog/SendCoffeeDialog'
import { useAppDispatch } from '../../hooks/useAppDispatchSelector'
import { ReduxActions } from '../../models/redux/reduxResource'

interface Props {
  id: number
  coffeeName: string
  pic: string
}

// EditDeleteShareMenu appears when the 'more' icon is clicked on a CoffeeCard
// or in CoffeeDetails, where users can edit, delete, or share a coffee
export default function EditDeleteShareCoffeeMenu({ id, coffeeName, pic }: Props) {
  const dispatch = useAppDispatch()
  const history = useHistory()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [sendDialogOpen, setSendDialogOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLButtonElement) | null>(
    null
  )

  // Opens the send coffee dialog
  const openShare = () => {
    setSendDialogOpen(true)
    setAnchorEl(null)
  }

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
        <MenuItem onClick={openShare}>
          <ListItemIcon>
            <Share />
          </ListItemIcon>
          <ListItemText primary="Share Coffee" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null)
            history.push(`/edit-coffee/${id}`)
            dispatch({ type: ReduxActions.CLEAR_ONE_COFFEE })
          }}
        >
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText primary="Edit Coffee" />
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
          <ListItemText primary="Delete Coffee" />
        </MenuItem>
      </Menu>
      <DeleteCoffeeBrewDialog
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        coffeeId={id}
      />
      <SendCoffeeDialog
        sendDialogOpen={sendDialogOpen}
        setSendDialogOpen={setSendDialogOpen}
        id={id}
        coffeeName={coffeeName}
        pic={pic}
      />
    </>
  )
}
