import { useSelector, useDispatch } from 'react-redux';
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
} from '@material-ui/core';
import { Favorite, FavoriteBorder, MoreVert } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 280,
    margin: theme.spacing(2),
  },
  media: {
    height: 140,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

function CoffeeCard({ coffee }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const flavors = useSelector((store) => store.flavors);

  const formattedDate = DateTime.fromISO(coffee.date).toFormat('LLL d');

  return (
    <Card className={classes.root} elevation={3}>
      <CardHeader
        title={
          coffee.is_blend
            ? `${coffee.blend_name} Blend`
            : `${coffee.country} ${coffee.producer}`
        }
        subheader={coffee.roaster}
        action={
          <IconButton>
            <MoreVert />
          </IconButton>
        }
      />
      <CardMedia
        className={classes.media}
        image={coffee.coffee_pic}
        title="Coffee Pic"
      />
      <CardContent>
        <Box display="flex" justifyContent="center">
          {flavors.map((item) => {
            if (coffee.flavors_array.indexOf(item.id) > -1) {
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
          <IconButton
            onClick={() =>
              dispatch({ type: 'SET_FAVORITE', payload: coffee.id })
            }
          >
            {coffee.is_fav ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <Typography align="right">{formattedDate}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default CoffeeCard;
