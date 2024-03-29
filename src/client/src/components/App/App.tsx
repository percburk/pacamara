import { useEffect } from 'react'
import { ThemeProvider, CssBaseline } from '@material-ui/core'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
// Hooks
import { useAppDispatch } from '../../hooks/useAppDispatchSelector'
// Models
import { SagaActions } from '../../models/redux/sagaResource'
// Components
import AddCoffee from '../AddCoffee/AddCoffee'
import CoffeeDetails from '../CoffeeDetails/CoffeeDetails'
import Dashboard from '../Dashboard/Dashboard'
import EditCoffee from '../EditCoffee/EditCoffee'
import Footer from '../Footer/Footer'
import LandingPage from '../LandingPage/LandingPage'
import muiTheme from '../muiTheme/muiTheme'
import Nav from '../Nav/Nav'
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'
import UpdateProfile from '../UpdateProfile/UpdateProfile'
// CSS
import './App.css'

export default function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch({ type: SagaActions.FETCH_USER })
  }, [dispatch])

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Nav />
        <Switch>
          {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
          <Redirect exact from="/" to="/home" />
          {/* For protected routes, the view could show one of several things 
            on the same route. Visiting localhost:3000/dashboard will show the 
            Dashboard if the user is logged in. If the user is not logged in, 
            the ProtectedRoute will show the LandingPage. */}
          <ProtectedRoute exact path="/profile/:user">
            <UpdateProfile />
          </ProtectedRoute>
          <ProtectedRoute exact path="/dashboard">
            <Dashboard />
          </ProtectedRoute>
          <ProtectedRoute exact path="/details/:id">
            <CoffeeDetails />
          </ProtectedRoute>
          <ProtectedRoute exact path="/add-coffee/">
            <AddCoffee />
          </ProtectedRoute>
          <ProtectedRoute exact path="/edit-coffee/:id">
            <EditCoffee />
          </ProtectedRoute>
          {/* When a value is supplied for the authRedirect prop the user will
            be redirected to the path supplied when logged in, otherwise they 
            will be taken to the component and path supplied. */}
          <ProtectedRoute
            // with authRedirect:
            // - if logged in, redirects to '/dashboard'
            // - else shows LandingPage at '/home'
            exact
            path="/home"
            authRedirect="/dashboard"
          >
            <LandingPage />
          </ProtectedRoute>
          {/* If none of the other routes matched, we will show a 404. */}
          <Route>
            <h1>404</h1>
          </Route>
        </Switch>
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  )
}
