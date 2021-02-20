import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

// PUT route to update information for both a new and existing user
// Since registration creates a username and password but nothing else,
// any info sent here will always be a PUT
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
