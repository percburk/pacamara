import axios, {AxiosResponse} from 'axios'
import {put, takeEvery, call} from 'redux-saga/effects'
import {ReduxActions} from '../../models/redux/reduxResource'
import {
  SagaActions,
  SagaDispatch,
  SagaGeneratorReturn,
} from '../../models/redux/sagaResource'
import {Brew} from '../../models/modelResource'
import {BrewCoffeeIdPayload, FavBrewPayload} from '../../models/redux/sagaPayloadResource'

// Fetches list of all brews for the coffee displayed in CoffeeDetails
function* fetchBrews(action: SagaDispatch<number>): SagaGeneratorReturn<Brew[]> {
  try {
    const response: AxiosResponse<Brew[]> = yield call(
      axios.get,
      `/api/brews/${action.payload}`
    )

    yield put({type: ReduxActions.SET_BREWS, payload: response.data})
  } catch (err) {
    console.log('Error in fetchBrews', err)
  }
}

// Deletes a brew instance
function* deleteBrew(
  action: SagaDispatch<BrewCoffeeIdPayload>
): SagaGeneratorReturn<number> {
  const {brewId, coffeeId} = action.payload
  try {
    yield call(axios.delete, `/api/brews/delete/${brewId}`)
    yield put({type: SagaActions.FETCH_BREWS, payload: coffeeId})
  } catch (err) {
    console.log('Error in deleteBrew', err)
  }
}

// Toggles whether a brew is thumbs up, down, or none
function* favBrew(action: SagaDispatch<FavBrewPayload>): SagaGeneratorReturn<number> {
  const {brewId, coffeeId, change} = action.payload
  try {
    yield call(axios.patch, `api/brews/like/${brewId}`, {change})
    yield put({type: SagaActions.FETCH_BREWS, payload: coffeeId})
  } catch (err) {
    console.log('Error in favBrew', err)
  }
}

// Adds a new brew instance to the db
function* addBrew(action: SagaDispatch<Brew>): SagaGeneratorReturn<number> {
  try {
    yield call(axios.post, '/api/brews/add', action.payload)
    yield put({
      type: SagaActions.FETCH_BREWS,
      payload: action.payload.coffeesId,
    })
  } catch (err) {
    console.log('Error in addBrew', err)
  }
}

// Edits a brew instance
function* editBrew(action: SagaDispatch<Brew>): SagaGeneratorReturn<number> {
  try {
    yield call(axios.put, '/api/brews/edit', action.payload)
    yield put({
      type: SagaActions.FETCH_BREWS,
      payload: action.payload.coffeesId,
    })
  } catch (err) {
    console.log('Error in editBrew', err)
  }
}

export default function* brewsSaga() {
  yield takeEvery(SagaActions.FETCH_BREWS, fetchBrews)
  yield takeEvery(SagaActions.DELETE_BREW, deleteBrew)
  yield takeEvery(SagaActions.LIKE_BREW, favBrew)
  yield takeEvery(SagaActions.ADD_BREW, addBrew)
  yield takeEvery(SagaActions.EDIT_BREW, editBrew)
}
