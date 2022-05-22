import {withStyles, Badge} from '@material-ui/core'

// Custom component for displaying a badge on a user's avatar if they have
// shared coffees on their profile
const AvatarBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: '#35baf6',
    color: '#35baf6',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      border: '1px solid currentColor',
      content: '""',
    },
  },
}))(Badge)

export default AvatarBadge
