import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button, makeStyles } from '@material-ui/core';
// Custom hooks
import useQuery from '../../hooks/useQuery';
// Imported components
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
function Dashboard() {
  const query = useQuery();
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { name } = useSelector((store) => store.user);
  const coffees = useSelector((store) => store.coffees);
  const [sort, setSort] = useState('date');
  // Local state for the four filter possibilities
  const [filters, setFilters] = useState({
    is_fav: false,
    brewing: false,
    is_blend: false,
    shared_by_id: false,
  });
  // This local state sees if a user is new, and if so, displays a dialog
  // telling them to create a new profile
  const [newUserDialogOpen, setNewUserDialogOpen] = useState(
    !name ? true : false
  );

  // Checks to see if there's a search query in the URL
  const searchQuery = query.get('q');

  useEffect(() => {
    // Fetches list of users that is searchable when sending a shared coffee
    dispatch({ type: 'FETCH_SHARING_USER_LIST' });
    // Fetches list of all coffees, or those that match a searchQuery
    dispatch({ type: 'FETCH_COFFEES', payload: searchQuery || '' });
    // Fetch list of flavor palette entries from the database
    dispatch({ type: 'FETCH_FLAVORS' });
    // Checks if the user has any shared coffees to show on AvatarMenu
    dispatch({ type: 'FETCH_SHARED_COFFEES' });
    // Fetches pared down list of coffees that can be searched in bar on Nav
    dispatch({ type: 'FETCH_SEARCH' });
  }, []);

  // This long chain of sort() and filter() puts coffees through any sort or
  // filter options selected by the user, then displays on the DOM
  const displayCoffees = coffees.sort((a, b) => {
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
  });

  displayCoffees.filter((item) => {
    for (let key in filters) {
      if (filters[key]) {
        
      } else {
        return item;
      }
    }
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
          {searchQuery && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => history.push('/dashboard')}
            >
              Go Back
            </Button>
          )}
          <FilterMenu filters={filters} setFilters={setFilters} />
          <SortMenu sort={sort} setSort={setSort} />
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" flexWrap="wrap">
        {displayCoffees.map((coffeeItem) => (
          <CoffeeCard key={coffeeItem.id} coffee={coffeeItem} />
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

export default Dashboard;
