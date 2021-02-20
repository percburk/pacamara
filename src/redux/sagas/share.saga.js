import { put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

function* fetchSharingUserList() {
  try {
    const response = yield axios.get('/api/share/users');
    yield put({ type: 'SET_SHARE_USER_LIST', payload: response.data });
  } catch (err) {
    console.log('error in fetchShareUsers', err);
  }
}

function* fetchSharedCoffees() {
  try {
    const response = yield axios.get('/api/share');
    yield put({ type: 'SET_SHARED_COFFEES', payload: response.data });
  } catch (err) {
    console.log('error in fetchSharedCoffees', err);
  }
}

function* fetchOneSharedCoffee(action) {
  try {
    const response = yield axios.get(`/api/share/${action.payload}`);
    yield put({ type: 'SET_ONE_SHARED_COFFEE', payload: response.data[0] });
  } catch (err) {
    console.log('error in fetchOneSharedCoffee', err);
  }
}

function* sendSharedCoffee(action) {
  try {
    yield axios.post('/api/share', action.payload);
  } catch (err) {
    console.log('error in sendSharedCoffee', err);
  }
}

function* addSharedCoffeeToDashboard(action) {
  try {
    yield axios.post('/api/share/add', action.payload);
    yield put({ type: 'FETCH_SHARED_COFFEES' });
    yield put({ type: 'FETCH_COFFEES' });
  } catch (err) {
    console.log('error in addSharedCoffee', err);
  }
}

function* deleteSharedCoffee(action) {
  const { coffeeId, query } = action.payload;
  try {
    axios.delete(`/api/share/delete/${coffeeId}`);
    yield put({ type: 'FETCH_SHARED_COFFEES' });
    yield put({ type: 'FETCH_COFFEES', payload: query || '' });
  } catch (err) {
    console.log('error in deleteSharedCoffee', err);
  }
}

function* shareSaga() {
  yield takeEvery('FETCH_SHARING_USER_LIST', fetchSharingUserList);
  yield takeEvery('SEND_SHARED_COFFEE', sendSharedCoffee);
  yield takeEvery('FETCH_SHARED_COFFEES', fetchSharedCoffees);
  yield takeEvery('FETCH_ONE_SHARED_COFFEE', fetchOneSharedCoffee);
  yield takeEvery('DELETE_SHARED_COFFEE', deleteSharedCoffee);
  yield takeEvery('ADD_SHARED_COFFEE_TO_DASHBOARD', addSharedCoffeeToDashboard);
}

export default shareSaga;
