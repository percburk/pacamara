import { combineReducers } from 'redux';
import errors from './errors.reducer';
import user from './user.reducer';
import methods from './methods.reducer';
import coffees from './coffees.reducer';
import oneCoffee from './oneCoffee.reducer';
import flavors from './flavors.reducer';
import snackbars from './snackbars.reducer';
import brews from './brews.reducer';

// rootReducer is the primary reducer for the entire project
// It bundles up all of the other reducers so the project can use them.
// This is imported into index.js as rootReducer

// Makes one object for our store, containing the objects from all reducers.
const rootReducer = combineReducers({
  errors, // Contains errors.registrationMessage and errors.loginMessage
  user, // Will have an id and username if someone is logged in
  methods, // Contains 'methods' table for NewProfile
  coffees, // Contains list of coffees for Dashboard
  oneCoffee, // Contains info for CoffeeDetails page plus brews
  flavors, // Contains flavors for flavor palette in AddCoffee
  snackbars, // Contains all Snackbar messages that display on Dashboard
  brews, // Contains the brew instances paired to the coffee in oneCoffee
});

export default rootReducer;
