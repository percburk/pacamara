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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Tooltip,
} from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import {
  Favorite,
  FavoriteBorder,
  Edit,
  DeleteOutline,
  LocalCafe,
  LocalCafeOutlined,
} from '@material-ui/icons';

import EditDeleteMenu from '../EditDeleteMenu/EditDeleteMenu';

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
  const flavors = useSelector((store) => store.flavors);
  const [anchorEl, setAnchorEl] = useState(null);
  const {
    id,
    date,
    roaster,
    is_blend,
    blend_name,
    country,
    producer,
    flavors_array,
    is_fav,
    brewing,
    coffee_pic,
  } = coffee;

  const formattedDate = DateTime.fromISO(date).toFormat('LLL d');

  const coffeeName = is_blend
    ? blend_name
    : `${country} ${producer}`;

  return (
    <>
      <Card className={classes.root} elevation={3}>
        <CardHeader
          title={coffeeName}
          subheader={roaster}
          action={
            <Grid container direction="column" alignItems="center">
              <EditDeleteMenu id={id} />
              <Tooltip
                title="Currently Brewing"
                enterDelay={900}
                leaveDelay={100}
              >
                <IconButton
                  onClick={() =>
                    dispatch({
                      type: 'SET_BREWING_OR_FAV',
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
            </Grid>
          }
        />
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              history.push(`/editCoffee/${id}`);
            }}
          >
            <ListItemIcon>
              <Edit />
            </ListItemIcon>
            <ListItemText primary="Edit Coffee" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              setDialogOpen(true);
            }}
          >
            <ListItemIcon>
              <DeleteOutline />
            </ListItemIcon>
            <ListItemText primary="Delete Coffee" />
          </MenuItem>
        </Menu>
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
              <IconButton
                onClick={() =>
                  dispatch({
                    type: 'SET_BREWING_OR_FAV',
                    payload: { id, change: 'fav' },
                  })
                }
              >
                {is_fav ? (
                  <Favorite color="primary" />
                ) : (
                  <FavoriteBorder />
                )}
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
