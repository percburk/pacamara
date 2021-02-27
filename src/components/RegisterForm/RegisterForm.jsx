import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Typography, TextField, Button } from '@material-ui/core';

// RegisterForm is displayed on LandingPage, handles registering a new user
function RegisterForm({ classes }) {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Handles the registration process
  const handleRegister = (event) => {
    event.preventDefault();
    if (username && password) {
      dispatch({
        type: 'REGISTER',
        payload: { username, password },
      });
      dispatch({ type: 'CLEAR_LANDING_ERROR' });
    } else {
      dispatch({ type: 'REGISTRATION_INPUT_ERROR' });
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h6" align="center">
        REGISTER
      </Typography>
      <form onSubmit={handleRegister}>
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
            Register
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default RegisterForm;
