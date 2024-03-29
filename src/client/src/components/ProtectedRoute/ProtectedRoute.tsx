import { Route, Redirect, RouteProps } from 'react-router-dom'
// Hooks
import { useAppSelector } from '../../hooks/useAppDispatchSelector'
// Components
import LandingPage from '../LandingPage/LandingPage'

/*
  A Custom Wrapper Component -- This will keep our code DRY.
  Responsible for watching redux state, and returning an appropriate component
  API for this component is the same as a regular route

  THIS IS NOT SECURITY! That must be done on the server
  A malicious user could change the code and see any view
  so your server-side route must implement real security
  by checking req.isAuthenticated for authentication
  and by checking req.user for authorization.
*/

interface Props extends RouteProps {
  path: string
  authRedirect?: string
  children: JSX.Element
}

// TODO This function could use a bit better typing, this is janky
export default function ProtectedRoute(props: Props) {
  const user = useAppSelector((store) => store.user)

  // Using destructuring, this takes ComponentToProtect from component
  // prop and grabs all other props to pass them along to Route
  const {
    // Redirect path to be used if the user is authorized
    authRedirect,
    ...otherProps
  } = props

  // Component must ONLY be passed in as a child
  const ComponentToProtect = () => props.children

  let ComponentToShow

  if (user.id) {
    // If the user is logged in (only logged in users have ids),
    // show the component that is protected
    ComponentToShow = ComponentToProtect
  } else {
    // If they are not logged in, check the loginMode on Redux State
    // If the mode is 'login', show the LoginPage
    ComponentToShow = LandingPage
  }

  // Redirect a logged in user if an authRedirect prop has been provided
  if (user.id && authRedirect) {
    return <Redirect exact from={otherProps.path} to={authRedirect} />
  } else if (!user.id && authRedirect) {
    ComponentToShow = ComponentToProtect
  }

  // We return a Route component that gets added to our list of routes
  return (
    <Route
      // All props like 'exact' and 'path' that were passed in
      // are now passed along to the 'Route' Component
      {...otherProps}
    >
      <ComponentToShow />
    </Route>
  )
}
