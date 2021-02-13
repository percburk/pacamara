import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  makeStyles,
} from '@material-ui/core';
import CoffeeCard from '../CoffeeCard/CoffeeCard';
import Snackbars from '../Snackbars/Snackbars';

const useStyles = makeStyles((theme) => ({
  chip: {
    '& > *': {
      marginLeft: theme.spacing(1.5),
    },
  },
}));

const sortArray = ['Date', 'Country', 'Producer', 'Roaster'];

function Dashboard() {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useSelector((store) => store.user);
  const coffees = useSelector((store) => store.coffees);
  const [anchorEl, setAnchorEl] = useState(null);
  const [favFilter, setFavFilter] = useState(false);
  const [brewingFilter, setBrewingFilter] = useState(false);
  const [sort, setSort] = useState('date');
  const [newUserDialogOpen, setNewUserDialogOpen] = useState(
    !user.name ? true : false
  );

  useEffect(() => {
    dispatch({ type: 'FETCH_COFFEES' });
    dispatch({ type: 'FETCH_FLAVORS' });
  }, []);

  const handleSort = (howToSort) => {
    setSort(howToSort);
    setAnchorEl(null);
  };

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
    .filter((item) => {
      if (favFilter) {
        if (item.is_fav) {
          return item;
        }
      } else {
        return item;
      }
    })
    .filter((item) => {
      if (brewingFilter) {
        if (item.brewing) {
          return item;
        }
      } else {
        return item;
      }
    });

  return (
    <>
      <Box display="flex" p={4}>
        <Box flexGrow={1}>
          <Typography variant="h6">
            {user.name ? `${user.name}'s Dashboard` : 'Welcome!'}
          </Typography>
        </Box>
        <Box className={classes.chip}>
          <Chip
            label="Favorites"
            onClick={() => setFavFilter(!favFilter)}
            color={favFilter ? 'primary' : 'default'}
          />
          <Chip
            label="Currently Brewing"
            onClick={() => setBrewingFilter(!brewingFilter)}
            color={brewingFilter ? 'primary' : 'default'}
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
            {sortArray.map((item, i) => (
              <MenuItem key={i} onClick={() => handleSort(item.toLowerCase())}>
                {item}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" flexWrap="wrap">
        {displayCoffees.map((coffeeItem, i) => {
          return <CoffeeCard key={coffeeItem.id} coffee={coffeeItem} />;
        })}
      </Box>
      <Snackbars />
      <Dialog
        open={newUserDialogOpen}
        onClose={() => setNewUserDialogOpen(false)}
      >
        <DialogTitle align="center">Welcome to Pacamara!</DialogTitle>
        <DialogContent align="center">
          Let's set you up with a new profile.
        </DialogContent>
        <Box display="flex" justifyContent="center">
          <DialogActions>
            <Button
              variant="contained"
              onClick={() => history.push('/profile/new')}
            >
              Let's go
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}

export default Dashboard;
