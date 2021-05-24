import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { DateTime } from 'luxon';
import queryString from 'query-string';
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
// Components
import EditDeleteShareCoffeeMenu from '../EditDeleteShareCoffeeMenu/EditDeleteShareCoffeeMenu';

// Component styling classes
const useStyles = makeStyles((theme) => ({
  root: {
    width: 260,
    height: 420,
    margin: theme.spacing(1.75),
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

// CoffeeCard is the individual rendering of each coffee on a user's Dashboard
export default function CoffeeCard({ coffee }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const sharingUserList = useSelector((store) => store.sharingUserList);
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
    shared_by_id,
  } = coffee;
  // Checks to see if there's a search query in the URL
  const { q } = queryString.parse(location.search);
  // Format date coffee was created using luxon
  const formattedDate = DateTime.fromISO(date).toFormat('LLL d');
  // Displays either blend name or country/producer based on blend status
  const coffeeName = is_blend ? blend_name : `${country} ${producer}`;
  // If this coffee has been shared by another user, their username is shown
  const sharedByUser = sharingUserList.find((item) => item.id === shared_by_id)
    ?.username;

  // PUT route to toggle booleans of brewing or is_fav in 'users_coffees'
  // Makes sure not to change search results displayed, if present
  const handleBrewOrFav = (change) => {
    dispatch({
      type: 'SET_BREWING_OR_FAV',
      payload: { id, change, q },
    });
  };

  return (
    <Card className={classes.root} elevation={3}>
      <CardHeader
        title={coffeeName}
        subheader={roaster}
        action={
          <Grid container direction="column" alignItems="center">
            <EditDeleteShareCoffeeMenu
              id={id}
              coffeeName={coffeeName}
              pic={coffee_pic}
            />
            <Tooltip
              title="Currently Brewing"
              enterDelay={900}
              leaveDelay={100}
            >
              <IconButton onClick={() => handleBrewOrFav('brew')}>
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
          {flavors.map((item) => {
            if (flavors_array?.indexOf(item.id) > -1) {
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
          p={1}
        >
          <Tooltip title="Favorite" enterDelay={900} leaveDelay={100}>
            <IconButton onClick={() => handleBrewOrFav('fav')}>
              {is_fav ? <Favorite color="primary" /> : <FavoriteBorder />}
            </IconButton>
          </Tooltip>
          <Box>
            <Typography align="right">{formattedDate}</Typography>
            {sharedByUser && (
              <Typography variant="subtitle2" align="right">
                From @{sharedByUser}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
