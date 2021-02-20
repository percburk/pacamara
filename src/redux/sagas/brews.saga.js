import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

function* fetchBrews(action) {
  try {
    const response = yield axios.get(`/api/brews/${action.payload}`);
    yield put({ type: 'SET_BREWS', payload: response.data });
  } catch (err) {
    console.log('error in fetchBrews', err);
  }
}

function* deleteBrew(action) {
  const { brewId, coffeeId } = action.payload;
  try {
    yield axios.delete(`/api/brews/delete/${brewId}`);
    yield put({ type: 'FETCH_BREWS', payload: coffeeId });
  } catch (err) {
    console.log('error in deleteBrew', err);
  }
}

function* favBrew(action) {
  const { brewId, coffeeId, change } = action.payload;
  const status = change === 'yes' ? 'no' : change === 'no' ? 'none' : 'yes';

  try {
    yield axios.put(`api/brews/like/${brewId}`, { status });
    yield put({ type: 'FETCH_BREWS', payload: coffeeId });
  } catch (err) {
    console.log('error in favBrew', err);
  }
}

function* addBrew(action) {
  try {
    yield axios.post('/api/brews/add', action.payload);
    yield put({ type: 'FETCH_BREWS', payload: action.payload.coffees_id });
  } catch (err) {
    console.log('error in addBrew', err);
  }
}

function* brewsSaga() {
  yield takeEvery('FETCH_BREWS', fetchBrews);
  yield takeEvery('DELETE_BREW', deleteBrew);
  yield takeEvery('LIKE_BREW', favBrew);
  yield takeEvery('ADD_BREW', addBrew);
}

export default brewsSaga;
