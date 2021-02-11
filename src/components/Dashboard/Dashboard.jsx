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
} from '@material-ui/core';
import CoffeeCard from '../CoffeeCard/CoffeeCard';

function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const coffees = useSelector((store) => store.coffees);
  const [anchorEl, setAnchorEl] = useState(null);
  const [favSwitch, setFavSwitch] = useState(false);

  useEffect(() => {
    dispatch({ type: 'FETCH_COFFEES' });
    dispatch({ type: 'FETCH_FLAVORS' });
  }, []);

  const handleSort = (howSort) => {
    setAnchorEl(null);
    if (howSort === 'country' || howSort === 'producer') {
      coffees.sort((a, b) => {
        if (a.is_blend && b.is_blend) {
          return a.blend_name.localeCompare(b.blend_name);
        } else if (a.is_blend) {
          return a.blend_name.localeCompare(b[howSort]);
        } else if (b.is_blend) {
          return a[howSort].localeCompare(b.blend_name);
        } else {
          return a[howSort].localeCompare(b[howSort]);
        }
      });
    } else if (howSort === 'date') {
      return coffees.sort((a, b) => b[howSort].localeCompare(a[howSort]));
    } else {
      return coffees.sort((a, b) => a[howSort].localeCompare(b[howSort]));
    }
  };

  return (
    <>
      <Box display="flex" alignItems="center" px={2}>
        <Box flexGrow={1}>
          <Typography variant="h6">{user.name}'s Dashboard</Typography>
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={favSwitch}
                onChange={() => setFavSwitch(!favSwitch)}
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
      <Box display="flex" flexWrap="wrap" justifyContent="center">
        {favSwitch
          ? coffees.map((coffeeItem) => {
              if (coffeeItem.is_fav) {
                return <CoffeeCard key={coffeeItem.id} coffee={coffeeItem} />;
              }
            })
          : coffees.map((coffeeItem) => {
              return <CoffeeCard key={coffeeItem.id} coffee={coffeeItem} />;
            })}
      </Box>
    </>
  );
}

export default Dashboard;
