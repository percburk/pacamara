import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

// Fetches list of brew methods which are used throughout the app
function* fetchMethods() {
  try {
    const response = yield axios.get('/api/methods');
    yield put({ type: 'SET_METHODS', payload: response.data });
  } catch (err) {
    console.log('error in fetchMethods:', err);
  }
}

export default function* methodsSaga() {
  yield takeEvery('FETCH_METHODS', fetchMethods);
}