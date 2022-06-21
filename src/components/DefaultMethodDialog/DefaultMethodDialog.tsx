import { useState } from 'react'
import { UseStylesReturnType } from '../UpdateProfile/UpdateProfile'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  Button,
  Collapse,
  IconButton,
  Chip,
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { Close } from '@material-ui/icons'
// Hooks
import { useAppSelector } from '../../hooks/useAppDispatchSelector'
// Models
import { UpdateProfileState } from '../../models/stateResource'

interface Props {
  newUpdates: UpdateProfileState
  setNewUpdates: (newUpdates: UpdateProfileState) => void
  defaultDialogOpen: boolean
  setDefaultDialogOpen: (open: boolean) => void
  classes: UseStylesReturnType
  handleSubmit: () => void
}

// DefaultMethodDialog opens when a user is creating or editing their profile,
// asking if they would like to set one of their owned brew methods as their
// default, is then auto filled when adding new brew instances
export default function DefaultMethodDialog({
  newUpdates,
  setNewUpdates,
  defaultDialogOpen,
  setDefaultDialogOpen,
  classes,
  handleSubmit,
}: Props) {
  const methods = useAppSelector((store) => store.methods)
  const [collapseOpen, setCollapseOpen] = useState<boolean>(false)

  // Cancels default method choice and brings the user back to UpdateProfile
  const handleCancel = () => {
    setDefaultDialogOpen(false)
    setNewUpdates({
      ...newUpdates,
      methodsDefaultId: null,
      methodsDefaultLrr: null,
    })
  }

  // Submits the user's information without a default brew method
  const handleNoDefault = () => {
    setNewUpdates({
      ...newUpdates,
      methodsDefaultId: null,
      methodsDefaultLrr: null,
    })
    handleSubmit()
  }

  // Adds the selected default brew method to local state object
  const setDefault = (id: number, lrr: number) => {
    setNewUpdates({
      ...newUpdates,
      methodsDefaultId: id,
      methodsDefaultLrr: lrr,
    })
  }

  return (
    <Dialog open={defaultDialogOpen} onClose={() => setDefaultDialogOpen(false)}>
      <DialogTitle className={classes.centerText}>Default Brew Method</DialogTitle>
      <DialogContent>
        <DialogContentText align="center">
          Would you like to set a brew method as your default?
        </DialogContentText>
        <Box className={classes.root} display="flex" justifyContent="center">
          {methods.map((item) =>
            newUpdates.methodsArray?.includes(item.id) ? (
              <Chip
                key={item.id}
                label={item.name}
                color={item.id === newUpdates.methodsDefaultId ? 'primary' : 'default'}
                onClick={() => setDefault(item.id, item.lrr)}
              />
            ) : null
          )}
        </Box>
      </DialogContent>
      <Box display="flex" justifyContent="center">
        <DialogActions className={classes.root}>
          <Button variant="contained" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleNoDefault}>
            No Thanks
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              !newUpdates.methodsDefaultId ? setCollapseOpen(true) : handleSubmit()
            }
          >
            Submit
          </Button>
        </DialogActions>
      </Box>
      <Collapse in={collapseOpen}>
        <Alert
          severity="error"
          action={
            <IconButton size="small" onClick={() => setCollapseOpen(false)}>
              <Close fontSize="inherit" />
            </IconButton>
          }
        >
          Please select a default brew method, or click 'No Thanks'
        </Alert>
      </Collapse>
    </Dialog>
  )
}
