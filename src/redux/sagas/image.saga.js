import axios from 'axios';
import { takeLatest, put } from 'redux-saga/effects';

function* postImageUrl(action) {
  try {
    yield axios.put('/api/user/image', { url: action.payload });
    yield put({ type: 'FETCH_USER' });
  } catch (err) {
    console.log('error in postImageUrl', err);
  }
}

function* imageSaga() {
  yield takeLatest('POST_IMAGE_URL', postImageUrl);
}

export default imageSaga;
