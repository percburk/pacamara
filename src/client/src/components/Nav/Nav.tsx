import { ChangeEvent, useState } from 'react'
import { Typography, Box, makeStyles, TextField } from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import { Search } from '@material-ui/icons'
import { Autocomplete } from '@material-ui/lab'
import queryString from 'query-string'
import { useHistory, useLocation, Link } from 'react-router-dom'
// Hooks
import { useAppSelector } from '../../hooks/useAppDispatchSelector'
// Components
import pacamaraLogo from '../../images/pacamara-logo.png'
import AvatarMenu from '../AvatarMenu/AvatarMenu'
import AvatarBadge from './AvatarBadge'

// Styling
const useStyles = makeStyles((theme) => ({
  logo: {
    width: 70,
    height: 70,
  },
  logoLink: {
    display: 'block',
    textDecoration: 'none',
  },
  searchBar: {
    flexBasis: '30%',
    marginRight: theme.spacing(7),
    display: 'flex',
    alignItems: 'center',
  },
  searchBarIcon: {
    color: grey[600],
    marginRight: theme.spacing(1),
  },
  headerLink: {
    color: 'black',
    textDecoration: 'none',
  },
}))

// Nav is the top navigation bar which stays constant throughout the app
export default function Nav() {
  const classes = useStyles()
  const history = useHistory()
  const location = useLocation()
  const { name } = useAppSelector((store) => store.user)
  const coffeeSearchList = useAppSelector((store) => store.coffeeSearchList)
  const sharedCoffees = useAppSelector((store) => store.sharedCoffees)
  const [autoOpen, setAutoOpen] = useState<boolean>(false)
  const [searchInput, setSearchInput] = useState<string>('')

  // Checks to see if there is any data currently in the URL
  const { filters } = queryString.parse(location.search, {
    arrayFormat: 'bracket',
  })

  // Keeps the Autocomplete list closed until the user starts typing in the
  // search TextField
  const handleAutoOpen = () => {
    if (searchInput.length > 0) {
      setAutoOpen(true)
    }
  }

  // Sets the search string in state, toggles the Autocomplete list showing
  const handleSearchBar = (event: ChangeEvent<unknown>, newValue: string) => {
    setSearchInput(newValue)
    setAutoOpen(newValue.length > 0)
  }

  // Sends search query, Dashboard picks up the URL change in UseEffect and
  // sends a new GET with 'FETCH_COFFEES' to display search results
  const handleHistorySearch = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    const newString = queryString.stringify({
      filters,
      q: searchInput,
    })
    history.push(`/dashboard/?${newString}`)
  }

  return (
    <Box display="flex" alignItems="center" px={5} py={1} boxShadow={3}>
      <Box display="flex" alignItems="center" flexGrow={1}>
        <Box paddingRight={3}>
          <Link to="/dashboard" className={classes.logoLink}>
            <img alt="profile" src={pacamaraLogo} className={classes.logo} />
          </Link>
        </Box>
        <Link to="/dashboard" className={classes.headerLink}>
          <Typography variant="h3">PACAMARA</Typography>
        </Link>
      </Box>
      {name && (
        <form onSubmit={handleHistorySearch} className={classes.searchBar}>
          <Search className={classes.searchBarIcon} />
          <Autocomplete
            open={autoOpen}
            onOpen={handleAutoOpen}
            onClose={() => setAutoOpen(false)}
            freeSolo
            fullWidth
            inputValue={searchInput}
            onInputChange={handleSearchBar}
            options={coffeeSearchList.map((coffee) => {
              return coffee.blendName
                ? `${coffee.roaster} ${coffee.blendName}`
                : `${coffee.roaster} ${coffee.country} ${coffee.producer}`
            })}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Coffees"
                variant="outlined"
                size="small"
                fullWidth
                autoComplete="off"
              />
            )}
          />
        </form>
      )}
      {!name ? (
        <Typography variant="h6">Your Coffee Companion</Typography>
      ) : (
        <Box display="flex" alignItems="center">
          {sharedCoffees[0] ? (
            <AvatarBadge
              overlap="circle"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              variant="dot"
            >
              <AvatarMenu />
            </AvatarBadge>
          ) : (
            <AvatarMenu />
          )}
        </Box>
      )}
    </Box>
  )
}
