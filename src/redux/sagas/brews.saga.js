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
  try {
    yield axios.delete(`/api/brews/delete/${action.payload.brewId}`);
    yield put({ type: 'FETCH_BREWS', payload: action.payload.coffeeId });
  } catch (err) {
    console.log('error in deleteBrew', err);
  }
}

function* favBrew(action) {
  try {
    yield axios.put(`api/brews/fav/${action.payload.brewId}`);
    yield put({ type: 'FETCH_BREWS', payload: action.payload.coffeeId });
  } catch (err) {
    console.log('error in favBrew', err);
  }
}

function* brewsSaga() {
  yield takeEvery('FETCH_BREWS', fetchBrews);
  yield takeEvery('DELETE_BREW', deleteBrew);
  yield takeEvery('FAV_BREW', favBrew);
}

export default brewsSaga;
