import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DateTime } from 'luxon';
import BrewInstance from '../BrewInstance/BrewInstance';
import EditDeleteMenu from '../EditDeleteMenu/EditDeleteMenu';
import AddBrew from '../AddBrew/AddBrew';
import Snackbars from '../Snackbars/Snackbars';
import {
  VictoryChart,
  VictoryScatter,
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

const Polygon = ({ data, scale }) => {
  const points = data.reduce(
    (pointStr, { x, y }) => `${pointStr} ${scale.x(x)},${scale.y(y)}`,
    ''
  );
  return <polygon points={points} style={{ fill: 'grey', opacity: 0.3 }} />;
};

function CoffeeDetails() {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const oneCoffee = useSelector((store) => store.oneCoffee);
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

  const formattedDate = DateTime.fromISO(oneCoffee.roast_date).toFormat(
    'LLL d'
  );

  const daysOffRoast = DateTime.local()
    .diff(DateTime.fromISO(oneCoffee.roast_date), 'days')
    .toFormat('d');

  const nameToDisplay = oneCoffee.is_blend
    ? oneCoffee.blend_name
    : `${oneCoffee.country} ${oneCoffee.producer}`;

  const extractionWindow = [
    { x: user.ext_min, y: user.tds_min },
    { x: user.ext_max, y: user.tds_min },
    { x: user.ext_max, y: user.tds_max },
    { x: user.ext_min, y: user.tds_max },
  ];

  const handleSwitchChart = (x, y, i) => {
    console.log(x, y, i);
    setOneBrew({ x, y, i });
    setSwitchChart(!switchChart);
  };

  return (
    <>
      <Box p={4}>
        <Grid container spacing={6}>
          <Grid item xs={4}>
            <Box display="flex">
              <Paper elevation={4}>
                <Box p={2}>
                  <img src={oneCoffee.coffee_pic} className={classes.media} />
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
            <VictoryChart domain={{ x: [16, 25], y: [1.2, 1.6] }}>
              <Polygon data={extractionWindow} />
              {!switchChart ? (
                <VictoryScatter
                  style={{ data: { fill: '#35baf6', cursor: 'pointer' } }}
                  labelComponent={
                    <VictoryTooltip
                      flyoutStyle={{ stroke: '#35baf6', strokeWidth: 1 }}
                    />
                  }
                  size={7}
                  data={brews.map((instance) => {
                    return {
                      x: Number(instance.ext),
                      y: Number(instance.tds),
                      label: `TDS: ${instance.tds}, EXT: ${instance.ext}%`,
                    };
                  })}
                  events={[
                    {
                      target: 'data',
                      eventHandlers: {
                        onClick: (event, data) =>
                          handleSwitchChart(
                            data.datum.x,
                            data.datum.y,
                            data.index
                          ),
                      },
                    },
                  ]}
                />
              ) : (
                <VictoryScatter
                  style={{ data: { fill: '#35baf6', cursor: 'pointer' } }}
                  labelComponent={<VictoryLabel />}
                  size={10}
                  data={[
                    {
                      x: oneBrew.x,
                      y: oneBrew.y,
                      label: `TDS: ${brews[oneBrew.i].tds}, EXT: ${
                        brews[oneBrew.i].ext
                      }%`,
                    },
                  ]}
                  events={[
                    {
                      target: 'data',
                      eventHandlers: {
                        onClick: () => setSwitchChart(!switchChart),
                      },
                    },
                  ]}
                />
              )}
            </VictoryChart>
          </Grid>
          <Grid item xs={4}>
            <Typography>Tasting notes: {oneCoffee.notes}</Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBackIos />}
              onClick={() => {
                dispatch({ type: 'CLEAR_SNACKBARS' });
                history.push('/dashboard');
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
                <BrewInstance key={instance.id} instance={instance} id={id} />
              ))
            ) : (
              <BrewInstance
                key={brews[oneBrew.i].id}
                instance={brews[oneBrew.i]}
                id={id}
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
