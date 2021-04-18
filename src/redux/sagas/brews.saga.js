import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

// Fetches list of all brews for the coffee displayed in CoffeeDetails
function* fetchBrews(action) {
  try {
    const response = yield axios.get(`/api/brews/${action.payload}`);
    yield put({ type: 'SET_BREWS', payload: response.data });
  } catch (err) {
    console.log('Error in fetchBrews', err);
  }
}

// Deletes a brew instance
function* deleteBrew(action) {
  const { brewId, coffeeId } = action.payload;
  try {
    yield axios.delete(`/api/brews/delete/${brewId}`);
    yield put({ type: 'FETCH_BREWS', payload: coffeeId });
  } catch (err) {
    console.log('Error in deleteBrew', err);
  }
}

// Toggles whether a brew is thumbs up, down, or none
function* favBrew(action) {
  const { brewId, coffeeId, change } = action.payload;
  try {
    yield axios.put(`api/brews/like/${brewId}`, { change });
    yield put({ type: 'FETCH_BREWS', payload: coffeeId });
  } catch (err) {
    console.log('Error in favBrew', err);
  }
}

// Adds a new brew instance to the db
function* addBrew(action) {
  try {
    yield axios.post('/api/brews/add', action.payload);
    yield put({ type: 'FETCH_BREWS', payload: action.payload.coffees_id });
  } catch (err) {
    console.log('Error in addBrew', err);
  }
}

// Edits a brew instance
function* editBrew(action) {
  try {
    yield axios.put('/api/brews/edit', action.payload);
    yield put({ type: 'FETCH_BREWS', payload: action.payload.coffees_id });
  } catch (err) {
    console.log('Error in editBrew', err);
  }
}

export default function* brewsSaga() {
  yield takeEvery('FETCH_BREWS', fetchBrews);
  yield takeEvery('DELETE_BREW', deleteBrew);
  yield takeEvery('LIKE_BREW', favBrew);
  yield takeEvery('ADD_BREW', addBrew);
  yield takeEvery('EDIT_BREW', editBrew);
}
