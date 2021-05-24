import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

// Fetches one coffee to be displayed on CoffeeDetails
function* fetchOneCoffee(action) {
  try {
    const response = yield axios.get(`/api/one-coffee/${action.payload}`);
    yield put({ type: 'SET_ONE_COFFEE', payload: response.data[0] });
  } catch (err) {
    console.log('Error in fetchOneCoffee', err);
  }
}

// Edits information for an individual coffee
function* editCoffee(action) {
  try {
    yield axios.put('/api/one-coffee/edit', action.payload);
    yield put({ type: 'FETCH_COFFEES' });
  } catch (err) {
    console.log('Error in editCoffee', err);
  }
}

export default function* oneCoffeeSaga() {
  yield takeEvery('FETCH_ONE_COFFEE', fetchOneCoffee);
  yield takeEvery('EDIT_COFFEE', editCoffee);
}
