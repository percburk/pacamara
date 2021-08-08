import { useState } from 'react';
import {
  useAppSelector,
  useAppDispatch,
} from '../../hooks/useAppDispatchSelector';
import {
  Collapse,
  MenuItem,
  Avatar,
  makeStyles,
  Divider,
  Typography,
  Box,
} from '@material-ui/core';
// Imported components
import SharedCoffeeDialog from '../SharedCoffeeDialog/SharedCoffeeDialog';
import { SagaActions } from '../../models/redux/sagaResource';
import { SharedCoffees } from '../../models/modelResource';

// Component styling classes
const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(2),
  },
}));

interface Props {
  sharedOpen: boolean;
  setSharedOpen: (set: boolean) => void;
  setAvatarAnchorEl: (set: null) => void;
}

// SharedCoffeeMenu displays the list of coffees sent from others users
export default function SharedCoffeeMenu({
  sharedOpen,
  setSharedOpen,
  setAvatarAnchorEl,
}: Props) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const sharedCoffees = useAppSelector((store) => store.sharedCoffees);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCoffee, setSelectedCoffee] = useState<SharedCoffees>({
    id: 0,
    senderId: 0,
    recipientId: 0,
    coffeesId: 0,
    message: '',
    profilePic: '',
    coffeeName: '',
    username: '',
  });

  // Opens the selected coffee in SharedCoffeeDialog and fetches its details
  const handleClickCoffee = (id: number) => {
    dispatch({ type: SagaActions.FETCH_ONE_SHARED_COFFEE, payload: id });
    setDialogOpen(true);
  };

  return (
    <>
      <Collapse in={sharedOpen}>
        <Divider />
        {sharedCoffees.map((shared) => {
          return (
            <MenuItem
              key={shared.id}
              onClick={() => {
                handleClickCoffee(shared.coffeesId);
                setSelectedCoffee(shared);
              }}
            >
              <Avatar className={classes.small} src={shared.profilePic}>
                {shared.username.charAt(0)}
              </Avatar>
              <Box>
                <Typography>{shared.username}</Typography>
                <Typography variant="subtitle2">
                  {shared.coffeeName}
                </Typography>
              </Box>
            </MenuItem>
          );
        })}
        <Divider />
      </Collapse>
      <SharedCoffeeDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        selectedCoffee={selectedCoffee}
        setAvatarAnchorEl={setAvatarAnchorEl}
        setSharedOpen={setSharedOpen}
      />
    </>
  );
}
