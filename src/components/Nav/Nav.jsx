import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import { Edit, Add } from '@material-ui/icons';

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
  const history = useHistory();
  const user = useSelector((store) => store.user);
  const [anchorEl, setAnchorEl] = useState(null);

  let loginLinkData = {
    path: '/login',
    text: 'Login / Register',
  };

  if (user.id != null) {
    loginLinkData.path = '/user';
    loginLinkData.text = 'Home';
  }

  const handleMenuOpen = (event) => {
    console.log('clicked!');
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        px={5}
        py={1}
        justifyContent="space-between"
        boxShadow={2}
        marginBottom={5}
      >
        <Box display="flex" alignItems="center">
          <Box paddingRight={3}>
            <img
              src="/images/coffee-illustration.jpg"
              className={classes.large}
              onClick={() => history.push('/home')}
              style={{ cursor: 'pointer' }}
            />
          </Box>
          <Typography
            variant="h4"
            onClick={() => history.push('/home')}
            style={{ cursor: 'pointer' }}
          >
            PACAMARA
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Avatar
            className={classes.medium}
            src={user.profile_pic}
            onClick={handleMenuOpen}
            style={{ cursor: 'pointer' }}
          >
            {user.name && user.name.charAt(0)}
          </Avatar>
        </Box>
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
        <MenuItem>
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText primary="Edit Profile" />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText primary="Add a New Coffee" />
        </MenuItem>
        <Box display="flex" justifyContent="center" py={2}>
          <Button variant="outlined">Logout</Button>
        </Box>
      </Menu>
    </>
  );
}

export default Nav;
