import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Typography, TextField, Button } from '@material-ui/core';

// LoginForm is displayed on LandingPage, handles login process
export default function LoginForm({ classes }) {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Sends login info to server to begin login process
  const handleLogin = (event) => {
    event.preventDefault();
    if (username && password) {
      dispatch({
        type: 'LOGIN',
        payload: { username, password },
      });
      dispatch({ type: 'CLEAR_LANDING_ERROR' });
    } else {
      dispatch({ type: 'LOGIN_INPUT_ERROR' });
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h6" align="center">
        LOGIN
      </Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label="Username"
          fullWidth
          className={classes.textInputs}
          variant="outlined"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <TextField
          label="Password"
          fullWidth
          className={classes.textInputs}
          variant="outlined"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className={classes.button}
          >
            Login
          </Button>
        </Box>
      </form>
    </Box>
  );
}
