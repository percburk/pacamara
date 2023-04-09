import { useState, ChangeEvent } from 'react'
import { Box, Typography, TextField, Button } from '@material-ui/core'
// Hooks
import { useAppDispatch } from '../../hooks/useAppDispatchSelector'
// Models
import { ReduxActions } from '../../models/redux/reduxResource'
import { SagaActions } from '../../models/redux/sagaResource'
import { UseStylesType } from '../LandingPage/LandingPage'

// RegisterForm is displayed on LandingPage, handles registering a new user
export default function RegisterForm({ classes }: { classes: UseStylesType }) {
  const dispatch = useAppDispatch()
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  // Handles the registration process
  const handleRegister = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (username && password) {
      dispatch({
        type: SagaActions.REGISTER,
        payload: { username, password },
      })
      dispatch({ type: ReduxActions.CLEAR_LANDING_ERROR })
    } else {
      dispatch({ type: ReduxActions.REGISTRATION_INPUT_ERROR })
    }
  }

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
  )
}
