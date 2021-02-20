import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

// fetchSearch gets a pared down list of coffee info for searching on Nav
function* fetchSearch(action) {
  try {
    const response = yield axios.get('/api/coffees/search', {
      params: { string: action.payload },
    });
    yield put({ type: 'SET_SEARCH', payload: response.data });
  } catch (err) {
    console.log('error in fetchSearch', err);
  }
}

function* searchSaga() {
  yield takeEvery('FETCH_SEARCH', fetchSearch);
}

export default searchSaga;
