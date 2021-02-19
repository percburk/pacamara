import { useState } from 'react';
import { useSelector } from 'react-redux';
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
  Chip
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Close } from '@material-ui/icons';

function DefaultMethodDialog({
  newMethods,
  newUpdates,
  setNewUpdates,
  defaultDialogOpen,
  setDefaultDialogOpen,
  classes,
  handleSubmit,
}) {
  const methods = useSelector((store) => store.methods);
  const [collapseOpen, setCollapseOpen] = useState(false);

  return (
    <Dialog
      open={defaultDialogOpen}
      onClose={() => setDefaultDialogOpen(false)}
    >
      <DialogTitle align="center">Default Brew Method</DialogTitle>
      <DialogContent>
        <DialogContentText align="center">
          Would you like to set a brew method as your default?
        </DialogContentText>
        <Box className={classes.root} display="flex" justifyContent="center">
          {methods.map((item) => {
            if (newMethods.indexOf(item.id) > -1) {
              return (
                <Chip
                  key={item.id}
                  label={item.name}
                  color={
                    item.id === newUpdates.methods_default_id
                      ? 'primary'
                      : 'default'
                  }
                  onClick={() => {
                    setNewUpdates({
                      ...newUpdates,
                      methods_default_id: item.id,
                      methods_default_lrr: item.lrr,
                    });
                  }}
                />
              );
            }
          })}
        </Box>
      </DialogContent>
      <Box display="flex" justifyContent="center">
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              setDefaultDialogOpen(false);
              setNewUpdates({ ...newUpdates, methods_default_id: '' });
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setNewUpdates({ ...newUpdates, methods_default_id: '' });
              handleSubmit();
            }}
          >
            No Thanks
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              !newUpdates.methods_default_id
                ? setCollapseOpen(true)
                : handleSubmit()
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
  );
}

export default DefaultMethodDialog;
