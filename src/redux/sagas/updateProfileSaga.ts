import axios from 'axios';
import { put, takeEvery, call } from 'redux-saga/effects';
import {
  SagaActions,
  SagaDispatch,
  SagaGeneratorReturn,
} from '../../models/reduxSaga/sagaResource';
import { UpdateProfilePayload } from '../../models/reduxSaga/sagaPayloadResource';

// PUT route to update information for both a new and existing user
// Since registration creates a username and password but nothing else,
// any info sent here will always be a PUT
function* updateProfile(
  action: SagaDispatch<UpdateProfilePayload>
): SagaGeneratorReturn<never> {
  try {
    yield call(axios.put, '/api/user/update', action.payload);
    yield put({ type: SagaActions.FETCH_USER });
  } catch (err) {
    console.log('error in updateProfile', err);
  }
}

export default function* updateProfileSaga() {
  yield takeEvery(SagaActions.UPDATE_PROFILE, updateProfile);
}
