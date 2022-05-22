import {useState} from 'react'
import SwipeableViews from 'react-swipeable-views'
import {Box, Paper, Tabs, Tab, IconButton, Collapse, makeStyles} from '@material-ui/core'
import {Close} from '@material-ui/icons'
import {Alert} from '@material-ui/lab'
// Hooks
import {useAppDispatch, useAppSelector} from '../../hooks/useAppDispatchSelector'
// Models
import {ReduxActions} from '../../models/redux/reduxResource'
// CSS
import './LandingPage.css'
// Components
import RegisterForm from '../RegisterForm/RegisterForm'
import LoginForm from '../LoginForm/LoginForm'
import TabPanel from './TabPanel'

// Styling
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
}))
export type UseStylesType = ReturnType<typeof useStyles>

// LandingPage is the login and registration page
export default function LandingPage() {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const {string, open} = useAppSelector((store) => store.landingErrors)
  const [tab, setTab] = useState<number>(0)

  return (
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
          <SwipeableViews index={tab} onChangeIndex={(event, value) => setTab(value)}>
            <TabPanel tab={tab} index={0}>
              <LoginForm classes={classes} />
            </TabPanel>
            <TabPanel tab={tab} index={1}>
              <RegisterForm classes={classes} />
            </TabPanel>
          </SwipeableViews>
          <Collapse in={open}>
            <Alert
              severity="error"
              action={
                <IconButton
                  size="small"
                  onClick={() => dispatch({type: ReduxActions.CLEAR_LANDING_ERROR})}
                >
                  <Close fontSize="inherit" />
                </IconButton>
              }
            >
              {string}
            </Alert>
          </Collapse>
        </Paper>
      </Box>
    </Box>
  )
}
