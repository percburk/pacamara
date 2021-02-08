import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

function* fetchOneCoffee(action) {
  const id = action.payload;
  try {
    const response = yield axios.get(`/api/coffee/details/${id}`);
    yield put({ type: 'SET_ONE_COFFEE', payload: response.data });
  } catch (err) {
    console.log('error in fetchOneCoffee', err);
  }
}

function* oneCoffeeSaga() {
  yield takeEvery('FETCH_ONE_COFFEE', fetchOneCoffee);
}

export default oneCoffeeSaga;
