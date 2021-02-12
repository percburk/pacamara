import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DateTime } from 'luxon';
import {
  VictoryChart,
  VictoryScatter,
  VictoryLine,
  VictoryTheme,
  VictoryTooltip,
  VictoryLabel,
} from 'victory';
import {
  Box,
  Typography,
  Grid,
  makeStyles,
  Chip,
  Button,
  IconButton,
} from '@material-ui/core';
import { Favorite, FavoriteBorder } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 280,
    margin: theme.spacing(2),
  },
  media: {
    height: 160,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

function CoffeeDetails() {
  const classes = useStyles();
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const oneCoffee = useSelector((store) => store.oneCoffee);
  const brews = useSelector((store) => store.brews);
  const flavors = useSelector((store) => store.flavors);
  const user = useSelector((store) => store.user);

  useEffect(() => {
    dispatch({ type: 'FETCH_ONE_COFFEE', payload: id });
    dispatch({ type: 'FETCH_BREWS', payload: id });
    dispatch({ type: 'FETCH_FLAVORS' });
  }, []);
  const formattedDate = DateTime.fromISO(oneCoffee.roast_date).toFormat(
    'LLL d'
  );

  const daysOffRoast = DateTime.local()
    .diff(DateTime.fromISO(oneCoffee.roast_date), 'days')
    .toFormat('d');

  console.log(brews);

  return (
    <>
      <Box p={3}>
        <Typography variant="h4">
          {oneCoffee.is_blend
            ? oneCoffee.blend_name
            : `${oneCoffee.country} ${oneCoffee.producer}`}
        </Typography>
        <Box display="flex" my={2}>
          <IconButton
            onClick={() =>
              dispatch({
                type: 'SET_FAVORITE_ONE_COFFEE',
                payload: oneCoffee.id,
              })
            }
          >
            {oneCoffee.is_fav ? (
              <Favorite color="primary" />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>
          {oneCoffee.flavors_array &&
            flavors.map((item) => {
              if (oneCoffee.flavors_array.indexOf(item.id) > -1) {
                return (
                  <Chip
                    key={item.id}
                    className={classes.chip}
                    variant="outlined"
                    label={item.name}
                  />
                );
              }
            })}
        </Box>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Typography>
            Roasted by {oneCoffee.roaster} on {formattedDate}
          </Typography>
          <Typography>
            {daysOffRoast} day{daysOffRoast === 1 ? '' : 's'} off roast
          </Typography>
          {!oneCoffee.is_blend && (
            <Box>
              <Typography>Region: {oneCoffee.region}</Typography>
              <Typography>Elevation: {oneCoffee.elevation} meters</Typography>
              <Typography>Cultivars: {oneCoffee.cultivars}</Typography>
              <Typography>Processing: {oneCoffee.processing}</Typography>
              <Typography>Tasting notes: {oneCoffee.notes}</Typography>
            </Box>
          )}
          <Button onClick={() => history.push(`/editCoffee/${id}`)}>
            Edit
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default CoffeeDetails;
