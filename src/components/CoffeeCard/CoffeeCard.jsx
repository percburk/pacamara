import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { DateTime } from 'luxon';
import {
  Box,
  Typography,
  makeStyles,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  IconButton,
  Chip,
  Grid,
  Tooltip,
} from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import {
  Favorite,
  FavoriteBorder,
  LocalCafe,
  LocalCafeOutlined,
} from '@material-ui/icons';

import EditDeleteShareMenu from '../EditDeleteShareMenu/EditDeleteShareMenu';
import useQuery from '../../hooks/useQuery';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 280,
    margin: theme.spacing(2),
  },
  media: {
    height: 160,
    '&:hover': {
      opacity: 0.8,
    },
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  mug: {
    color: grey[600],
  },
}));

function CoffeeCard({ coffee }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const query = useQuery();
  const flavors = useSelector((store) => store.flavors);
  const {
    id,
    date,
    roaster,
    is_blend,
    blend_name,
    country,
    producer,
    coffee_pic,
    brewing,
    is_fav,
    flavors_array,
  } = coffee;

  const formattedDate = DateTime.fromISO(date).toFormat('LLL d');

  const coffeeName = is_blend ? blend_name : `${country} ${producer}`;

  const handleBrewOrFav = (type) => {
    dispatch({
      type: 'SET_BREWING_OR_FAV',
      payload: { id: id, change: type, q: query.get('q') || '' },
    });
  };

  return (
    <>
      <Card className={classes.root} elevation={3}>
        <CardHeader
          title={coffeeName}
          subheader={roaster}
          action={
            <Grid container direction="column" alignItems="center">
              <EditDeleteShareMenu
                id={id}
                coffeeName={coffeeName}
                pic={coffee_pic}
              />
              <Tooltip
                title="Currently Brewing"
                enterDelay={900}
                leaveDelay={100}
              >
                <IconButton onClick={() => handleBrewOrFav('brewing')}>
                  {brewing ? (
                    <LocalCafe color="primary" />
                  ) : (
                    <LocalCafeOutlined className={classes.mug} />
                  )}
                </IconButton>
              </Tooltip>
            </Grid>
          }
        />
        <CardMedia
          className={classes.media}
          image={coffee_pic}
          title={coffeeName}
          style={{ cursor: 'pointer' }}
          onClick={() => {
            dispatch({ type: 'CLEAR_SNACKBARS' });
            history.push(`/details/${id}`);
          }}
        />
        <CardContent>
          <Box display="flex" justifyContent="center">
            {flavors_array[0] &&
              flavors.map((item) => {
                if (flavors_array.indexOf(item.id) > -1) {
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
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            px={1}
          >
            <Tooltip title="Favorite" enterDelay={900} leaveDelay={100}>
              <IconButton onClick={() => handleBrewOrFav('is_fav')}>
                {is_fav ? <Favorite color="primary" /> : <FavoriteBorder />}
              </IconButton>
            </Tooltip>
            <Typography align="right">{formattedDate}</Typography>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}

export default CoffeeCard;
