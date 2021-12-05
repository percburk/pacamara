import { useHistory } from 'react-router-dom'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  makeStyles,
  DialogContentText,
} from '@material-ui/core'

// Styling
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  textCenter: {
    textAlign: 'center',
  },
}))

interface Props {
  newUserDialogOpen: boolean
  setNewUserDialogOpen: (set: boolean) => void
}

// NewUserDialog opens if the user is logging in for the first time
// or has not created a profile yet, only redirects to UpdateProfile
export default function NewUserDialog({
  newUserDialogOpen,
  setNewUserDialogOpen,
}: Props) {
  const classes = useStyles()
  const history = useHistory()

  return (
    <Dialog
      open={newUserDialogOpen}
      onClose={() => setNewUserDialogOpen(false)}
    >
      <DialogTitle className={classes.textCenter}>
        Welcome to Pacamara!
      </DialogTitle>
      <DialogContent>
        <DialogContentText align="center">
          Let's set you up with a new profile.
        </DialogContentText>
      </DialogContent>
      <Box display="flex" justifyContent="center">
        <DialogActions>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={() => history.push('/profile/new')}
          >
            Let's go
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
