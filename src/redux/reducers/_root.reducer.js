import { combineReducers } from 'redux';
import errors from './errors.reducer';
import user from './user.reducer';

// rootReducer is the primary reducer for the entire project
// It bundles up all of the other reducers so the project can use them.
// This is imported into index.js as rootReducer

// Makes one object for our store, containing the objects from all reducers.
const rootReducer = combineReducers({
  errors, // Contains errors.registrationMessage and errors.loginMessage
  user, // Will have an id and username if someone is logged in
});

export default rootReducer;
