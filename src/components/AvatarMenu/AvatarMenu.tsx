import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Menu,
  Box,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
  Avatar,
  makeStyles,
  Typography,
} from '@material-ui/core'
import { Edit, Add, ViewModule } from '@material-ui/icons'
// Hooks
import {
  useAppSelector,
  useAppDispatch,
} from '../../hooks/useAppDispatchSelector'
// Models
import { SagaActions } from '../../models/redux/sagaResource'
import { ReduxActions } from '../../models/redux/reduxResource'
// Components
import SharedCoffeeMenu from '../SharedCoffeeMenu/SharedCoffeeMenu'

// Styling
const useStyles = makeStyles((theme) => ({
  menu: {
    width: 300,
  },
  smallBlue: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    backgroundColor: '#35baf6',
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  medium: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  large: {
    width: theme.spacing(9),
    height: theme.spacing(9),
  },
}))

// AvatarMenu opens when the user clicks on their avatar in Nav
// Their home base to edit their profile, add a new coffee, view any shared
// coffees, navigate back to their dashboard, or log out
export default function AvatarMenu() {
  const sharedCoffees = useAppSelector((store) => store.sharedCoffees)
  const dispatch = useAppDispatch()
  const history = useHistory()
  const classes = useStyles()
  const { name, username, profilePic } = useAppSelector((store) => store.user)
  const [avatarAnchorEl, setAvatarAnchorEl] = useState<
    (EventTarget & HTMLDivElement) | null
  >(null)
  const [sharedOpen, setSharedOpen] = useState<boolean>(false)

  // Logs the user out and sends them to LandingPage
  const handleLogout = () => {
    dispatch({ type: SagaActions.LOGOUT })
    history.push('/home')
    setAvatarAnchorEl(null)
  }

  return (
    <>
      <Avatar
        className={classes.medium}
        src={profilePic}
        onClick={(event) => setAvatarAnchorEl(event.currentTarget)}
        style={{ cursor: 'pointer' }}
      >
        {name && name.charAt(0)}
      </Avatar>
      <Menu
        className={classes.menu}
        anchorEl={avatarAnchorEl}
        keepMounted
        open={!!avatarAnchorEl}
        onClose={() => {
          setAvatarAnchorEl(null)
          setSharedOpen(false)
        }}
      >
        <Box display="flex" justifyContent="center" py={1}>
          <Avatar className={classes.large} src={profilePic}>
            {name && name.charAt(0)}
          </Avatar>
        </Box>
        <Box py={1}>
          <Typography align="center">{name}</Typography>
          <Typography align="center">{username}</Typography>
        </Box>
        <MenuItem
          disabled={!sharedCoffees[0]}
          onClick={() => setSharedOpen(!sharedOpen)}
        >
          <ListItemIcon>
            <Avatar
              className={classes[sharedCoffees[0] ? 'smallBlue' : 'small']}
            >
              <Typography variant="subtitle2">
                {sharedCoffees.length}
              </Typography>
            </Avatar>
          </ListItemIcon>
          <ListItemText primary="Shared Coffees" />
        </MenuItem>
        <SharedCoffeeMenu
          sharedOpen={sharedOpen}
          setSharedOpen={setSharedOpen}
          setAvatarAnchorEl={setAvatarAnchorEl}
        />
        <MenuItem
          onClick={() => {
            history.push('/dashboard')
            setAvatarAnchorEl(null)
            dispatch({ type: ReduxActions.CLEAR_SNACKBARS })
          }}
        >
          <ListItemIcon>
            <ViewModule />
          </ListItemIcon>
          <ListItemText primary="Go To Dashboard" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            history.push('/profile/update')
            setAvatarAnchorEl(null)
          }}
        >
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText
            primary={name ? 'Edit Profile' : 'Create New Profile'}
          />
        </MenuItem>
        <MenuItem
          onClick={() => {
            history.push('/add-coffee')
            setAvatarAnchorEl(null)
          }}
        >
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText primary="Add a New Coffee" />
        </MenuItem>
        <Box display="flex" justifyContent="center" py={2}>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Menu>
    </>
  )
}
