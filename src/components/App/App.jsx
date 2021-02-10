import React, { useEffect } from 'react';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import { useDispatch } from 'react-redux';

import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import Dashboard from '../Dashboard/Dashboard';
import CoffeeDetails from '../CoffeeDetails/CoffeeDetails';
import AddEditCoffee from '../AddEditCoffee/AddEditCoffee';
import LandingPage from '../LandingPage/LandingPage';
import LoginPage from '../LoginPage/LoginPage';
import RegisterPage from '../RegisterPage/RegisterPage';
import UpdateProfile from '../UpdateProfile/UpdateProfile';
import './App.css';

import {
  createMuiTheme,
  ThemeProvider,
  Container,
  CssBaseline,
} from '@material-ui/core';
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#35baf6',
    },
    secondary: {
      main: '#33eb91',
    },
  },
  typography: {
    fontFamily: 'Lato',
    fontSize: 14,
    fontWeightLight: 100,
    fontWeightRegular: 300,
    fontWeightMedium: 300,
    fontWeightBold: 400,
    h2: {
      fontFamily: 'Mulish',
      fontWeight: 200,
      letterSpacing: '0.1em',
    },
    h4: {
      fontFamily: 'Mulish',
      fontSize: '1.5em',
      fontWeight: 200,
      letterSpacing: '0.1em',
    },
    h5: {
      fontFamily: 'Mulish',
      fontWeight: 400,
      letterSpacing: '0.1em',
    },
  },
});

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'FETCH_USER' });
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Nav />
        <Container maxWidth="lg">
          <Switch>
            {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
            <Redirect exact from="/" to="/home" />
            {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/dashboard will show the Dashboard if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:3000/user */}
            <ProtectedRoute exact path="/profile">
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
              path="/details"
            >
              <CoffeeDetails />
            </ProtectedRoute>
            <ProtectedRoute
              // logged in shows CoffeeDetails else shows LoginPage
              exact
              path="/addCoffee"
            >
              <AddEditCoffee />
            </ProtectedRoute>
            {/* When a value is supplied for the authRedirect prop the user will
            be redirected to the path supplied when logged in, otherwise they will
            be taken to the component and path supplied. */}
            <ProtectedRoute
              // with authRedirect:
              // - if logged in, redirects to '/dashboard'
              // - else shows LoginPage at '/login'
              exact
              path="/login"
              authRedirect="/dashboard"
            >
              <LoginPage />
            </ProtectedRoute>

            <ProtectedRoute
              // with authRedirect:
              // - if logged in, redirects to '/dashboard'
              // - else shows RegisterPage at '/registration'
              exact
              path="/registration"
              authRedirect="/dashboard"
            >
              <RegisterPage />
            </ProtectedRoute>

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
        </Container>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
