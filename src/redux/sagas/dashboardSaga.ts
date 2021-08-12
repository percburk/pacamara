import { put, takeEvery, all } from 'redux-saga/effects';
// Models
import { SagaActions, SagaDispatch } from '../../models/redux/sagaResource';

// Fetches all data needed to display on dashboard upon user login
function* fetchDashboard(action: SagaDispatch<{ q: string }>) {
  try {
    yield all([
      // Fetches list of users that is searchable when sending a shared coffee
      put({ type: SagaActions.FETCH_SHARING_USER_LIST }),
      // Fetches list of all coffees, or those that match the query from payload
      put({ type: SagaActions.FETCH_COFFEES, payload: action.payload }),
      // Fetch list of flavor palette entries from the database
      put({ type: SagaActions.FETCH_FLAVORS }),
      // Checks if the user has any shared coffees to show on AvatarMenu
      put({ type: SagaActions.FETCH_SHARED_COFFEES }),
      // Fetches pared down list of coffees that can be searched in bar on Nav
      put({ type: SagaActions.FETCH_COFFEE_SEARCH_LIST }),
    ]);
  } catch (err) {
    console.log('Error in fetchDashboard', err);
  }
}

export default function* dashboardSaga() {
  yield takeEvery(SagaActions.FETCH_DASHBOARD, fetchDashboard);
}
