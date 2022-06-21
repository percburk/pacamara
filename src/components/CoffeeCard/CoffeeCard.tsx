import { useHistory, useLocation } from 'react-router-dom'
import { DateTime } from 'luxon'
import queryString from 'query-string'
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
} from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import {
  Favorite,
  FavoriteBorder,
  LocalCafe,
  LocalCafeOutlined,
} from '@material-ui/icons'
// Hooks
import { useAppSelector, useAppDispatch } from '../../hooks/useAppDispatchSelector'
// Models
import { CoffeeItem } from '../../models/modelResource'
import { SagaActions } from '../../models/redux/sagaResource'
import { ReduxActions } from '../../models/redux/reduxResource'
// Components
import EditDeleteShareCoffeeMenu from '../EditDeleteShareCoffeeMenu/EditDeleteShareCoffeeMenu'

// Styling
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
    cursor: 'pointer',
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  mug: {
    color: grey[600],
  },
}))

// CoffeeCard is the individual rendering of each coffee on a user's Dashboard
export default function CoffeeCard({ coffee }: { coffee: CoffeeItem }) {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const location = useLocation()
  const history = useHistory()
  const sharingUserList = useAppSelector((store) => store.sharingUserList)
  const flavors = useAppSelector((store) => store.flavors)
  const {
    id,
    date,
    roaster,
    isBlend,
    blendName,
    country,
    producer,
    coffeePic,
    brewing,
    isFav,
    flavorsArray,
    sharedById,
  } = coffee
  // Checks to see if there's a search query in the URL
  const { q } = queryString.parse(location.search)
  // Format date coffee was created using luxon
  const formattedDate = DateTime.fromISO(date).toFormat('LLL d')
  // Displays either blend name or country/producer based on blend status
  const coffeeName = isBlend ? blendName : `${country} ${producer}`
  // If this coffee has been shared by another user, their username is shown
  const sharedByUser = sharingUserList.find((item) => item.id === sharedById)?.username

  // PUT route to toggle booleans of brewing or isFav in 'users_coffees'
  // Makes sure not to change search results displayed, if present
  const handleBrewOrFav = (change: string) => {
    dispatch({
      type: SagaActions.SET_BREWING_OR_FAV,
      payload: { id, change, q },
    })
  }

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
              pic={coffeePic}
            />
            <Tooltip title="Currently Brewing" enterDelay={900} leaveDelay={100}>
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
        image={coffeePic}
        title={coffeeName}
        onClick={() => {
          dispatch({ type: ReduxActions.CLEAR_SNACKBARS })
          history.push(`/details/${id}`)
        }}
      />
      <CardContent>
        <Box display="flex" justifyContent="center">
          {flavors.map((item) =>
            flavorsArray?.includes(item.id) ? (
              <Chip
                key={item.id}
                className={classes.chip}
                variant="outlined"
                label={item.name}
              />
            ) : null
          )}
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" p={1}>
          <Tooltip title="Favorite" enterDelay={900} leaveDelay={100}>
            <IconButton onClick={() => handleBrewOrFav('fav')}>
              {isFav ? <Favorite color="primary" /> : <FavoriteBorder />}
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
  )
}
