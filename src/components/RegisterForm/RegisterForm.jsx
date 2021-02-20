import { useDispatch } from 'react-redux';
import { Box, Typography, TextField, Button } from '@material-ui/core';

function RegisterForm({
  classes,
  username,
  setUsername,
  password,
  setPassword,
}) {
  const dispatch = useDispatch();

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
