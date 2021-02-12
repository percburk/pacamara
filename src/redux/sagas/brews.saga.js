import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

function* fetchBrews(action) {
  try {
    const response = yield axios.get(`/api/brews/${action.payload}`);
    yield put({ type: 'SET_BREWS', payload: response.data });
  } catch (err) {
    console.log('error in fetchBrews', err);
  }
}

function* brewsSaga() {
  yield takeEvery('FETCH_BREWS', fetchBrews);
}

export default brewsSaga;
