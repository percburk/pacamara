import { useHistory } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@material-ui/core';

function newUserDialog({open, setOpen}) {
  const history = useHistory();

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
    >
      <DialogTitle align="center">Welcome to Pacamara!</DialogTitle>
      <DialogContent align="center">
        Let's set you up with a new profile.
      </DialogContent>
      <Box display="flex" justifyContent="center">
        <DialogActions>
          <Button
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

export default newUserDialog;
