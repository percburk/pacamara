import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

// fetchSearch gets a pared down list of coffee info for searching on Nav
// Populates the Autocomplete menu with the names of coffees to be searched
function* fetchCoffeeSearchList() {
  try {
    const response = yield axios.get('/api/coffees/search');
    yield put({ type: 'SET_COFFEE_SEARCH_LIST', payload: response.data });
  } catch (err) {
    console.log('Error in fetchCoffeeSearchList', err);
  }
}

export default function* coffeeSearchListSaga() {
  yield takeEvery('FETCH_COFFEE_SEARCH_LIST', fetchCoffeeSearchList);
}
