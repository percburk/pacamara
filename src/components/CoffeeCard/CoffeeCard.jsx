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
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Grid,
} from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import {
  Favorite,
  FavoriteBorder,
  MoreVert,
  Edit,
  DeleteOutline,
  LocalCafe,
  LocalCafeOutlined,
} from '@material-ui/icons';

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
  const [dialogOpen, setDialogOpen] = useState(false);

  const formattedDate = DateTime.fromISO(coffee.date).toFormat('LLL d');

  const coffeeName = coffee.is_blend
    ? coffee.blend_name
    : `${coffee.country} ${coffee.producer}`;

  const handleDelete = () => {
    setDialogOpen(false);
    dispatch({ type: 'DELETE_COFFEE', payload: coffee.id });
    dispatch({ type: 'SNACKBARS_DELETED_COFFEE' });
  };

  return (
    <>
      <Card className={classes.root} elevation={3}>
        <CardHeader
          title={coffeeName}
          subheader={coffee.roaster}
          action={
            <Grid container direction="column" alignItems="center">
              <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
                <MoreVert />
              </IconButton>
              <IconButton
                onClick={() =>
                  dispatch({
                    type: 'SET_BREWING_OR_FAV',
                    payload: { id: coffee.id, change: `"brewing"` },
                  })
                }
              >
                {coffee.brewing ? (
                  <LocalCafe color="primary" />
                ) : (
                  <LocalCafeOutlined className={classes.mug} />
                )}
              </IconButton>
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
              history.push(`/editCoffee/${coffee.id}`);
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
          image={coffee.coffee_pic}
          title={coffeeName}
          style={{ cursor: 'pointer' }}
          onClick={() => {
            dispatch({ type: 'CLEAR_SNACKBARS' });
            history.push(`/details/${coffee.id}`);
          }}
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
                dispatch({
                  type: 'SET_BREWING_OR_FAV',
                  payload: { id: coffee.id, change: `"is_fav"` },
                })
              }
            >
              {coffee.is_fav ? (
                <Favorite color="primary" />
              ) : (
                <FavoriteBorder />
              )}
            </IconButton>
            <Typography align="right">{formattedDate}</Typography>
          </Box>
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle align="center">Delete Coffee</DialogTitle>
        <DialogContent align="center">
          Are you sure you want to delete this coffee?
        </DialogContent>
        <Box display="flex" justifyContent="center">
          <DialogActions>
            <Button variant="contained" onClick={() => setDialogOpen(false)}>
              No
            </Button>
            <Button variant="contained" onClick={handleDelete}>
              Yes
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}

export default CoffeeCard;
