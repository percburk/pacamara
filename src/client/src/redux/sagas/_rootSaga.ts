import { all } from 'redux-saga/effects'
import brewsSaga from './brewsSaga'
import coffeeSearchListSaga from './coffeeSearchListSaga'
import coffeesSaga from './coffeesSaga'
import dashboardSaga from './dashboardSaga'
import flavorsSaga from './flavorsSaga'
import loginSaga from './loginSaga'
import methodsSaga from './methodsSaga'
import oneCoffeeSaga from './oneCoffeeSaga'
import registrationSaga from './registrationSaga'
import shareSaga from './shareSaga'
import updateProfileSaga from './updateProfileSaga'
import userSaga from './userSaga'

// rootSaga is the primary saga.
// It bundles up all of the other sagas so the project can use them.
// This is imported into index.js as rootSaga
export default function* rootSaga() {
  yield all([
    loginSaga(), // Handles login/logout actions
    registrationSaga(), // Handles new user registration
    userSaga(), // Gets all info of the current user logged in
    methodsSaga(), // Gets the list from brew methods from database
    coffeesSaga(), // Handles all non-individual coffee-related routes
    oneCoffeeSaga(), // Handles GET and PUT of individual coffees
    flavorsSaga(), // Gets the list of flavors from database
    updateProfileSaga(), // Handles any profile updates for new/existing users
    brewsSaga(), // Handles GET, PUT, and DELETE routes for brew instances
    coffeeSearchListSaga(), // Gets the list of pared down searchable info for coffees
    shareSaga(), // Handles all coffee-sharing related routes
    dashboardSaga(), // Handles GET of all data the dashboard requires on login
  ])
}
