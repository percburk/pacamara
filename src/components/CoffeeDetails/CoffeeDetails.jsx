import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DateTime } from 'luxon';
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
// Components
import BrewInstance from '../BrewInstance/BrewInstance';
import EditDeleteShareMenu from '../EditDeleteShareCoffeeMenu/EditDeleteShareCoffeeMenu';
import AddEditBrew from '../AddEditBrew/AddEditBrew';
import Snackbars from '../Snackbars/Snackbars';
import ExtractionChart from '../ExtractionChart/ExtractionChart';

// Component styling classes
const useStyles = makeStyles((theme) => ({
  media: {
    height: 350,
    width: 350,
    objectFit: 'cover',
    margin: theme.spacing(2),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  mug: {
    color: grey[600],
  },
  backButton: {
    marginTop: theme.spacing(2),
  },
}));

// CoffeeDetails shows all coffee information, all the brew instances, and
// the extraction chart that displays TDS and EXT for all brews
export default function CoffeeDetails() {
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
  const [addEditBrewOpen, setAddEditBrewOpen] = useState(false);
  const [switchChart, setSwitchChart] = useState(false);
  const [oneBrew, setOneBrew] = useState({ x: 0, y: 0, i: 0 });
  const [accordionOpen, setAccordionOpen] = useState(false);

  useEffect(() => {
    dispatch({ type: 'FETCH_ONE_COFFEE', payload: id });
    dispatch({ type: 'FETCH_BREWS', payload: id });
    dispatch({ type: 'FETCH_FLAVORS' });
    dispatch({ type: 'FETCH_METHODS' });
  }, []);

  const formattedDate = DateTime.fromISO(roast_date).toFormat('LLL d');
  
  // Displays either blend name or country/producer based on blend status
  const nameToDisplay = is_blend ? blend_name : `${country} ${producer}`;


  // Uses Luxon to calculate the amount of days post roast for this coffee
  const daysOffRoast = DateTime.local()
    .diff(DateTime.fromISO(roast_date), 'days')
    .toFormat('d');

  // Toggle fav or brewing status of the coffee
  const handleBrewOrFav = (change) => {
    dispatch({
      type: 'SET_BREWING_OR_FAV',
      payload: { oneCoffeeId: id, change },
    });
  };

  // Only allows one accordion open at a time, for easier ui
  const handleAccordion = (selected) => (event, isOpen) => {
    setAccordionOpen(isOpen ? selected : false);
  };

  return (
    <>
      <Box p={4}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Box display="flex" justifyContent="center">
              <Box>
                <Paper elevation={4}>
                  <img src={coffee_pic} className={classes.media} />
                </Paper>
                <Button
                  className={classes.backButton}
                  startIcon={<ArrowBackIos />}
                  onClick={() => {
                    dispatch({ type: 'CLEAR_SNACKBARS' });
                    history.goBack();
                  }}
                >
                  Go Back
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center">
              <Typography variant="h4">{nameToDisplay}</Typography>
              <Box paddingLeft={1}>
                <EditDeleteShareMenu
                  id={id}
                  coffeeName={nameToDisplay}
                  pic={coffee_pic}
                />
              </Box>
            </Box>
            <Typography variant="subtitle1">By {roaster}</Typography>
            <Box display="flex" alignItems="center" my={1}>
              <Tooltip title="Favorite" enterDelay={900} leaveDelay={100}>
                <IconButton onClick={() => handleBrewOrFav('fav')}>
                  {is_fav ? <Favorite color="primary" /> : <FavoriteBorder />}
                </IconButton>
              </Tooltip>
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
              {flavors.map((flavor) => {
                if (flavors_array?.includes(flavor.id)) {
                  return (
                    <Chip
                      key={flavor.id}
                      className={classes.chip}
                      variant="outlined"
                      label={flavor.name}
                    />
                  );
                }
              })}
            </Box>
            {!is_blend && (
              <Box marginBottom={2}>
                <Typography variant="subtitle1">Region: {region}</Typography>
                <Typography variant="subtitle1">
                  Elevation: {elevation} meters
                </Typography>
                <Typography variant="subtitle1">
                  Cultivars: {cultivars}
                </Typography>
                <Typography variant="subtitle1">
                  Processing: {processing}
                </Typography>
              </Box>
            )}
            <Box marginBottom={2}>
              <Typography variant="subtitle1">
                Roasted by {roaster} on {formattedDate}
              </Typography>
              <Typography variant="subtitle1">
                {daysOffRoast} day{daysOffRoast === 1 ? '' : 's'} off roast
              </Typography>
            </Box>
            <Typography variant="subtitle1">Tasting notes: {notes}</Typography>
          </Grid>
          <Grid item xs={5}>
            <Box>
              <ExtractionChart
                switchChart={switchChart}
                setSwitchChart={setSwitchChart}
                oneBrew={oneBrew}
                setOneBrew={setOneBrew}
              />
            </Box>
          </Grid>
          <Grid item xs={7}>
            <Box display="flex" flexDirection="row-reverse" paddingBottom={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setAddEditBrewOpen(true)}
                endIcon={<Add />}
              >
                Add a Brew
              </Button>
            </Box>
            {!switchChart ? (
              brews.map((instance) => (
                <BrewInstance
                  key={instance.id}
                  instance={instance}
                  coffeeId={id}
                  accordionOpen={accordionOpen}
                  handleAccordion={handleAccordion}
                />
              ))
            ) : (
              <BrewInstance
                key={brews[oneBrew.i].id}
                instance={brews[oneBrew.i]}
                coffeeId={id}
                accordionOpen={brews[oneBrew.i].id}
                handleAccordion={handleAccordion}
              />
            )}
          </Grid>
        </Grid>
      </Box>
      <AddEditBrew
        coffeeId={id}
        addEditBrewOpen={addEditBrewOpen}
        setAddEditBrewOpen={setAddEditBrewOpen}
      />
      <Snackbars />
    </>
  );
}
