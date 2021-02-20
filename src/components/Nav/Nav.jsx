import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Typography,
  Box,
  Avatar,
  makeStyles,
  withStyles,
  TextField,
  Badge,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Search } from '@material-ui/icons';
import { grey } from '@material-ui/core/colors';
// Imported components
import AvatarMenu from '../AvatarMenu/AvatarMenu';

// Component styling classes
const useStyles = makeStyles((theme) => ({
  logo: {
    width: 70,
    height: 70,
  },
  searchBar: {
    flexBasis: '30%',
    marginRight: theme.spacing(7),
    display: 'flex',
    alignItems: 'center',
  },
  searchBarIcon: {
    color: grey[600],
    marginRight: theme.spacing(1),
  },
}));

// Custom component for displaying a badge on a user's avatar if they have
// shared coffees on their profile
const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: '#35baf6',
    color: '#35baf6',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      border: '1px solid currentColor',
      content: '""',
    },
  },
}))(Badge);

// Nav is the top navigation bar which stays constant throughout the app
function Nav() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { name, profile_pic } = useSelector((store) => store.user);
  const search = useSelector((store) => store.search);
  const sharedCoffees = useSelector((store) => store.sharedCoffees);
  const [avatarAnchorEl, setAvatarAnchorEl] = useState(null);
  const [autoOpen, setAutoOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Gets pared down list of coffees the user can search through
  useEffect(() => {
    dispatch({ type: 'FETCH_SEARCH' });
  }, []);

  // Keeps the Autocomplete list closed until the user starts typing in the 
  // search TextField
  const handleAutoOpen = () => {
    if (searchText.length > 0) {
      setAutoOpen(true);
    }
  };

  // Sets the search string in local state, toggles the Autocomplete list
  const handleSearch = (event, newValue) => {
    setSearchText(newValue);
    newValue.length > 0 ? setAutoOpen(true) : setAutoOpen(false);
  };

  // Sends search query, Dashboard picks up the URL change in UseEffect and 
  // sends a new GET with 'FETCH_COFFEES' to display search results
  const handleHistorySearch = (event) => {
    event.preventDefault();
    history.push(`/dashboard/?q=${searchText}`);
  };

  return (
    <>
      <Box display="flex" alignItems="center" px={5} py={1} boxShadow={3}>
        <Box display="flex" alignItems="center" flexGrow={1}>
          <Box paddingRight={3}>
            <img
              src="/images/pacamara-coffee.png"
              className={classes.logo}
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
        {name && (
          <form onSubmit={handleHistorySearch} className={classes.searchBar}>
            <Search className={classes.searchBarIcon} />
            <Autocomplete
              open={autoOpen}
              onOpen={handleAutoOpen}
              onClose={() => setAutoOpen(false)}
              freeSolo
              fullWidth
              inputValue={searchText}
              onInputChange={handleSearch}
              options={search.map((item) =>
                item.blend_name
                  ? `${item.roaster} ${item.blend_name}`
                  : `${item.roaster} ${item.country} ${item.producer}`
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Coffees"
                  variant="outlined"
                  size="small"
                  fullWidth
                  autoComplete="off"
                />
              )}
            />
          </form>
        )}
        {!name ? (
          <Typography variant="h6">Your Coffee Companion</Typography>
        ) : sharedCoffees[0] ? (
          <Box display="flex" alignItems="center">
            <StyledBadge
              overlap="circle"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              variant="dot"
            >
              <Avatar
                className={classes.medium}
                src={profile_pic}
                onClick={(event) => setAvatarAnchorEl(event.currentTarget)}
                style={{ cursor: 'pointer' }}
              >
                {name && name.charAt(0)}
              </Avatar>
            </StyledBadge>
          </Box>
        ) : (
          <Box display="flex" alignItems="center">
            <Avatar
              className={classes.medium}
              src={profile_pic}
              onClick={(event) => setAvatarAnchorEl(event.currentTarget)}
              style={{ cursor: 'pointer' }}
            >
              {name && name.charAt(0)}
            </Avatar>
          </Box>
        )}
      </Box>
      <AvatarMenu
        avatarAnchorEl={avatarAnchorEl}
        setAvatarAnchorEl={setAvatarAnchorEl}
      />
    </>
  );
}

export default Nav;
