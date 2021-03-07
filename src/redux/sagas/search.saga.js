import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

// fetchSearch gets a pared down list of coffee info for searching on Nav
// Populates the Autocomplete menu with the names of coffees to be searched
function* fetchSearch() {
  try {
    const response = yield axios.get('/api/coffees/search');
    yield put({ type: 'SET_SEARCH', payload: response.data });
  } catch (err) {
    console.log('error in fetchSearch', err);
  }
}

function* searchSaga() {
  yield takeEvery('FETCH_SEARCH', fetchSearch);
}

export default searchSaga;
