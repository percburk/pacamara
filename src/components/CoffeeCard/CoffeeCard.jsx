import { useState } from 'react';
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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
} from '@material-ui/core';
import {
  Favorite,
  FavoriteBorder,
  MoreVert,
  Edit,
  DeleteOutline,
} from '@material-ui/icons';

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
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const formattedDate = DateTime.fromISO(coffee.date).toFormat('LLL d');

  return (
    <>
      <Card className={classes.root} elevation={3}>
        <CardHeader
          title={
            coffee.is_blend
              ? coffee.blend_name
              : `${coffee.country} ${coffee.producer}`
          }
          subheader={coffee.roaster}
          action={
            <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
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
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>
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
            <Button
              variant="contained"
              onClick={() => {
                setDialogOpen(false);
                dispatch({ type: 'DELETE_COFFEE', payload: coffee.id });
              }}
            >
              Yes
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}

export default CoffeeCard;
