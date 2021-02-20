import { useSelector, useDispatch } from 'react-redux';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

// Snackbars displays any Snackbar alerts that have been dispatched by other
// components. Central location for all Snackbar instances.
function Snackbars() {
  const dispatch = useDispatch();
  const snackbars = useSelector((store) => store.snackbars);

  return (
    <Snackbar
      open={snackbars.open}
      autoHideDuration={3000}
      onClose={() => dispatch({ type: 'CLEAR_SNACKBARS' })}
    >
      {snackbars.string && (
        <Alert
          variant="filled"
          severity={snackbars.severity}
          onClose={() => dispatch({ type: 'CLEAR_SNACKBARS' })}
        >
          {snackbars.string}
        </Alert>
      )}
    </Snackbar>
  );
}

export default Snackbars;
