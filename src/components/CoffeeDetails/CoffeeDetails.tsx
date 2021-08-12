import { useState, useEffect, ChangeEvent } from 'react';
import { useHistory, useParams } from 'react-router-dom';
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
  CircularProgress,
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
// Hooks
import {
  useAppSelector,
  useAppDispatch,
} from '../../hooks/useAppDispatchSelector';
// Models
import { SagaActions } from '../../models/redux/sagaResource';
import { ReduxActions } from '../../models/redux/reduxResource';
import { BrewChartState } from '../../models/stateResource';
// Components
import BrewInstance from '../BrewInstance/BrewInstance';
import EditDeleteShareMenu from '../EditDeleteShareCoffeeMenu/EditDeleteShareCoffeeMenu';
import AddEditBrew from '../AddEditBrew/AddEditBrew';
import Snackbars from '../Snackbars/Snackbars';
import ExtractionChart from '../ExtractionChart/ExtractionChart';

// Styling
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
  const coffeeId = Number(useParams<{ id: string }>().id);
  const dispatch = useAppDispatch();
  const {
    isFav,
    brewing,
    roaster,
    roastDate,
    isBlend,
    blendName,
    country,
    producer,
    region,
    elevation,
    cultivars,
    processing,
    notes,
    coffeePic,
    flavorsArray,
  } = useAppSelector((store) => store.oneCoffee);
  const brews = useAppSelector((store) => store.brews);
  const flavors = useAppSelector((store) => store.flavors);
  const [addEditBrewOpen, setAddEditBrewOpen] = useState<boolean>(false);
  const [switchChart, setSwitchChart] = useState<boolean>(false);
  const [oneBrew, setOneBrew] = useState<BrewChartState>({ x: 0, y: 0, i: 0 });
  const [accordionOpen, setAccordionOpen] = useState<boolean | number>(false);

  useEffect(() => {
    dispatch({ type: SagaActions.FETCH_ONE_COFFEE, payload: coffeeId });
    dispatch({ type: SagaActions.FETCH_BREWS, payload: coffeeId });
    dispatch({ type: SagaActions.FETCH_FLAVORS });
    dispatch({ type: SagaActions.FETCH_METHODS });
  }, [dispatch, coffeeId]);

  const formattedDate = DateTime.fromISO(roastDate).toFormat('LLL d');

  // Displays either blend name or country/producer based on blend status
  const nameToDisplay = isBlend ? blendName : `${country} ${producer}`;

  // Uses Luxon to calculate the amount of days post roast for this coffee
  const daysOffRoast = Number(
    DateTime.local().diff(DateTime.fromISO(roastDate), 'days').toFormat('d')
  );

  // Toggle fav or brewing status of the coffee
  const handleBrewOrFav = (change: string) => {
    dispatch({
      type: SagaActions.SET_BREWING_OR_FAV,
      payload: { oneCoffeeId: coffeeId, change },
    });
  };

  // Only allows one accordion open at a time, for easier ui
  const handleAccordion =
    (selected: number) => (event: ChangeEvent<{}>, isOpen: boolean) => {
      setAccordionOpen(isOpen ? selected : false);
    };

  if (!coffeePic) {
    return (
      <Box
        height="90vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <>
      <Box p={4}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Box display="flex" justifyContent="center">
              <Box>
                <Paper elevation={4}>
                  <img
                    alt="coffee bag"
                    src={coffeePic}
                    className={classes.media}
                  />
                </Paper>
                <Button
                  className={classes.backButton}
                  startIcon={<ArrowBackIos />}
                  onClick={() => {
                    dispatch({ type: ReduxActions.CLEAR_SNACKBARS });
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
                  id={coffeeId}
                  coffeeName={nameToDisplay}
                  pic={coffeePic}
                />
              </Box>
            </Box>
            <Typography variant="subtitle1">By {roaster}</Typography>
            <Box display="flex" alignItems="center" my={1}>
              <Tooltip title="Favorite" enterDelay={900} leaveDelay={100}>
                <IconButton onClick={() => handleBrewOrFav('fav')}>
                  {isFav ? <Favorite color="primary" /> : <FavoriteBorder />}
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
              {flavors.map((flavor) =>
                flavorsArray?.includes(flavor.id) ? (
                  <Chip
                    key={flavor.id}
                    className={classes.chip}
                    variant="outlined"
                    label={flavor.name}
                  />
                ) : null
              )}
            </Box>
            {!isBlend && (
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
                  coffeeId={coffeeId}
                  accordionOpen={accordionOpen}
                  handleAccordion={handleAccordion}
                />
              ))
            ) : (
              <BrewInstance
                key={brews[oneBrew.i].id}
                instance={brews[oneBrew.i]}
                coffeeId={coffeeId}
                accordionOpen={brews[oneBrew.i].id}
                handleAccordion={handleAccordion}
              />
            )}
          </Grid>
        </Grid>
      </Box>
      <AddEditBrew
        coffeeId={coffeeId}
        addEditBrewOpen={addEditBrewOpen}
        setAddEditBrewOpen={setAddEditBrewOpen}
      />
      <Snackbars />
    </>
  );
}
