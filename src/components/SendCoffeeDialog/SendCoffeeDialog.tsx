import { useState, ChangeEvent } from 'react';
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
  Collapse,
  IconButton,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Close } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
// Hooks
import {
  useAppSelector,
  useAppDispatch,
} from '../../hooks/useAppDispatchSelector';
// Models
import { SagaActions } from '../../models/redux/sagaResource';
import { ReduxActions } from '../../models/redux/reduxResource';

// Styling
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    width: '11ch',
  },
  avatar: {
    marginRight: theme.spacing(3),
  },
  image: {
    height: 150,
    width: 150,
    objectFit: 'cover',
    margin: theme.spacing(3),
  },
  inputs: {
    margin: theme.spacing(1),
  },
  textCenter: {
    textAlign: 'center',
  },
}));

interface Props {
  sendDialogOpen: boolean;
  setSendDialogOpen: (open: boolean) => void;
  id: number;
  coffeeName: string;
  pic: string;
}

// SendCoffeeDialog opens when a user wants to share a coffee with another user
// Contains a searchable list of users, as well as a field for a message
export default function SendCoffeeDialog({
  sendDialogOpen,
  setSendDialogOpen,
  id,
  coffeeName,
  pic,
}: Props) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const sharingUserList = useAppSelector((store) => store.sharingUserList);
  const [shareUsername, setShareUsername] = useState<string>('');
  const [shareMessage, setShareMessage] = useState<string>('');
  const [listOpen, setListOpen] = useState<boolean>(false);
  const [errorOpen, setErrorOpen] = useState<boolean>(false);

  // Toggles the Autocomplete menu opening only when the user is typing in the
  // TextField
  const handleListOpen = () => {
    if (shareUsername.length > 0) {
      setListOpen(true);
    }
  };

  // Updates the username that the coffee will be sent to in local state
  const handleShareUsername = (event: ChangeEvent<{}>, newValue: string) => {
    setShareUsername(newValue);
    newValue.length > 0 ? setListOpen(true) : setListOpen(false);
  };

  // Handles sending this coffee to another selected user
  const handleSendShare = () => {
    // Finds the matching ID number of the user that is being sent to
    const match = sharingUserList.find(
      (user) => user.username === shareUsername
    )?.id;

    if (match) {
      dispatch({
        type: SagaActions.SEND_SHARED_COFFEE,
        payload: {
          recipient_id: match,
          coffees_id: id,
          coffee_name: coffeeName,
          message: shareMessage,
        },
      });
      dispatch({ type: ReduxActions.SNACKBARS_SENT_SHARED_COFFEE });
      setShareUsername('');
      setShareMessage('');
      setSendDialogOpen(false);
    } else {
      setErrorOpen(true);
    }
  };

  return (
    <Dialog open={sendDialogOpen} onClose={() => setSendDialogOpen(false)}>
      <DialogTitle className={classes.textCenter}>
        Share {coffeeName}
      </DialogTitle>
      <DialogContent>
        <DialogContentText align="center">
          Who would you like to share this coffee with?
        </DialogContentText>
        <Box display="flex" alignItems="center">
          {pic && <img alt="coffee bag" src={pic} className={classes.image} />}
          <Box>
            <Autocomplete
              className={classes.inputs}
              open={listOpen}
              onOpen={handleListOpen}
              onClose={() => setListOpen(false)}
              freeSolo
              fullWidth
              inputValue={shareUsername}
              onInputChange={handleShareUsername}
              options={sharingUserList}
              getOptionLabel={(user) => user.username}
              renderOption={(user) => (
                <Box display="flex" alignItems="center">
                  <Avatar className={classes.avatar} src={user.profilePic} />
                  {user.username}
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
              className={classes.inputs}
              label="Message"
              variant="outlined"
              fullWidth
              multiline
              rows={6}
              onChange={(event) => setShareMessage(event.target.value)}
              value={shareMessage}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setSendDialogOpen(false)}
          variant="contained"
          className={classes.button}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSendShare}
          variant="contained"
          color="primary"
          className={classes.button}
        >
          Send
        </Button>
      </DialogActions>
      <Collapse in={errorOpen}>
        <Alert
          severity="error"
          action={
            <IconButton size="small" onClick={() => setErrorOpen(false)}>
              <Close fontSize="inherit" />
            </IconButton>
          }
        >
          Please select a user.
        </Alert>
      </Collapse>
    </Dialog>
  );
}
