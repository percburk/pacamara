import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

function* fetchCoffees() {
  try {
    const response = yield axios.get('/api/coffee/');
    yield put({ type: 'SET_COFFEES', payload: response.data });
  } catch (err) {
    console.log('error in fetchCoffees', err);
  }
}

function* setFavorite(action) {
  try {
    yield axios.put(`/api/coffee/fav/${action.payload}`);
    yield put({ type: 'FETCH_COFFEES' });
  } catch (err) {
    console.log('error in setFavorite', err);
  }
}

function* deleteCoffee(action) {
  try {
    yield axios.delete(`/api/coffee/delete/${action.payload}`);
    yield put({ type: 'FETCH_COFFEES' });
  } catch (err) {
    console.log('error in deleteCoffee', err);
  }
}

function* addCoffee(action) {
  try {
    yield axios.post('/api/coffee', action.payload);
    yield put({type: 'FETCH_COFFEES'})
  } catch (err) {
    console.log('error in addCoffee', err);
    
  }
}

function* coffeesSaga() {
  yield takeEvery('FETCH_COFFEES', fetchCoffees);
  yield takeEvery('SET_FAVORITE', setFavorite);
  yield takeEvery('DELETE_COFFEE', deleteCoffee);
  yield takeEvery('ADD_COFFEE', addCoffee);
}

export default coffeesSaga;
