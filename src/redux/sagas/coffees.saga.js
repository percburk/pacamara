import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

// Fetches coffees to display on Dashboard
// Conditionally sends to different GET routes on coffees.router
// depending on if a search is being executed
function* fetchCoffees(action) {
  const whichRoute = action.payload
    ? axios.get('api/coffees/search-results', {
        params: { q: action.payload },
      })
    : axios.get('/api/coffees/');

  try {
    const response = yield whichRoute;
    yield put({ type: 'SET_COFFEES', payload: response.data });
  } catch (err) {
    console.log('error in fetchCoffees', err);
  }
}

// Toggle boolean 'fav' or 'brewing' status of an individual coffee
function* setBrewingOrFav(action) {
  const { id, change, q, oneCoffeeId } = action.payload;
  const fetchWhichCoffee = id
    ? { type: 'FETCH_COFFEES', payload: q }
    : { type: 'FETCH_ONE_COFFEE', payload: oneCoffeeId };

  try {
    yield axios.put('/api/one-coffee/fav-brew/', {
      id: id || oneCoffeeId,
      change,
    });
    yield put(fetchWhichCoffee);
  } catch (err) {
    console.log('error in setBrewingOrFav', err);
  }
}

// Delete a coffee from the database
function* deleteCoffee(action) {
  const { id, q } = action.payload;
  try {
    yield axios.delete(`/api/coffees/delete/${id}`);
    yield put({
      type: 'FETCH_COFFEES',
      payload: q,
    });
  } catch (err) {
    console.log('error in deleteCoffee', err);
  }
}

// Add a new coffee to the database
function* addCoffee(action) {
  try {
    yield axios.post('/api/coffees/add', action.payload);
    yield put({ type: 'FETCH_COFFEES' });
  } catch (err) {
    console.log('error in addCoffee', err);
  }
}

export default function* coffeesSaga() {
  yield takeEvery('FETCH_COFFEES', fetchCoffees);
  yield takeEvery('SET_BREWING_OR_FAV', setBrewingOrFav);
  yield takeEvery('DELETE_COFFEE', deleteCoffee);
  yield takeEvery('ADD_COFFEE', addCoffee);
}
