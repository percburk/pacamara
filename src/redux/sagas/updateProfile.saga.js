import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

function* updateProfile(action) {
  try {
    yield axios.put('/api/user/update', action.payload);
    yield put({ type: 'FETCH_USER' });
  } catch (err) {
    console.log('error in updateUserProfile', err);
  }
}

function* updateProfileSaga() {
  yield takeEvery('UPDATE_PROFILE', updateProfile);
}

export default updateProfileSaga;
