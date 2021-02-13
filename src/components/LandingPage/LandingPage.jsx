import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SwipeableViews from 'react-swipeable-views';
import './LandingPage.css';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Snackbar,
  IconButton,
  Collapse,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';

function TabPanel({ children, tab, index }) {
  return (
    <div
      role="tabpanel"
      hidden={tab !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {tab === index && <>{children}</>}
    </div>
  );
}

function LandingPage() {
  const dispatch = useDispatch();
  const landingErrors = useSelector((store) => store.landingErrors);
  const [tab, setTab] = useState(0);
  const errorOpen = useSelector((store) => store.landingErrors.open);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();
    if (username && password) {
      dispatch({
        type: 'LOGIN',
        payload: { username, password },
      });
    } else {
      dispatch({ type: 'LOGIN_INPUT_ERROR' });
    }
  };

  const handleRegister = (event) => {
    event.preventDefault();
    if (username && password) {
      dispatch({
        type: 'REGISTER',
        payload: { username, password },
      });
    } else {
      dispatch({ type: 'REGISTRATION_INPUT_ERROR' });
    }
  };

  return (
    <>
      <Box
        className="background"
        display="flex"
        alignItems="center"
        flexDirection="row-reverse"
        height="80vh"
      >
        <Box marginRight={14}>
          <Paper elevation={5}>
            <Tabs
              value={tab}
              onChange={(event, value) => setTab(value)}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>
            <SwipeableViews
              index={tab}
              onChangeIndex={(event, value) => setTab(value)}
            >
              <TabPanel tab={tab} index={0}>
                <Box p={4}>
                  <Typography variant="h6" align="center">
                    LOGIN
                  </Typography>
                  <form onSubmit={handleLogin}>
                    <TextField
                      label="Username"
                      fullWidth
                      variant="outlined"
                      onChange={(event) => setUsername(event.target.value)}
                    />
                    <TextField
                      label="Password"
                      fullWidth
                      variant="outlined"
                      type="password"
                      onChange={(event) => setPassword(event.target.value)}
                    />
                    <Box display="flex" flexDirection="row-reverse">
                      <Button variant="contained" color="primary" type="submit">
                        Login
                      </Button>
                    </Box>
                  </form>
                </Box>
              </TabPanel>
              <TabPanel tab={tab} index={1}>
                <Box p={4}>
                  <Typography variant="h6" align="center">
                    REGISTER
                  </Typography>
                  <form onSubmit={handleRegister}>
                    <TextField
                      label="Username"
                      fullWidth
                      variant="outlined"
                      onChange={(event) => setUsername(event.target.value)}
                    />
                    <TextField
                      label="Password"
                      fullWidth
                      variant="outlined"
                      type="password"
                      onChange={(event) => setPassword(event.target.value)}
                    />
                    <Box display="flex" flexDirection="row-reverse">
                      <Button variant="contained" color="primary" type="submit">
                        Register
                      </Button>
                    </Box>
                  </form>
                </Box>
              </TabPanel>
            </SwipeableViews>
            <Collapse in={errorOpen}>
              <Alert
                severity="error"
                action={
                  <IconButton
                    size="small"
                    onClick={() => dispatch({ type: 'CLEAR_LANDING_ERROR' })}
                  >
                    <Close fontSize="inherit" />
                  </IconButton>
                }
              >
                {landingErrors.string}
              </Alert>
            </Collapse>
          </Paper>
        </Box>
      </Box>
    </>
  );
}

export default LandingPage;
