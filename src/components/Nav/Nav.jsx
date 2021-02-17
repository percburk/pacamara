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
  TextField,
} from '@material-ui/core';
import { Edit, Add, ViewModule, Search, Close } from '@material-ui/icons';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  medium: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  large: {
    width: theme.spacing(9),
    height: theme.spacing(9),
  },
  searchBar: {
    flexBasis: '30%',
    marginRight: theme.spacing(7),
  },
  searchBarIcons: {
    color: grey[600],
  },
}));

function Nav() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { name, username, profile_pic } = useSelector((store) => store.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState('');

  const handleSearch = (event) => {
    setSearch(event.target.value);
    dispatch({ type: 'FETCH_COFFEES', payload: event.target.value });
  };

  const handleHistorySearch = (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_SEARCH_STRING', payload: search });
    history.push('/dashboard');
  };

  const handleHistoryClearSearch = () => {
    dispatch({ type: 'CLEAR_SEARCH_STRING' });
    history.push('/dashboard');
  };

  return (
    <>
      <Box display="flex" alignItems="center" px={5} py={1} boxShadow={3}>
        <Box display="flex" alignItems="center" flexGrow={1}>
          <Box paddingRight={3}>
            <img
              src="/images/coffee-illustration.jpg"
              className={classes.large}
              onClick={handleHistoryClearSearch}
              style={{ cursor: 'pointer' }}
            />
          </Box>
          <Typography
            variant="h4"
            onClick={handleHistoryClearSearch}
            style={{ cursor: 'pointer' }}
          >
            PACAMARA
          </Typography>
        </Box>
        {name && (
          <form className={classes.searchBar} onSubmit={handleHistorySearch}>
            <TextField
              label="Search Coffees"
              variant="outlined"
              size="small"
              fullWidth
              value={search}
              InputProps={{
                endAdornment: search ? (
                  <Close
                    className={classes.searchBarIcons}
                    onClick={() => {
                      setSearch('');
                      dispatch({ type: 'FETCH_COFFEES' });
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <Search className={classes.searchBarIcons} />
                ),
              }}
              onChange={handleSearch}
            />
          </form>
        )}
        {!name ? (
          <Typography variant="h6">Your Coffee Companion</Typography>
        ) : (
          <Box display="flex" alignItems="center">
            <Avatar
              className={classes.medium}
              src={profile_pic}
              onClick={(event) => setAnchorEl(event.currentTarget)}
              style={{ cursor: 'pointer' }}
            >
              {name && name.charAt(0)}
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
          <ListItemText
            primary={name ? 'Edit Profile' : 'Create New Profile'}
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
