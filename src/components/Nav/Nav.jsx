import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import { useSelector } from 'react-redux';
import { Typography, Box } from '@material-ui/core';

function Nav() {
  const history = useHistory();
  const user = useSelector((store) => store.user);

  let loginLinkData = {
    path: '/login',
    text: 'Login / Register',
  };

  if (user.id != null) {
    loginLinkData.path = '/user';
    loginLinkData.text = 'Home';
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      p={2}
      justifyContent="space-between"
      boxShadow={2}
      marginBottom={5}
    >
      <Box display="flex" alignItems="center">
        <Box px={3}>
          <img
            src="/images/coffee-illustration.jpg"
            height="75"
            onClick={() => history.push('/home')}
            style={{ cursor: 'pointer' }}
          />
        </Box>
        <Typography
          variant="h4"
          onClick={() => history.push('/home')}
          style={{ cursor: 'pointer' }}
        >
          PACAMARA
        </Typography>
      </Box>
      <Box>
        <Link className="navLink" to={loginLinkData.path}>
          {loginLinkData.text}
        </Link>

        {user.id && (
          <>
            <Link className="navLink" to="/info">
              Info Page
            </Link>
            <LogOutButton className="navLink" />
          </>
        )}
      </Box>
    </Box>
  );
}

export default Nav;
