import axios, { AxiosResponse } from 'axios'
import { put, takeLatest, call } from 'redux-saga/effects'
import { User, MethodsArrayAgg } from '../../models/modelResource'
import { ReduxActions } from '../../models/redux/reduxResource'
import { SagaActions, SagaGeneratorReturn } from '../../models/redux/sagaResource'

// Worker Saga: will be fired on "FETCH_USER" actions
function* fetchUser(): SagaGeneratorReturn<User & MethodsArrayAgg[], User> {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    }

    // Config includes credentials which allow the server to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    const userResponse: AxiosResponse<User> = yield call(axios.get, '/api/user', config)
    const methodsResponse: AxiosResponse<MethodsArrayAgg[]> = yield call(
      axios.get,
      '/api/user/methods'
    )

    // Now that the session has given us a user object with an id and username,
    // set the client-side user object to let the client-side know the user is
    // logged in, also send along array of brew methods to the user reducer
    yield put({
      type: ReduxActions.SET_USER,
      payload: {
        ...userResponse.data,
        methodsArray: methodsResponse.data[0].arrayAgg,
      },
    })
  } catch (err) {
    console.log('error in fetchUser', err)
  }
}

export default function* userSaga() {
  yield takeLatest(SagaActions.FETCH_USER, fetchUser)
}
