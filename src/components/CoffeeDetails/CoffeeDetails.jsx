import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DateTime } from 'luxon';
import BrewInstance from '../BrewInstance/BrewInstance';
import EditDeleteMenu from '../EditDeleteMenu/EditDeleteMenu';
import AddBrew from '../AddBrew/AddBrew';
import Snackbars from '../Snackbars/Snackbars';
import ExtractionChart from '../ExtractionChart/ExtractionChart';
import {
  Box,
  Typography,
  Grid,
  makeStyles,
  Chip,
  IconButton,
  Paper,
  Button,
  Tooltip,
} from '@material-ui/core';
import {
  Favorite,
  FavoriteBorder,
  LocalCafe,
  LocalCafeOutlined,
  ArrowBackIos,
  Add,
} from '@material-ui/icons';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 280,
    margin: theme.spacing(2),
  },
  media: {
    height: 250,
    width: 250,
    objectFit: 'cover',
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
  const history = useHistory();
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    is_fav,
    brewing,
    roaster,
    roast_date,
    is_blend,
    blend_name,
    country,
    producer,
    region,
    elevation,
    cultivars,
    processing,
    notes,
    coffee_pic,
    flavors_array,
  } = useSelector((store) => store.oneCoffee);
  const brews = useSelector((store) => store.brews);
  const flavors = useSelector((store) => store.flavors);
  const [addBrew, setAddBrew] = useState(false);
  const [switchChart, setSwitchChart] = useState(false);
  const [oneBrew, setOneBrew] = useState({ x: 0, y: 0, i: 0 });

  useEffect(() => {
    dispatch({ type: 'FETCH_ONE_COFFEE', payload: id });
    dispatch({ type: 'FETCH_BREWS', payload: id });
    dispatch({ type: 'FETCH_FLAVORS' });
    dispatch({ type: 'FETCH_METHODS' });
  }, []);

  const formattedDate = DateTime.fromISO(roast_date).toFormat('LLL d');

  const daysOffRoast = DateTime.local()
    .diff(DateTime.fromISO(roast_date), 'days')
    .toFormat('d');

  const nameToDisplay = is_blend ? blend_name : `${country} ${producer}`;

  return (
    <>
      <Box p={4}>
        <Grid container spacing={6}>
          <Grid item xs={4}>
            <Box display="flex">
              <Paper elevation={4}>
                <Box p={2}>
                  <img src={coffee_pic} className={classes.media} />
                </Box>
              </Paper>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box display="flex" alignItems="center">
              <Typography variant="h4">{nameToDisplay}</Typography>
              <Box paddingLeft={1}>
                <EditDeleteMenu id={id} />
              </Box>
            </Box>
            <Typography>By {roaster}</Typography>
            <Box display="flex" my={2} alignItems="center">
              <Tooltip title="Favorite" enterDelay={900} leaveDelay={100}>
                <IconButton
                  onClick={() =>
                    dispatch({
                      type: 'SET_BREWING_OR_FAV_ONE_COFFEE',
                      payload: { id, change: 'fav' },
                    })
                  }
                >
                  {is_fav ? <Favorite color="primary" /> : <FavoriteBorder />}
                </IconButton>
              </Tooltip>
              <Tooltip
                title="Currently Brewing"
                enterDelay={900}
                leaveDelay={100}
              >
                <IconButton
                  onClick={() =>
                    dispatch({
                      type: 'SET_BREWING_OR_FAV_ONE_COFFEE',
                      payload: { id, change: 'brewing' },
                    })
                  }
                >
                  {brewing ? (
                    <LocalCafe color="primary" />
                  ) : (
                    <LocalCafeOutlined className={classes.mug} />
                  )}
                </IconButton>
              </Tooltip>
              {flavors_array &&
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
            {!is_blend && (
              <Box marginBottom={2}>
                <Typography>Region: {region}</Typography>
                <Typography>Elevation: {elevation} meters</Typography>
                <Typography>Cultivars: {cultivars}</Typography>
                <Typography>Processing: {processing}</Typography>
              </Box>
            )}
            <Box>
              <Typography>
                Roasted by {roaster} on {formattedDate}
              </Typography>
              <Typography>
                {daysOffRoast} day{daysOffRoast == 1 ? '' : 's'} off roast
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <ExtractionChart
              switchChart={switchChart}
              setSwitchChart={setSwitchChart}
              oneBrew={oneBrew}
              setOneBrew={setOneBrew}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography>Tasting notes: {notes}</Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBackIos />}
              onClick={() => {
                dispatch({ type: 'CLEAR_SNACKBARS' });
                history.goBack();
              }}
            >
              Go Back
            </Button>
          </Grid>
          <Grid item xs={8}>
            <Box display="flex" flexDirection="row-reverse" paddingBottom={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setAddBrew(true)}
                endIcon={<Add />}
              >
                Add a Brew
              </Button>
            </Box>
            {brews && !switchChart ? (
              brews.map((instance) => (
                <BrewInstance
                  key={instance.id}
                  instance={instance}
                  coffeeId={id}
                />
              ))
            ) : (
              <BrewInstance
                key={brews[oneBrew.i].id}
                instance={brews[oneBrew.i]}
                coffeeId={id}
                open={true}
              />
            )}
          </Grid>
        </Grid>
      </Box>
      <AddBrew
        id={id}
        nameToDisplay={nameToDisplay}
        addBrew={addBrew}
        setAddBrew={setAddBrew}
      />
      <Snackbars />
    </>
  );
}

export default CoffeeDetails;
