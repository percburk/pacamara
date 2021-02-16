import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Typography,
  Box,
  Avatar,
  makeStyles,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@material-ui/core';
import { Edit, Add, ViewModule } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  medium: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  large: {
    width: theme.spacing(9),
    height: theme.spacing(9),
  },
}));

function Nav() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((store) => store.user);
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        px={5}
        py={1}
        justifyContent="space-between"
        boxShadow={3}
      >
        <Box display="flex" alignItems="center">
          <Box paddingRight={3}>
            <img
              src="/images/coffee-illustration.jpg"
              className={classes.large}
              onClick={() => history.push('/dashboard')}
              style={{ cursor: 'pointer' }}
            />
          </Box>
          <Typography
            variant="h4"
            onClick={() => history.push('/dashboard')}
            style={{ cursor: 'pointer' }}
          >
            PACAMARA
          </Typography>
        </Box>
        {!user.name ? (
          <Typography variant="h6">Your Coffee Companion</Typography>
        ) : (
          <Box display="flex" alignItems="center">
            <Avatar
              className={classes.medium}
              src={user.profile_pic}
              onClick={(event) => setAnchorEl(event.currentTarget)}
              style={{ cursor: 'pointer' }}
            >
              {user.name && user.name.charAt(0)}
            </Avatar>
          </Box>
        )}
      </Box>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <Box display="flex" justifyContent="center" py={1}>
          <Avatar className={classes.large} src={user.profile_pic}>
            {user.name && user.name.charAt(0)}
          </Avatar>
        </Box>
        <Box py={1}>
          <Typography align="center">{user.name}</Typography>
          <Typography align="center">{user.username}</Typography>
        </Box>
        <MenuItem
          onClick={() => {
            history.push('/dashboard');
            setAnchorEl(null);
            dispatch({ type: 'CLEAR_SNACKBARS' });
          }}
        >
          <ListItemIcon>
            <ViewModule />
          </ListItemIcon>
          <ListItemText primary="Go To Dashboard" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            history.push('/profile/update');
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText
            primary={user.name ? 'Edit Profile' : 'Create New Profile'}
          />
        </MenuItem>
        <MenuItem
          onClick={() => {
            history.push('/addCoffee');
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText primary="Add a New Coffee" />
        </MenuItem>
        <Box display="flex" justifyContent="center" py={2}>
          <Button
            variant="outlined"
            onClick={() => {
              dispatch({ type: 'LOGOUT' });
              history.push('/home');
              setAnchorEl(null);
            }}
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </>
  );
}

export default Nav;
