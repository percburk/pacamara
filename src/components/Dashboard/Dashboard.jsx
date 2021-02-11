import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  Button,
  FormControlLabel,
  Switch,
  Snackbar,
  IconButton,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import CoffeeCard from '../CoffeeCard/CoffeeCard';

function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const coffees = useSelector((store) => store.coffees);
  const snackbars = useSelector((store) => store.snackbars);
  const [anchorEl, setAnchorEl] = useState(null);
  const [favFilter, setFavFilter] = useState(false);
  const [sort, setSort] = useState('date');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    dispatch({ type: 'FETCH_COFFEES' });
    dispatch({ type: 'FETCH_FLAVORS' });
    checkSnackbar();
  }, []);

  const checkSnackbar = () => {
    if (snackbars) {
      setSnackbarOpen(true);
    }
  };

  const handleSort = (howToSort) => {
    setSort(howToSort);
    setAnchorEl(null);
  };

  const sortedCoffees = coffees.sort((a, b) => {
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

  return (
    <>
      <Box display="flex" px={2}>
        <Box flexGrow={1}>
          <Typography variant="h6">{user.name}'s Dashboard</Typography>
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={favFilter}
                onChange={() => setFavFilter(!favFilter)}
                color="primary"
              />
            }
            label="Favorites"
          />
          <Button
            variant="outlined"
            onClick={(event) => setAnchorEl(event.currentTarget)}
          >
            Sort
          </Button>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => handleSort('date')}>Date</MenuItem>
            <MenuItem onClick={() => handleSort('country')}>Country</MenuItem>
            <MenuItem onClick={() => handleSort('producer')}>Producer</MenuItem>
            <MenuItem onClick={() => handleSort('roaster')}>Roaster</MenuItem>
          </Menu>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" flexWrap="wrap">
        {favFilter
          ? sortedCoffees.map((coffeeItem, i) => {
              if (coffeeItem.is_fav) {
                return (
                  <CoffeeCard
                    key={coffeeItem.id}
                    index={i}
                    coffee={coffeeItem}
                    setSnackbarOpen={setSnackbarOpen}
                  />
                );
              }
            })
          : sortedCoffees.map((coffeeItem, i) => {
              return (
                <CoffeeCard
                  key={coffeeItem.id}
                  index={i}
                  coffee={coffeeItem}
                  setSnackbarOpen={setSnackbarOpen}
                />
              );
            })}
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbars}
        action={
          <IconButton size="small" onClick={() => setSnackbarOpen(false)}>
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
}

export default Dashboard;
