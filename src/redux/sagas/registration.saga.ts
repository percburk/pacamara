import axios from 'axios';
import { put, takeLatest, call } from 'redux-saga/effects';
import { SagaActions, SagaDispatch } from '../../models/sagaResource';
import { ReduxActions } from '../../models/reduxResource';
import { LoginRegisterPayload } from '../../models/payloadResource';

// Worker Saga: will be fired on "REGISTER" actions
function* registerUser(action: SagaDispatch<LoginRegisterPayload>) {
  try {
    // Clears any existing error on the registration page
    yield put({ type: ReduxActions.CLEAR_LANDING_ERROR });
    // Passes the username and password from the payload to the server
    yield call(axios.post, '/api/user/register', action.payload);
    // Automatically logs a user in after registration
    yield put({ type: SagaActions.LOGIN, payload: action.payload });
  } catch (err) {
    console.log('Error in registerUser', err);
    yield put({ type: ReduxActions.REGISTRATION_FAILED });
  }
}

export default function* registrationSaga() {
  yield takeLatest(SagaActions.REGISTER, registerUser);
}
