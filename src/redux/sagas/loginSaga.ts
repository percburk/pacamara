import axios from 'axios';
import { put, takeLatest, call } from 'redux-saga/effects';
import { LoginRegisterPayload } from '../../models/redux/sagaPayloadResource';
import {
  SagaActions,
  SagaDispatch,
  SagaGeneratorReturn,
} from '../../models/redux/sagaResource';
import { ReduxActions } from '../../models/redux/reduxResource';

// Worker Saga: will be fired on "LOGIN" actions
function* loginUser(
  action: SagaDispatch<LoginRegisterPayload>
): SagaGeneratorReturn<never> {
  try {
    // Clear any existing error on the login page
    yield put({ type: ReduxActions.CLEAR_LANDING_ERROR });

    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    // Send the action.payload as the body
    // Config includes credentials which allow the server to recognize the user
    yield call(axios.post, '/api/user/login', action.payload, config);

    // After the user has logged in, get the user information from the server
    yield put({ type: SagaActions.FETCH_USER });
  } catch (err) {
    console.log('Error in loginUser', err);
    if (err.response.status === 401) {
      // The 401 is the error status sent from passport if user isn't in the
      // database or if the username and password don't match in the database
      yield put({ type: ReduxActions.LOGIN_FAILED });
    } else {
      // Got an error that wasn't a 401
      // Could be anything, but most common cause is the server is not started
      yield put({ type: ReduxActions.LOGIN_FAILED_NO_CODE });
    }
  }
}

// Worker Saga: will be fired on "LOGOUT" actions
function* logoutUser(): SagaGeneratorReturn<never> {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    // Config includes credentials which allow the server to recognize the user
    // When the server recognizes the user session, it will end the session
    yield call(axios.post, '/api/user/logout', config);

    // Now that the session has ended on the server, remove the client-side
    // user object to let the client-side know the user is logged out
    yield put({ type: ReduxActions.UNSET_USER });
  } catch (err) {
    console.log('Error in logoutUser', err);
  }
}

export default function* loginSaga() {
  yield takeLatest(SagaActions.LOGIN, loginUser);
  yield takeLatest(SagaActions.LOGOUT, logoutUser);
}
