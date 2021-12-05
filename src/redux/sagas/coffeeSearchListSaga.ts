import axios, { AxiosResponse } from 'axios';
import { put, takeEvery, call } from 'redux-saga/effects';
import { CoffeeSearchList } from '../../models/modelResource';
import { ReduxActions } from '../../models/redux/reduxResource';
import {
  SagaActions,
  SagaGeneratorReturn,
} from '../../models/redux/sagaResource';

// fetchSearch gets a pared down list of coffee info for searching on Nav
// Populates the Autocomplete menu with the names of coffees to be searched
function* fetchCoffeeSearchList(): SagaGeneratorReturn<CoffeeSearchList[]> {
  try {
    const response: AxiosResponse<CoffeeSearchList[]> = yield call(
      axios.get,
      '/api/coffees/search'
    );
    yield put({
      type: ReduxActions.SET_COFFEE_SEARCH_LIST,
      payload: response.data,
    });
  } catch (err) {
    console.log('Error in fetchCoffeeSearchList', err);
  }
}

export default function* coffeeSearchListSaga() {
  yield takeEvery(SagaActions.FETCH_COFFEE_SEARCH_LIST, fetchCoffeeSearchList);
}
