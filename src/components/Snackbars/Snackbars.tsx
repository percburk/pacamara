import { Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
// Hooks
import {
  useAppSelector,
  useAppDispatch,
} from '../../hooks/useAppDispatchSelector'
// Models
import { ReduxActions } from '../../models/redux/reduxResource'

// Snackbars displays any Snackbar alerts that have been dispatched by other
// components. Central location for all Snackbar instances.
export default function Snackbars() {
  const dispatch = useAppDispatch()
  const { string, open, severity } = useAppSelector((store) => store.snackbars)

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={() => dispatch({ type: ReduxActions.CLEAR_SNACKBARS })}
    >
      <Alert
        variant="filled"
        severity={severity}
        onClose={() => dispatch({ type: ReduxActions.CLEAR_SNACKBARS })}
      >
        {string}
      </Alert>
    </Snackbar>
  )
}
