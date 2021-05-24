import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

// Fetches list of broad palette flavors used throughout the app
function* fetchFlavors() {
  try {
    const response = yield axios.get('/api/flavors');
    yield put({ type: 'SET_FLAVORS', payload: response.data });
  } catch (err) {
    console.log('Error in fetchFlavors', err);
  }
}

export default function* flavorsSaga() {
  yield takeEvery('FETCH_FLAVORS', fetchFlavors);
}
