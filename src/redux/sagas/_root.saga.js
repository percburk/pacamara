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
import imageSaga from './image.saga';

// rootSaga is the primary saga.
// It bundles up all of the other sagas so the project can use them.
// This is imported into index.js as rootSaga

// Some sagas trigger other sagas, as an example:
// the registration triggers a login
// and login triggers setting the user
export default function* rootSaga() {
  yield all([
    loginSaga(), // login saga is now registered
    registrationSaga(),
    userSaga(),
    methodsSaga(),
    coffeesSaga(),
    oneCoffeeSaga(),
    flavorsSaga(),
    updateProfileSaga(),
    brewsSaga(),
    imageSaga(),
  ]);
}
