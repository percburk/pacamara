import { put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

// Gets list of users to search and share coffees with
function* fetchSharingUserList() {
  try {
    const response = yield axios.get('/api/share/users');
    yield put({ type: 'SET_SHARE_USER_LIST', payload: response.data });
  } catch (err) {
    console.log('Error in fetchShareUsers', err);
  }
}

// Gets any shared coffees a user may have waiting
function* fetchSharedCoffees() {
  try {
    const response = yield axios.get('/api/share');
    yield put({ type: 'SET_SHARED_COFFEES', payload: response.data });
  } catch (err) {
    console.log('Error in fetchSharedCoffees', err);
  }
}

// When a user clicks on a shared coffee in AvatarMenu, this saga grabs
// pertinent details of that coffee to display on SharedCoffeeDialog
function* fetchOneSharedCoffee(action) {
  try {
    const response = yield axios.get(`/api/share/${action.payload}`);
    yield put({ type: 'SET_ONE_SHARED_COFFEE', payload: response.data[0] });
  } catch (err) {
    console.log('Error in fetchOneSharedCoffee', err);
  }
}

// Fires when a user shares a coffee entry with another user
function* sendSharedCoffee(action) {
  try {
    yield axios.post('/api/share', action.payload);
  } catch (err) {
    console.log('Error in sendSharedCoffee', err);
  }
}

// POST to add the shared coffee to the current user's dashboard
function* addSharedCoffeeToDashboard(action) {
  try {
    yield axios.post('/api/share/add', action.payload);
    yield put({ type: 'FETCH_SHARED_COFFEES' });
    yield put({ type: 'FETCH_COFFEES' });
  } catch (err) {
    console.log('Error in addSharedCoffee', err);
  }
}

// Deletes the entry if a user declines to add a shared coffee, or adds it to
// their dashboard, removing it from their shared coffee list
function* deleteSharedCoffee(action) {
  try {
    yield axios.delete(`/api/share/delete/${action.payload}`);
    yield put({ type: 'FETCH_SHARED_COFFEES' });
  } catch (err) {
    console.log('Error in deleteSharedCoffee', err);
  }
}

export default function* shareSaga() {
  yield takeEvery('FETCH_SHARING_USER_LIST', fetchSharingUserList);
  yield takeEvery('SEND_SHARED_COFFEE', sendSharedCoffee);
  yield takeEvery('FETCH_SHARED_COFFEES', fetchSharedCoffees);
  yield takeEvery('FETCH_ONE_SHARED_COFFEE', fetchOneSharedCoffee);
  yield takeEvery('DELETE_SHARED_COFFEE', deleteSharedCoffee);
  yield takeEvery('ADD_SHARED_COFFEE_TO_DASHBOARD', addSharedCoffeeToDashboard);
}
