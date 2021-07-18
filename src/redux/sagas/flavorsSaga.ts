import axios, { AxiosResponse } from 'axios';
import { put, takeEvery, call } from 'redux-saga/effects';
import { SagaActions, SagaGeneratorReturn } from '../../models/sagaResource';
import { ReduxActions } from '../../models/reduxResource';
import { Flavors } from '../../models/modelResource';

// Fetches list of broad palette flavors used throughout the app
function* fetchFlavors(): SagaGeneratorReturn<Flavors[]> {
  try {
    const response: AxiosResponse<Flavors[]> = yield call(
      axios.get,
      '/api/flavors'
    );
    yield put({ type: ReduxActions.SET_FLAVORS, payload: response.data });
  } catch (err) {
    console.log('Error in fetchFlavors', err);
  }
}

export default function* flavorsSaga() {
  yield takeEvery(SagaActions.FETCH_FLAVORS, fetchFlavors);
}
