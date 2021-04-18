import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// Worker Saga: will be fired on "FETCH_USER" actions
function* fetchUser() {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    // Config includes credentials which allow the server to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    const userResponse = yield axios.get('/api/user', config);
    const methodsResponse = yield axios.get('/api/user/methods');

    // Now that the session has given us a user object with an id and username,
    // set the client-side user object to let the client-side know the user is
    // logged in, also send along array of brew methods to the user reducer
    yield put({
      type: 'SET_USER',
      payload: {
        ...userResponse.data,
        methods_array: methodsResponse.data[0].array_agg,
      },
    });
  } catch (err) {
    console.log('error in fetchUser', err);
  }
}

export default function* userSaga() {
  yield takeLatest('FETCH_USER', fetchUser);
}
