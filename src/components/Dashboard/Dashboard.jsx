import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
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
const filtersArray = [
  { key: 'fav', string: 'Favorites' },
  { key: 'brewing', string: 'Currently Brewing' },
  { key: 'blend', string: 'Blends' },
];

function Dashboard() {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { name } = useSelector((store) => store.user);
  const coffees = useSelector((store) => store.coffees);
  const search = useSelector((store) => store.search);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filters, setFilters] = useState({ fav: false });
  const [sort, setSort] = useState('date');
  const [newUserDialogOpen, setNewUserDialogOpen] = useState(
    !name ? true : false
  );

  useEffect(() => {
    dispatch({ type: 'FETCH_COFFEES', payload: search || '' });
    dispatch({ type: 'FETCH_FLAVORS' });
  }, []);

  const handleSort = (howToSort) => {
    setSort(howToSort);
    setSortAnchorEl(null);
  };

  const handleFilters = (howToFilter) => {
    setFilters({ ...filters, [howToFilter]: !filters[howToFilter] });
    setFilterAnchorEl(null);
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
      if (filters.fav) {
        if (item.is_fav) {
          return item;
        }
      } else {
        return item;
      }
    })
    .filter((item) => {
      if (filters.brewing) {
        if (item.brewing) {
          return item;
        }
      } else {
        return item;
      }
    })
    .filter((item) => {
      if (filters.blend) {
        if (item.is_blend) {
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
            {name ? `${name}'s Dashboard` : 'Welcome!'}
          </Typography>
        </Box>
        <Box className={classes.chip}>
          {filtersArray.map((item, i) => {
            if (filters[item.key]) {
              return (
                <Chip
                  key={i}
                  label={item.string}
                  onDelete={() => handleFilters(item.key)}
                  color="primary"
                />
              );
            }
          })}
          <Button
            variant="outlined"
            onClick={(event) => setFilterAnchorEl(event.currentTarget)}
          >
            Filter
          </Button>
          <Menu
            anchorEl={filterAnchorEl}
            keepMounted
            open={Boolean(filterAnchorEl)}
            onClose={() => setFilterAnchorEl(null)}
          >
            {filtersArray.map((item, i) => {
              return (
                <MenuItem
                  key={i}
                  onClick={() => handleFilters(item.key)}
                  selected={filters[item.key]}
                >
                  {item.string}
                </MenuItem>
              );
            })}
          </Menu>
          <Button
            variant="outlined"
            onClick={(event) => setSortAnchorEl(event.currentTarget)}
          >
            Sort
          </Button>
          <Menu
            anchorEl={sortAnchorEl}
            keepMounted
            open={Boolean(sortAnchorEl)}
            onClose={() => setSortAnchorEl(null)}
          >
            {sortArray.map((item, i) => (
              <MenuItem
                key={i}
                onClick={() => handleSort(item.toLowerCase())}
                selected={sort === item.toLowerCase() ? true : false}
              >
                {item}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" flexWrap="wrap">
        {displayCoffees.map((coffeeItem) => {
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
              color="primary"
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
