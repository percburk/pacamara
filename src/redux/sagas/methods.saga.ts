import axios, { AxiosResponse } from 'axios';
import { put, takeEvery, call } from 'redux-saga/effects';
import { Methods } from '../../models/modelResource';
import { ReduxActions } from '../../models/reduxResource';
import { SagaActions } from '../../models/sagaResource';

// Fetches list of brew methods which are used throughout the app
function* fetchMethods() {
  try {
    const response: AxiosResponse<Methods[]> = yield call(
      axios.get,
      '/api/methods'
    );
    yield put({ type: ReduxActions.SET_METHODS, payload: response.data });
  } catch (err) {
    console.log('Error in fetchMethods:', err);
  }
}

export default function* methodsSaga() {
  yield takeEvery(SagaActions.FETCH_METHODS, fetchMethods);
}
