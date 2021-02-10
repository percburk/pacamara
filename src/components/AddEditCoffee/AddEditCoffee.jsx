import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Box, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

function AddEditCoffee() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  return (

    <>
    <Box>
      <Typography>Add New Coffee</Typography>
    </Box>
    </>
  )
}

export default AddEditCoffee;
