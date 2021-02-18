import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Menu,
  Box,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
  Avatar,
  makeStyles,
  Typography,
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

function AvatarMenu({ anchorEl, setAnchorEl }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const { name, username, profile_pic } = useSelector((store) => store.user);

  return (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(null)}
    >
      <Box display="flex" justifyContent="center" py={1}>
        <Avatar className={classes.large} src={profile_pic}>
          {name && name.charAt(0)}
        </Avatar>
      </Box>
      <Box py={1}>
        <Typography align="center">{name}</Typography>
        <Typography align="center">{username}</Typography>
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
        <ListItemText primary={name ? 'Edit Profile' : 'Create New Profile'} />
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
  );
}

export default AvatarMenu;
