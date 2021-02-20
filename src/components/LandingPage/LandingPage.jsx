import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SwipeableViews from 'react-swipeable-views';
import './LandingPage.css';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Collapse,
  makeStyles,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';

import RegisterForm from '../RegisterForm/RegisterForm';
import LoginForm from '../LoginForm/LoginForm';

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

const useStyles = makeStyles((theme) => ({
  root: {
    width: 400,
  },
  textInputs: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  button: {
    marginTop: theme.spacing(1),
    width: 120,
  },
}));

function LandingPage() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const landingErrors = useSelector((store) => store.landingErrors);
  const [tab, setTab] = useState(0);
  const errorOpen = useSelector((store) => store.landingErrors.open);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <Box
        className="background"
        display="flex"
        alignItems="center"
        flexDirection="row-reverse"
        height="80vh"
      >
        <Box marginRight={14} className={classes.root}>
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
                <LoginForm
                  classes={classes}
                  username={username}
                  setUsername={setUsername}
                  password={password}
                  setPassword={setPassword}
                />
              </TabPanel>
              <TabPanel tab={tab} index={1}>
                <RegisterForm
                  classes={classes}
                  username={username}
                  setUsername={setUsername}
                  password={password}
                  setPassword={setPassword}
                />
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
