import { useHistory } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  makeStyles,
} from '@material-ui/core';

// Component styling classes
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

// NewUserDialog opens if the user is logging in for the first time
// or has not created a profile yet, only redirects to UpdateProfile
function NewUserDialog({ open, setOpen }) {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle align="center">Welcome to Pacamara!</DialogTitle>
      <DialogContent align="center">
        Let's set you up with a new profile.
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
  );
}

export default NewUserDialog;
