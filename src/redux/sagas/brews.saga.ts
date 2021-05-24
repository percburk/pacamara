import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';
import { ReduxActions } from '../actions/redux.actions';
import { SagaActions } from '../actions/saga.actions';

// Fetches list of all brews for the coffee displayed in CoffeeDetails
function* fetchBrews(action) {
  try {
    const response = yield axios.get(`/api/brews/${action.payload}`);
    yield put({ type: ReduxActions.SET_BREWS, payload: response.data });
  } catch (err) {
    console.log('Error in fetchBrews', err);
  }
}

// Deletes a brew instance
function* deleteBrew(action) {
  const { brewId, coffeeId }: { brewId: number; coffeeId: number } =
    action.payload;
  try {
    yield axios.delete(`/api/brews/delete/${brewId}`);
    yield put({ type: SagaActions.FETCH_BREWS, payload: coffeeId });
  } catch (err) {
    console.log('Error in deleteBrew', err);
  }
}

// Toggles whether a brew is thumbs up, down, or none
function* favBrew(action) {
  const {
    brewId,
    coffeeId,
    change,
  }: { brewId: number; coffeeId: number; change: string } = action.payload;
  try {
    yield axios.put(`api/brews/like/${brewId}`, { change });
    yield put({ type: SagaActions.FETCH_BREWS, payload: coffeeId });
  } catch (err) {
    console.log('Error in favBrew', err);
  }
}

// Adds a new brew instance to the db
function* addBrew(action) {
  try {
    yield axios.post('/api/brews/add', action.payload);
    yield put({
      type: SagaActions.FETCH_BREWS,
      payload: action.payload.coffees_id,
    });
  } catch (err) {
    console.log('Error in addBrew', err);
  }
}

// Edits a brew instance
function* editBrew(action) {
  try {
    yield axios.put('/api/brews/edit', action.payload);
    yield put({
      type: SagaActions.FETCH_BREWS,
      payload: action.payload.coffees_id,
    });
  } catch (err) {
    console.log('Error in editBrew', err);
  }
}

export default function* brewsSaga() {
  yield takeEvery(SagaActions.FETCH_BREWS, fetchBrews);
  yield takeEvery(SagaActions.DELETE_BREW, deleteBrew);
  yield takeEvery(SagaActions.LIKE_BREW, favBrew);
  yield takeEvery(SagaActions.ADD_BREW, addBrew);
  yield takeEvery(SagaActions.EDIT_BREW, editBrew);
}
