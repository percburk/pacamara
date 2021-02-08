import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

function* fetchMethods() {
  try {
    const response = yield axios.get('/api/methods');
    yield put({ type: 'SET_METHODS', payload: response.data });
  } catch (err) {
    console.log('error in fetchMethods:', err);
  }
}

function* methodsSaga() {
  yield takeEvery('FETCH_METHODS', fetchMethods);
}

export default methodsSaga;
