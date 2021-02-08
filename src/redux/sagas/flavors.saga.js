import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

function* fetchFlavors() {
  try {
    const response = yield axios.get('/api/flavors');
    yield put({ type: 'SET_FLAVORS', payload: response.data });
  } catch (err) {
    console.log('error in fetchFlavors', err);
  }
}

function* flavorsSaga() {
  yield takeEvery('FETCH_FLAVORS', fetchFlavors);
}

export default flavorsSaga;