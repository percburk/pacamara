import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  makeStyles,
} from '@material-ui/core';

// Component styling classes
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

// CancelProfileDialog opens for a brand new user, if they would rather not
// fill out the information on UpdateProfile on initial login
// Only options are to log out, or cancel and stay in UpdateProfile
function CancelProfileDialog({ cancelDialogOpen, setCancelDialogOpen }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
      <DialogTitle align="center">Are you sure?</DialogTitle>
      <DialogContent>This will log you out of your new account.</DialogContent>
      <Box display="flex" justifyContent="center">
        <DialogActions>
          <Button
            className={classes.button}
            variant="contained"
            onClick={() => setCancelDialogOpen(false)}
          >
            No
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            onClick={() => {
              dispatch({ type: 'LOGOUT' });
              history.push('/home');
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default CancelProfileDialog;
