import React from 'react';
import { Typography, Box } from '@material-ui/core';

// This is one of our simplest components
// It doesn't have local state, so it can be a function component.
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is, so it doesn't need 'connect()'

function Footer() {
  return (
    <Box p={3}>
      <Typography align="right">&copy; Pacamara, 2021</Typography>
    </Box>
  );
}

export default Footer;
