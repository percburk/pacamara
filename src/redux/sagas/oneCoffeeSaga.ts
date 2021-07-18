import axios, { AxiosResponse } from 'axios';
import { put, takeEvery, call } from 'redux-saga/effects';
import { CoffeeItem } from '../../models/modelResource';
import { ReduxActions, ReduxDispatch } from '../../models/reduxResource';
import {
  SagaDispatch,
  SagaActions,
  SagaGeneratorReturn,
} from '../../models/sagaResource';

// Fetches one coffee to be displayed on CoffeeDetails
function* fetchOneCoffee(
  action: SagaDispatch<number>
): SagaGeneratorReturn<CoffeeItem[], CoffeeItem> {
  try {
    const response: AxiosResponse<CoffeeItem[]> = yield call(
      axios.get,
      `/api/one-coffee/${action.payload}`
    );
    yield put({ type: ReduxActions.SET_ONE_COFFEE, payload: response.data[0] });
  } catch (err) {
    console.log('Error in fetchOneCoffee', err);
  }
}

// Edits information for an individual coffee
function* editCoffee(
  action: SagaDispatch<CoffeeItem>
): SagaGeneratorReturn<never> {
  try {
    yield call(axios.put, '/api/one-coffee/edit', action.payload);
    yield put({ type: SagaActions.FETCH_COFFEES });
  } catch (err) {
    console.log('Error in editCoffee', err);
  }
}

export default function* oneCoffeeSaga() {
  yield takeEvery(SagaActions.FETCH_ONE_COFFEE, fetchOneCoffee);
  yield takeEvery(SagaActions.EDIT_COFFEE, editCoffee);
}
