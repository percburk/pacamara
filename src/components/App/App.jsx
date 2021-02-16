import React, { useEffect } from 'react';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@material-ui/core';

import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import Dashboard from '../Dashboard/Dashboard';
import CoffeeDetails from '../CoffeeDetails/CoffeeDetails';
import AddCoffee from '../AddCoffee/AddCoffee';
import EditCoffee from '../EditCoffee/EditCoffee';
import LandingPage from '../LandingPage/LandingPage';
import UpdateProfile from '../UpdateProfile/UpdateProfile';
import MuiTheme from '../MuiTheme/MuiTheme';
import './App.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'FETCH_USER' });
  }, [dispatch]);

  return (
    <ThemeProvider theme={MuiTheme}>
      <CssBaseline />
      <Router>
        <Nav />

        <Switch>
          {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
          <Redirect exact from="/" to="/home" />
          {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/dashboard will show the Dashboard if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:3000/user */}
          <ProtectedRoute exact path="/profile/:id">
            <UpdateProfile />
          </ProtectedRoute>
          <ProtectedRoute
            // logged in shows Dashboard else shows LoginPage
            exact
            path="/dashboard"
          >
            <Dashboard />
          </ProtectedRoute>

          <ProtectedRoute
            // logged in shows CoffeeDetails else shows LoginPage
            exact
            path="/details/:id"
          >
            <CoffeeDetails />
          </ProtectedRoute>
          <ProtectedRoute
            // logged in shows AddCoffee else shows LoginPage
            exact
            path="/addCoffee/"
          >
            <AddCoffee />
          </ProtectedRoute>
          <ProtectedRoute
            // logged in shows AddCoffee else shows LoginPage
            exact
            path="/editCoffee/:id"
          >
            <EditCoffee />
          </ProtectedRoute>

          {/* When a value is supplied for the authRedirect prop the user will
            be redirected to the path supplied when logged in, otherwise they will
            be taken to the component and path supplied. */}
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
      </Router>
    </ThemeProvider>
  );
}

export default App;
