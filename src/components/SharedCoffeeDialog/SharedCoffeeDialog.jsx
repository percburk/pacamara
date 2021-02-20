import { useSelector } from 'react-redux';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  Avatar,
  makeStyles,
  Button,
  Grid,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  avatar: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  image: {
    height: 150,
    width: 150,
    objectFit: 'cover',
    margin: theme.spacing(3),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

function SharedCoffeeDialog({ dialogOpen, setDialogOpen, openSharedCoffee }) {
  const classes = useStyles();
  const {
    is_blend,
    country,
    producer,
    coffee_pic,
    id,
    roaster,
    flavors_array,
  } = useSelector((store) => store.oneSharedCoffee);
  const flavors = useSelector((store) => store.flavors);
  const { username, profile_pic, message } = openSharedCoffee;
  const nameToDisplay = is_blend ? blend_name : `${country} ${producer}`;

  const handleDelete = () => {
    console.log('clicked handleDelete');
  };

  const handleAdd = () => {
    console.log('clicked handleAdd');
  };

  return (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <Box display="flex" alignItems="center">
        <Avatar src={profile_pic} className={classes.avatar} />
        <DialogTitle>{username} shared a coffee with you:</DialogTitle>
      </Box>
      <DialogContent>
        <Grid container>
          <Grid item xs={6}>
            {coffee_pic && <img src={coffee_pic} className={classes.image} />}
          </Grid>
          <Grid item xs={6}>
            <Typography>{nameToDisplay}</Typography>
            <Typography>By {roaster}</Typography>
            <Box display="flex">
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
            <Typography>{message}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => setDialogOpen(false)}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleDelete}>
          Decline
        </Button>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SharedCoffeeDialog;
