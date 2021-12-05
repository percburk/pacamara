import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  makeStyles,
} from '@material-ui/core'
// Hooks
import { useAppDispatch } from '../../hooks/useAppDispatchSelector'
// Models
import { SagaActions } from '../../models/redux/sagaResource'
import { ReduxActions } from '../../models/redux/reduxResource'

// Styling
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  centerText: {
    textAlign: 'center',
  },
}))

interface Props {
  deleteDialogOpen: boolean
  setDeleteDialogOpen: (open: boolean) => void
  coffeeId?: number
  brewId?: number
}

// Opens to make sure a user wants to delete a coffee from their dashboard
export default function DeleteCoffeeBrewDialog({
  deleteDialogOpen,
  setDeleteDialogOpen,
  coffeeId,
  brewId,
}: Props) {
  const classes = useStyles()
  const location = useLocation()
  const history = useHistory()
  const dispatch = useAppDispatch()

  // Checks to see if there is a search query in the URL
  const { q } = queryString.parse(location.search)

  // Deletes the coffee from the user's dashboard
  const handleDelete = () => {
    setDeleteDialogOpen(false)
    if (brewId) {
      dispatch({
        type: SagaActions.DELETE_BREW,
        payload: { coffeeId, brewId },
      })
      dispatch({ type: ReduxActions.SNACKBARS_DELETED_BREW })
    } else {
      dispatch({
        type: SagaActions.DELETE_COFFEE,
        payload: { coffeeId, q },
      })
      dispatch({ type: ReduxActions.SNACKBARS_DELETED_COFFEE })
      location.search
        ? history.push(`/dashboard/${location.search}`)
        : history.push('/dashboard')
    }
  }

  return (
    <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
      <DialogTitle className={classes.centerText}>Delete Coffee</DialogTitle>
      <DialogContent>
        <DialogContentText align="center">
          Are you sure you want to delete this {brewId ? 'brew' : 'coffee'}?
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
  )
}
