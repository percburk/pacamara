import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// Worker Saga: will be fired on "LOGIN" actions
function* loginUser(action) {
  try {
    // Clear any existing error on the login page
    yield put({ type: 'CLEAR_LOGIN_ERROR' });

    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    // Send the action.payload as the body
    // Config includes credentials which allow the server to recognize the user
    yield axios.post('/api/user/login', action.payload, config);

    // After the user has logged in, get the user information from the server
    yield put({ type: 'FETCH_USER' });
  } catch (err) {
    console.log('Error with user login:', err);
    if (err.response.status === 401) {
      // The 401 is the error status sent from passport if user isn't in the 
      // database or if the username and password don't match in the database
      yield put({ type: 'LOGIN_FAILED' });
    } else {
      // Got an error that wasn't a 401
      // Could be anything, but most common cause is the server is not started
      yield put({ type: 'LOGIN_FAILED_NO_CODE' });
    }
  }
}

// Worker Saga: will be fired on "LOGOUT" actions
function* logoutUser(action) {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    // Config includes credentials which allow the server to recognize the user
    // When the server recognizes the user session, it will end the session
    yield axios.post('/api/user/logout', config);

    // Now that the session has ended on the server, remove the client-side 
    // user object to let the client-side know the user is logged out
    yield put({ type: 'UNSET_USER' });
  } catch (err) {
    console.log('Error with user logout:', err);
  }
}

function* loginSaga() {
  yield takeLatest('LOGIN', loginUser);
  yield takeLatest('LOGOUT', logoutUser);
}

export default loginSaga;
