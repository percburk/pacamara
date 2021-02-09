import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@material-ui/core';

function Dashboard() {
  // this component doesn't do much to start, just renders some user reducer info to the DOM
  const user = useSelector((store) => store.user);
  return (
    <Box className="container">
      <Typography variant="h5">Welcome, {user.username}!</Typography>
      <Typography>Your ID is: {user.id}</Typography>
    </Box>
  );
}

// this allows us to use <App /> in index.js
export default Dashboard;
