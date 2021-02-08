import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

function* fetchCoffees(action) {
  const id = action.payload;
  try {
    const response = yield axios.get(`/api/coffee/${id}`);
    yield put({ type: 'SET_COFFEES', payload: response.data });
  } catch (err) {
    console.log('error in fetchCoffees', err);
  }
}

function* coffeesSaga() {
  yield takeEvery('FETCH_COFFEES', fetchCoffees);
}

export default coffeesSaga;
