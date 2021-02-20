import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  TextField,
  Avatar,
  makeStyles,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  avatar: {
    marginRight: theme.spacing(3),
  },
  image: {
    height: 150,
    width: 150,
    objectFit: 'cover',
    margin: theme.spacing(3),
  },
}));

function SendCoffeeDialog({ open, setOpen, id, coffeeName, pic }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const sharingUserList = useSelector((store) => store.sharingUserList);
  const [shareUsername, setShareUsername] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [listOpen, setListOpen] = useState(false);

  const handleListOpen = () => {
    if (shareUsername.length > 0) {
      setListOpen(true);
    }
  };

  const handleShareUsername = (event, newValue) => {
    setShareUsername(newValue);
    newValue.length > 0 ? setListOpen(true) : setListOpen(false);
  };
  const match = sharingUserList.find((item) => item.username === shareUsername);

  const handleSendShare = () => {
    dispatch({
      type: 'SEND_SHARED_COFFEE',
      payload: {
        recipient_id: match.id,
        coffees_id: id,
        coffee_name: coffeeName,
        message: shareMessage,
      },
    });
    dispatch({ type: 'SNACKBARS_SENT_SHARED_COFFEE' });
    setShareUsername('');
    setShareMessage('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle align="center">Share {coffeeName}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Who would you like to share this coffee with?
        </DialogContentText>
        <Box display="flex" alignItems="center">
          {pic && <img src={pic} className={classes.image} />}
          <Box>
            <Autocomplete
              open={listOpen}
              onOpen={handleListOpen}
              onClose={() => setListOpen(false)}
              freeSolo
              fullWidth
              inputValue={shareUsername}
              onInputChange={handleShareUsername}
              options={sharingUserList}
              getOptionLabel={(item) => item.username}
              renderOption={(item) => (
                <Box display="flex" alignItems="center">
                  <Avatar className={classes.avatar} src={item.profile_pic} />
                  {item.username}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Users"
                  variant="outlined"
                  size="small"
                  fullWidth
                  autoComplete="off"
                />
              )}
            />
            <TextField
              label="Message"
              variant="outlined"
              fullWidth
              multiline
              rows={5}
              onChange={(event) => setShareMessage(event.target.value)}
              value={shareMessage}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} variant="contained">
          Cancel
        </Button>
        <Button onClick={handleSendShare} variant="contained" color="primary">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SendCoffeeDialog;
