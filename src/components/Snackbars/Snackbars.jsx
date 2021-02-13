import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';

function Snackbars() {
  const dispatch = useDispatch();
  const snackbars = useSelector((store) => store.snackbars);

  return (
    <Snackbar
      open={snackbars.open}
      autoHideDuration={6000}
      onClose={() => dispatch({ type: 'CLEAR_SNACKBARS' })}
      message={snackbars.string}
      action={
        <IconButton
          size="small"
          onClick={() => dispatch({ type: 'CLEAR_SNACKBARS' })}
        >
          <Close fontSize="small" />
        </IconButton>
      }
    />
  );
}

export default Snackbars;
