import { put, takeEvery, call } from 'redux-saga/effects';
import axios, { AxiosResponse } from 'axios';
import {
  SagaDispatch,
  SagaActions,
  SagaGeneratorReturn,
} from '../../models/redux/sagaResource';
import { ReduxActions } from '../../models/redux/reduxResource';
import {
  CoffeeItem,
  SharedCoffees,
  SharingUserList,
} from '../../models/modelResource';
import {
  AddSharedCoffeeToDashboardPayload,
  SendSharedCoffeePayload,
} from '../../models/redux/sagaPayloadResource';

// Gets list of users to search and share coffees with
function* fetchSharingUserList(): SagaGeneratorReturn<SharingUserList[]> {
  try {
    const response: AxiosResponse<SharingUserList[]> = yield call(
      axios.get,
      '/api/share/users'
    );
    yield put({
      type: ReduxActions.SET_SHARE_USER_LIST,
      payload: response.data,
    });
  } catch (err) {
    console.log('Error in fetchShareUsers', err);
  }
}

// Gets any shared coffees a user may have waiting
function* fetchSharedCoffees(): SagaGeneratorReturn<SharedCoffees[]> {
  try {
    const response: AxiosResponse<SharedCoffees[]> = yield call(
      axios.get,
      '/api/share'
    );
    yield put({
      type: ReduxActions.SET_SHARED_COFFEES,
      payload: response.data,
    });
  } catch (err) {
    console.log('Error in fetchSharedCoffees', err);
  }
}

// When a user clicks on a shared coffee in AvatarMenu, this saga grabs
// pertinent details of that coffee to display on SharedCoffeeDialog
function* fetchOneSharedCoffee(
  action: SagaDispatch<number>
): SagaGeneratorReturn<CoffeeItem[], CoffeeItem> {
  try {
    const response: AxiosResponse<CoffeeItem[]> = yield call(
      axios.get,
      `/api/share/${action.payload}`
    );
    yield put({
      type: ReduxActions.SET_ONE_SHARED_COFFEE,
      payload: response.data[0],
    });
  } catch (err) {
    console.log('Error in fetchOneSharedCoffee', err);
  }
}

// Fires when a user shares a coffee entry with another user
function* sendSharedCoffee(
  action: SagaDispatch<SendSharedCoffeePayload>
): SagaGeneratorReturn<never> {
  try {
    yield call(axios.post, '/api/share', action.payload);
  } catch (err) {
    console.log('Error in sendSharedCoffee', err);
  }
}

// POST to add the shared coffee to the current user's dashboard
function* addSharedCoffeeToDashboard(
  action: SagaDispatch<AddSharedCoffeeToDashboardPayload>
): SagaGeneratorReturn<never> {
  try {
    yield call(axios.post, '/api/share/add', action.payload);
    yield put({ type: SagaActions.FETCH_SHARED_COFFEES });
    yield put({ type: SagaActions.FETCH_COFFEES });
  } catch (err) {
    console.log('Error in addSharedCoffee', err);
  }
}

// Deletes the entry if a user declines to add a shared coffee, or adds it to
// their dashboard, removing it from their shared coffee list
function* deleteSharedCoffee(
  action: SagaDispatch<number>
): SagaGeneratorReturn<never> {
  try {
    yield call(axios.delete, `/api/share/delete/${action.payload}`);
    yield put({ type: SagaActions.FETCH_SHARED_COFFEES });
  } catch (err) {
    console.log('Error in deleteSharedCoffee', err);
  }
}

export default function* shareSaga() {
  yield takeEvery(SagaActions.FETCH_SHARING_USER_LIST, fetchSharingUserList);
  yield takeEvery(SagaActions.SEND_SHARED_COFFEE, sendSharedCoffee);
  yield takeEvery(SagaActions.FETCH_SHARED_COFFEES, fetchSharedCoffees);
  yield takeEvery(SagaActions.FETCH_ONE_SHARED_COFFEE, fetchOneSharedCoffee);
  yield takeEvery(SagaActions.DELETE_SHARED_COFFEE, deleteSharedCoffee);
  yield takeEvery(
    SagaActions.ADD_SHARED_COFFEE_TO_DASHBOARD,
    addSharedCoffeeToDashboard
  );
}
