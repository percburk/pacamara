import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

// Fetches one coffee to be displayed on CoffeeDetails
function* fetchOneCoffee(action) {
  const id = action.payload;
  try {
    const response = yield axios.get(`/api/one-coffee/${id}`);
    yield put({ type: 'SET_ONE_COFFEE', payload: response.data[0] });
  } catch (err) {
    console.log('error in fetchOneCoffee', err);
  }
}

// Edits information for an individual coffee
function* editCoffee(action) {
  try {
    yield axios.put('/api/one-coffee/edit', action.payload);
    yield put({ type: 'FETCH_COFFEES' });
  } catch (err) {
    console.log('error in editCoffee', err);
  }
}

// Toggles boolean status of 'fav' or 'brewing' for an individual coffee
function* setBrewingOrFavOneCoffee(action) {
  try {
    yield axios.put('/api/one-coffee/fav-brew', action.payload);
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
