import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { Box, Typography, makeStyles } from '@material-ui/core';
// Components
import CoffeeCard from '../CoffeeCard/CoffeeCard';
import Snackbars from '../Snackbars/Snackbars';
import FilterMenu from '../FilterMenu/FilterMenu';
import SortMenu from '../SortMenu/SortMenu';
import NewUserDialog from '../NewUserDialog/NewUserDialog';

// Component styling classes
const useStyles = makeStyles((theme) => ({
  sortFilter: {
    '& > *': {
      marginLeft: theme.spacing(1.5),
    },
  },
}));

// Dashboard is the user's homepage. It shows all the coffees in the user's
// collection, displayed as multiple CoffeeCard components
export default function Dashboard() {
  const location = useLocation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { name } = useSelector((store) => store.user);
  const coffees = useSelector((store) => store.coffees);
  const [sort, setSort] = useState('date');
  // This local state sees if a user is new, and if so, displays a dialog
  // telling them to create a new profile
  const [newUserDialogOpen, setNewUserDialogOpen] = useState(
    !name ? true : false
  );
  // Checks to see if there's a search query or filters in the URL
  const { q, filters } = queryString.parse(location.search, {
    arrayFormat: 'bracket',
  });

  useEffect(() => {
    // Fetches list of users that is searchable when sending a shared coffee
    dispatch({ type: 'FETCH_SHARING_USER_LIST' });
    // Fetches list of all coffees, or those that match the query in 'q'
    dispatch({ type: 'FETCH_COFFEES', payload: q });
    // Fetch list of flavor palette entries from the database
    dispatch({ type: 'FETCH_FLAVORS' });
    // Checks if the user has any shared coffees to show on AvatarMenu
    dispatch({ type: 'FETCH_SHARED_COFFEES' });
    // Fetches pared down list of coffees that can be searched in bar on Nav
    dispatch({ type: 'FETCH_COFFEE_SEARCH_LIST' });
  }, [dispatch, q]);

  // Puts coffees array through any sort or filters set in state
  // displayCoffees is then what is rendered on the DOM
  const displayCoffees = coffees
    .sort((a, b) => {
      if (sort === 'date') {
        return b[sort] > a[sort] ? 1 : -1;
      } else {
        if (a[sort] === b[sort]) {
          return 0;
        } else if (a[sort] === '') {
          return 1;
        } else if (b[sort] === '') {
          return -1;
        } else {
          return a[sort] < b[sort] ? -1 : 1;
        }
      }
    })
    .filter((coffee) => {
      if (filters) {
        for (let dataKey of filters) {
          if (!coffee[dataKey]) {
            return false;
          }
        }
      }
      return true;
    });

  return (
    <>
      <Box display="flex" p={4}>
        <Box flexGrow={1}>
          <Typography variant="h6">
            {name ? `${name}'s Dashboard` : 'Welcome!'}
          </Typography>
        </Box>
        <Box className={classes.sortFilter}>
          <FilterMenu />
          <SortMenu sort={sort} setSort={setSort} />
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" flexWrap="wrap">
        {displayCoffees.map((coffee) => (
          <CoffeeCard key={coffee.id} coffee={coffee} />
        ))}
      </Box>
      <Snackbars />
      <NewUserDialog
        newUserDialogOpen={newUserDialogOpen}
        setNewUserDialogOpen={setNewUserDialogOpen}
      />
    </>
  );
}
