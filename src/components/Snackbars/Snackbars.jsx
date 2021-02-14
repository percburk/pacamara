import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, Fade } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

function Snackbars() {
  const dispatch = useDispatch();
  const snackbars = useSelector((store) => store.snackbars);

  return (
    <Snackbar
      open={snackbars.open}
      autoHideDuration={6000}
      TransitionComponent={Fade}
      onClose={() => dispatch({ type: 'CLEAR_SNACKBARS' })}
    >
      <Alert
        variant="filled"
        severity={snackbars.severity}
        TransitionComponent={Fade}
        onClose={() => dispatch({ type: 'CLEAR_SNACKBARS' })}
      >
        {snackbars.string}
      </Alert>
    </Snackbar>
  );
}

export default Snackbars;
