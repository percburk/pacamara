import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography } from '@material-ui/core';
import CoffeeCard from '../CoffeeCard/CoffeeCard';

function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const coffees = useSelector((store) => store.coffees);

  useEffect(() => {
    dispatch({ type: 'FETCH_COFFEES' });
    dispatch({ type: 'FETCH_FLAVORS' });
  }, []);

  console.log(coffees);

  return (
    <>
      <Box>
        <Typography variant="h6" align="center">
          {user.name}'s Dashboard
        </Typography>
      </Box>
      <Box display="flex" flexWrap="wrap" justifyContent="center">
        {coffees.map((coffeeItem) => {
          return <CoffeeCard key={coffeeItem.id} coffee={coffeeItem} />;
        })}
      </Box>
    </>
  );
}

// this allows us to use <App /> in index.js
export default Dashboard;
