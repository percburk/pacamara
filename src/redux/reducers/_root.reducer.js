import { combineReducers } from 'redux';
import errors from './errors.reducer';
import user from './user.reducer';
import methods from './methods.reducer';
import coffees from './coffees.reducer';
import oneCoffeePlusBrews from './oneCoffeePlusBrews.reducer'

// rootReducer is the primary reducer for the entire project
// It bundles up all of the other reducers so the project can use them.
// This is imported into index.js as rootReducer

// Makes one object for our store, containing the objects from all reducers.
const rootReducer = combineReducers({
  errors, // Contains errors.registrationMessage and errors.loginMessage
  user, // Will have an id and username if someone is logged in
  methods, // Contains 'methods' table for NewProfile
  coffees, // Contains list of coffees for Dashboard
  oneCoffeePlusBrews, // Contains info for CoffeeDetails page plus brews
});

export default rootReducer;
