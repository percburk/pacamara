import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// Worker Saga: will be fired on "REGISTER" actions
function* registerUser(action) {
  try {
    // Clears any existing error on the registration page
    yield put({ type: 'CLEAR_REGISTRATION_ERROR' });
    // Passes the username and password from the payload to the server
    yield axios.post('/api/user/register', action.payload);
    // Automatically logs a user in after registration
    yield put({ type: 'LOGIN', payload: action.payload });
  } catch (err) {
    console.log('Error in registerUser', err);
    yield put({ type: 'REGISTRATION_FAILED' });
  }
}

export default function* registrationSaga() {
  yield takeLatest('REGISTER', registerUser);
}
