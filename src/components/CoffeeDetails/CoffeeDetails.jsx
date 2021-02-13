import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DateTime } from 'luxon';
import BrewInstance from '../BrewInstance/BrewInstance';
import EditDeleteMenu from '../EditDeleteMenu/EditDeleteMenu';
import './CoffeeDetails.css';
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
  IconButton,
  Paper,
  Button,
} from '@material-ui/core';
import {
  Favorite,
  FavoriteBorder,
  Edit,
  LocalCafe,
  LocalCafeOutlined,
  DeleteOutline,
  MoreVert,
} from '@material-ui/icons';
import { grey } from '@material-ui/core/colors';

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
  mug: {
    color: grey[600],
  },
}));

function CoffeeDetails() {
  const classes = useStyles();
  const { id } = useParams();
  const dispatch = useDispatch();
  const oneCoffee = useSelector((store) => store.oneCoffee);
  const brews = useSelector((store) => store.brews);
  const flavors = useSelector((store) => store.flavors);
  const user = useSelector((store) => store.user);

  useEffect(() => {
    dispatch({ type: 'FETCH_ONE_COFFEE', payload: id });
    dispatch({ type: 'FETCH_BREWS', payload: id });
    dispatch({ type: 'FETCH_FLAVORS' });
    dispatch({ type: 'FETCH_METHODS' });
  }, []);
  const formattedDate = DateTime.fromISO(oneCoffee.roast_date).toFormat(
    'LLL d'
  );

  const daysOffRoast = DateTime.local()
    .diff(DateTime.fromISO(oneCoffee.roast_date), 'days')
    .toFormat('d');

  return (
    <>
      <Box p={4}>
        <Grid container spacing={6}>
          <Grid item xs={4}>
            <Box display="flex" justifyContent="center">
              <Paper elevation={4}>
                <Box p={2}>
                  <img src={oneCoffee.coffee_pic} className="image" />
                </Box>
              </Paper>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box display="flex" alignItems="center">
              <Typography variant="h4">
                {oneCoffee.is_blend
                  ? oneCoffee.blend_name
                  : `${oneCoffee.country} ${oneCoffee.producer}`}
              </Typography>
              <Box paddingLeft={1}>
                <EditDeleteMenu id={id} />
              </Box>
            </Box>
            <Typography>By {oneCoffee.roaster}</Typography>
            <Box display="flex" my={2} alignItems="center">
              <IconButton
                onClick={() =>
                  dispatch({
                    type: 'SET_BREWING_OR_FAV_ONE_COFFEE',
                    payload: { id: oneCoffee.id, change: `"is_fav"` },
                  })
                }
              >
                {oneCoffee.is_fav ? (
                  <Favorite color="primary" />
                ) : (
                  <FavoriteBorder />
                )}
              </IconButton>
              <IconButton
                onClick={() =>
                  dispatch({
                    type: 'SET_BREWING_OR_FAV_ONE_COFFEE',
                    payload: { id: oneCoffee.id, change: `"brewing"` },
                  })
                }
              >
                {oneCoffee.brewing ? (
                  <LocalCafe color="primary" />
                ) : (
                  <LocalCafeOutlined className={classes.mug} />
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
            {!oneCoffee.is_blend && (
              <Box marginBottom={2}>
                <Typography>Region: {oneCoffee.region}</Typography>
                <Typography>Elevation: {oneCoffee.elevation} meters</Typography>
                <Typography>Cultivars: {oneCoffee.cultivars}</Typography>
                <Typography>Processing: {oneCoffee.processing}</Typography>
              </Box>
            )}
            <Box>
              <Typography>
                Roasted by {oneCoffee.roaster} on {formattedDate}
              </Typography>
              <Typography>
                {daysOffRoast} day{daysOffRoast == 1 ? '' : 's'} off roast
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Typography>Chart goes here.</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>Tasting notes: {oneCoffee.notes}</Typography>
          </Grid>
          <Grid item xs={8}>
            {brews &&
              brews.map((instance) => (
                <BrewInstance key={instance.id} instance={instance} id={id} />
              ))}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default CoffeeDetails;
