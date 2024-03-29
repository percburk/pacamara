import axios, { AxiosResponse } from 'axios'
import { put, takeEvery, call } from 'redux-saga/effects'
import { CoffeeItem } from '../../models/modelResource'
import { ReduxActions } from '../../models/redux/reduxResource'
import {
  BrewingOrFavPayload,
  DeleteCoffeePayload,
} from '../../models/redux/sagaPayloadResource'
import {
  SagaActions,
  SagaDispatch,
  SagaGeneratorReturn,
} from '../../models/redux/sagaResource'

// Fetches coffees to display on Dashboard
// Conditionally sends to different GET routes on coffees.router
// depending on if a search is being executed
function* fetchCoffees(
  action: SagaDispatch<string>
): SagaGeneratorReturn<CoffeeItem[]> {
  const whichRoute = action.payload
    ? call(axios.get, 'api/coffees/search-results', {
        params: { q: action.payload },
      })
    : call(axios.get, '/api/coffees/')

  try {
    const response: AxiosResponse<CoffeeItem[]> = yield whichRoute
    yield put({ type: ReduxActions.SET_COFFEES, payload: response.data })
  } catch (err) {
    console.log('Error in fetchCoffees', err)
  }
}

// Toggle boolean 'fav' or 'brewing' status of an individual coffee
function* setBrewingOrFav(
  action: SagaDispatch<BrewingOrFavPayload>
): SagaGeneratorReturn<number | string> {
  const { id, change, q, oneCoffeeId } = action.payload
  const fetchWhichCoffee = id
    ? { type: SagaActions.FETCH_COFFEES, payload: q }
    : { type: SagaActions.FETCH_ONE_COFFEE, payload: oneCoffeeId }

  try {
    yield call(axios.put, '/api/one-coffee/fav-brew/', {
      id: id || oneCoffeeId,
      change,
    })
    yield put(fetchWhichCoffee)
  } catch (err) {
    console.log('Error in setBrewingOrFav', err)
  }
}

// Delete a coffee from the database
function* deleteCoffee(
  action: SagaDispatch<DeleteCoffeePayload>
): SagaGeneratorReturn<string> {
  const { id, q } = action.payload
  try {
    yield call(axios.delete, `/api/coffees/delete/${id}`)
    yield put({
      type: SagaActions.FETCH_COFFEES,
      payload: q,
    })
    yield put({ type: SagaActions.FETCH_SHARED_COFFEES })
  } catch (err) {
    console.log('Error in deleteCoffee', err)
  }
}

// Add a new coffee to the database
function* addCoffee(action: SagaDispatch<CoffeeItem>): SagaGeneratorReturn<never> {
  try {
    yield call(axios.post, '/api/coffees/add', action.payload)
    yield put({ type: SagaActions.FETCH_COFFEES })
    yield put({ type: SagaActions.FETCH_SHARED_COFFEES })
  } catch (err) {
    console.log('Error in addCoffee', err)
  }
}

export default function* coffeesSaga() {
  yield takeEvery(SagaActions.FETCH_COFFEES, fetchCoffees)
  yield takeEvery(SagaActions.SET_BREWING_OR_FAV, setBrewingOrFav)
  yield takeEvery(SagaActions.DELETE_COFFEE, deleteCoffee)
  yield takeEvery(SagaActions.ADD_COFFEE, addCoffee)
}
