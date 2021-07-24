import { ChangeEvent, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppDispatchSelector';
import queryString from 'query-string';
import {
  Typography,
  Box,
  makeStyles,
  withStyles,
  TextField,
  Badge,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Search } from '@material-ui/icons';
import { grey } from '@material-ui/core/colors';
// Components
import AvatarMenu from '../AvatarMenu/AvatarMenu';
import pacamaraLogo from '../../images/pacamara-logo.png';

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
export default function Nav() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { name } = useAppSelector((store) => store.user);
  const coffeeSearchList = useAppSelector((store) => store.coffeeSearchList);
  const sharedCoffees = useAppSelector((store) => store.sharedCoffees);
  const [autoOpen, setAutoOpen] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');

  // Checks to see if there is any data currently in the URL
  const { filters } = queryString.parse(location.search, {
    arrayFormat: 'bracket',
  });

  // Keeps the Autocomplete list closed until the user starts typing in the
  // search TextField
  const handleAutoOpen = () => {
    if (searchInput.length > 0) {
      setAutoOpen(true);
    }
  };

  // Sets the search string in state, toggles the Autocomplete list showing
  const handleSearchBar = (event: ChangeEvent<{}>, newValue: string) => {
    setSearchInput(newValue);
    newValue.length > 0 ? setAutoOpen(true) : setAutoOpen(false);
  };

  // Sends search query, Dashboard picks up the URL change in UseEffect and
  // sends a new GET with 'FETCH_COFFEES' to display search results
  const handleHistorySearch = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newString = queryString.stringify({
      filters,
      q: searchInput,
    });
    history.push(`/dashboard/?${newString}`);
  };

  return (
    <>
      <Box display="flex" alignItems="center" px={5} py={1} boxShadow={3}>
        <Box display="flex" alignItems="center" flexGrow={1}>
          <Box paddingRight={3}>
            <img
              src={pacamaraLogo}
              className={classes.logo}
              onClick={() => history.push('/dashboard')}
              style={{ cursor: 'pointer' }}
            />
          </Box>
          <Typography
            variant="h3"
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
              inputValue={searchInput}
              onInputChange={handleSearchBar}
              options={coffeeSearchList.map((item) =>
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
        ) : (
          <Box display="flex" alignItems="center">
            {sharedCoffees[0] ? (
              <StyledBadge
                overlap="circle"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                variant="dot"
              >
                <AvatarMenu />
              </StyledBadge>
            ) : (
              <AvatarMenu />
            )}
          </Box>
        )}
      </Box>
    </>
  );
}
