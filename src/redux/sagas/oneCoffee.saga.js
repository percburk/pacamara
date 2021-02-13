import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

function* fetchOneCoffee(action) {
  const id = action.payload;
  try {
    const response = yield axios.get(`/api/oneCoffee/${id}`);
    yield put({ type: 'SET_ONE_COFFEE', payload: response.data[0] });
  } catch (err) {
    console.log('error in fetchOneCoffee', err);
  }
}

function* editCoffee(action) {
  try {
    yield axios.put('/api/oneCoffee/edit', action.payload);
    yield put({ type: 'FETCH_COFFEES' });
  } catch (err) {
    console.log('error in editCoffee', err);
  }
}

function* setBrewingOrFavOneCoffee(action) {
  try {
    yield axios.put('/api/oneCoffee/favBrew', action.payload);
    yield put({ type: 'FETCH_ONE_COFFEE', payload: action.payload.id });
  } catch (err) {
    console.log('error in setFavoriteOneCoffee', err);
  }
}

function* oneCoffeeSaga() {
  yield takeEvery('FETCH_ONE_COFFEE', fetchOneCoffee);
  yield takeEvery('EDIT_COFFEE', editCoffee);
  yield takeEvery('SET_BREWING_OR_FAV_ONE_COFFEE', setBrewingOrFavOneCoffee);
}

export default oneCoffeeSaga;
