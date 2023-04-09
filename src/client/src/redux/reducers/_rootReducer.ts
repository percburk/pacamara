import { combineReducers } from 'redux'
import brews from './brewsReducer'
import coffeeSearchList from './coffeeSearchListReducer'
import coffees from './coffeesReducer'
import flavors from './flavorsReducer'
import landingErrors from './landingErrorsReducer'
import methods from './methodsReducer'
import oneCoffee from './oneCoffeeReducer'
import oneSharedCoffee from './oneSharedCoffeeReducer'
import sharedCoffees from './sharedCoffeesReducer'
import sharingUserList from './sharingUserListReducer'
import snackbars from './snackbarsReducer'
import user from './userReducer'

// rootReducer is the primary reducer for the entire project
// It bundles up all of the other reducers so the project can use them.
// This is imported into index.js as rootReducer

// Makes one object for our store, containing the objects from all reducers.
const rootReducer = combineReducers({
  landingErrors, // Contains all errors for LandingPage login/registration
  user, // Will have an id and username if someone is logged in
  methods, // Contains 'methods' table for NewProfile
  coffees, // Contains list of coffees for Dashboard including search results
  oneCoffee, // Contains info for CoffeeDetails page plus brews
  flavors, // Contains flavors for flavor palette in AddCoffee
  snackbars, // Contains all Snackbar messages that display on Dashboard
  brews, // Contains the brew instances paired to the coffee in oneCoffee
  coffeeSearchList, // Contains smaller list of searchable coffee info for use in Nav
  sharingUserList, // List of users to search, used in sharing coffees
  sharedCoffees, // Any coffees that have been shared with the current user
  oneSharedCoffee, // All information of the specific coffee shared
})

export default rootReducer
