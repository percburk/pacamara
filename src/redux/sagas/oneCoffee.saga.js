import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

function* fetchOneCoffee(action) {
  const id = action.payload;
  try {
    const response = yield axios.get(`/api/coffee/details/${id}`);
    yield put({ type: 'SET_ONE_COFFEE', payload: response.data[0] });
  } catch (err) {
    console.log('error in fetchOneCoffee', err);
  }
}

function* editCoffee(action) {
  try {
    yield axios.put(`/api/coffee/edit/`, action.payload);
    yield put({ type: 'FETCH_COFFEES' });
  } catch (err) {
    console.log('error in editCoffee', err);
  }
}

function* setFavoriteOneCoffee(action) {
  try {
    yield axios.put(`/api/coffee/fav/${action.payload}`);
    yield put({ type: 'FETCH_ONE_COFFEE', payload: action.payload });
  } catch (err) {
    console.log('error in setFavoriteOneCoffee', err);
  }
}

function* oneCoffeeSaga() {
  yield takeEvery('FETCH_ONE_COFFEE', fetchOneCoffee);
  yield takeEvery('EDIT_COFFEE', editCoffee);
  yield takeEvery('SET_FAVORITE_ONE_COFFEE', setFavoriteOneCoffee);
}

export default oneCoffeeSaga;
