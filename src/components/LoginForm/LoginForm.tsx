import { useState, ChangeEvent } from 'react';
import { Box, Typography, TextField, Button } from '@material-ui/core';
// Hooks
import { useAppDispatch } from '../../hooks/useAppDispatchSelector';
// Models
import { SagaActions } from '../../models/redux/sagaResource';
import { ReduxActions } from '../../models/redux/reduxResource';
import { UseStylesType } from '../LandingPage/LandingPage';

// LoginForm is displayed on LandingPage, handles login process
export default function LoginForm({ classes }: { classes: UseStylesType }) {
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Sends login info to server to begin login process
  const handleLogin = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username && password) {
      dispatch({
        type: SagaActions.LOGIN,
        payload: { username, password },
      });
      dispatch({ type: ReduxActions.CLEAR_LANDING_ERROR });
    } else {
      dispatch({ type: ReduxActions.LOGIN_INPUT_ERROR });
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
