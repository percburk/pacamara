import { useSelector } from 'react-redux';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  DialogContentText,
} from '@material-ui/core';

function SharedCoffeeDialog({ open, setOpen, sentUsername }) {
  const { is_blend, country, producer } = useSelector(
    (store) => store.oneSharedCoffee
  );

  const nameToDisplay = is_blend ? blend_name : `${country} ${producer}`;

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>{sentUsername} shared a coffee with you:</DialogTitle>
      <DialogContent>
        <DialogContentText>{nameToDisplay}</DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

export default SharedCoffeeDialog;
