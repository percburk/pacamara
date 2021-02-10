import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from '@material-ui/core';
import CoffeeCard from '../CoffeeCard/CoffeeCard';

function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const coffees = useSelector((store) => store.coffees);
  const [sort, setSort] = useState('date');

  useEffect(() => {
    dispatch({ type: 'FETCH_COFFEES' });
    dispatch({ type: 'FETCH_FLAVORS' });
  }, []);

  return (
    <>
      <Box display="flex">
        <Typography variant="h6">{user.name}'s Dashboard</Typography>
        <FormControl>
          <InputLabel id="sort-select-label">Sort</InputLabel>
          <Select
            labelId="sort-select-label"
            value={sort}
            variant="outlined"
          ></Select>
        </FormControl>
      </Box>
      <Box display="flex" flexWrap="wrap" justifyContent="center">
        {coffees.map((coffeeItem) => {
          return <CoffeeCard key={coffeeItem.id} coffee={coffeeItem} />;
        })}
      </Box>
    </>
  );
}

export default Dashboard;
