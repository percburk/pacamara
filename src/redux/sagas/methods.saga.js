import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchMethods() {
  try {
    const response = yield axios.get('/methods');
    yield put({ type: 'SET_METHODS', payload: response.data });
  } catch (err) {
    console.log('error in fetchMethods:', err);
  }
}

function* methodsSaga() {
  yield takeLatest('FETCH_METHODS', fetchMethods);
}

export default methodsSaga;
