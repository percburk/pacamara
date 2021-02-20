import React from 'react';
import { Typography, Box } from '@material-ui/core';

// Maintains whitespace on the bottom of the page and displays copyright
function Footer() {
  return (
    <Box p={3}>
      <Typography align="right">&copy; Pacamara, 2021</Typography>
    </Box>
  );
}

export default Footer;
