import { all } from 'redux-saga/effects';
import loginSaga from './login.saga';
import registrationSaga from './registration.saga';
import userSaga from './user.saga';
import methodsSaga from './methods.saga';
import coffeesSaga from './coffees.saga';
import oneCoffeeSaga from './oneCoffee.saga';
import flavorsSaga from './flavors.saga';
import updateProfileSaga from './updateProfile.saga';
import brewsSaga from './brews.saga';
import searchSaga from './search.saga';
import shareSaga from './share.saga';

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
    searchSaga(), // Gets the list of pared down searchable info for coffees
    shareSaga(), // Handles all coffee-sharing related routes
  ]);
}
