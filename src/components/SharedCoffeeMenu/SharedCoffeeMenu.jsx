import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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

// Component styling classes
const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(2),
  },
}));

// SharedCoffeeMenu displays the list of coffees sent from others users
export default function SharedCoffeeMenu({
  sharedOpen,
  setSharedOpen,
  setAvatarAnchorEl,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const sharedCoffees = useSelector((store) => store.sharedCoffees);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCoffee, setSelectedCoffee] = useState({});

  // Opens the selected coffee in SharedCoffeeDialog and fetches its details
  const handleClickCoffee = (id) => {
    dispatch({ type: 'FETCH_ONE_SHARED_COFFEE', payload: id });
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
                handleClickCoffee(shared.coffees_id);
                setSelectedCoffee(shared);
              }}
            >
              <Avatar className={classes.small} src={shared.profile_pic}>
                {shared.username.charAt(0)}
              </Avatar>
              <Box>
                <Typography>{shared.username}</Typography>
                <Typography variant="subtitle2">
                  {shared.coffee_name}
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
