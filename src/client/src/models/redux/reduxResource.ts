import {
  Brew,
  CoffeeItem,
  Flavors,
  Methods,
  Snackbar,
  User,
  SharedCoffees,
  SharingUserList,
  CoffeeSearchList,
  OneSharedCoffee,
  LandingError,
} from '../modelResource'

export enum ReduxActions {
  // Set data in reducers
  SET_BREWS = 'SET_BREWS',
  SET_COFFEES = 'SET_COFFEES',
  SET_COFFEE_SEARCH_LIST = 'SET_COFFEE_SEARCH_LIST',
  SET_FLAVORS = 'SET_FLAVORS',
  SET_METHODS = 'SET_METHODS',
  SET_ONE_SHARED_COFFEE = 'SET_ONE_SHARED_COFFEE',
  SET_ONE_COFFEE = 'SET_ONE_COFFEE',
  SET_SHARED_COFFEES = 'SET_SHARED_COFFEES',
  SET_SHARE_USER_LIST = 'SET_SHARE_USER_LIST',
  // Landing page errors
  CLEAR_LANDING_ERROR = 'CLEAR_LANDING_ERROR',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGIN_INPUT_ERROR = 'LOGIN_INPUT_ERROR',
  LOGIN_FAILED_NO_CODE = 'LOGIN_FAILED_NO_CODE',
  REGISTRATION_INPUT_ERROR = 'REGISTRATION_INPUT_ERROR',
  REGISTRATION_FAILED = 'REGISTRATION_FAILED',
  // Edit coffee
  EDIT_INPUTS = 'EDIT_INPUTS',
  EDIT_FLAVORS_ARRAY = 'EDIT_FLAVORS_ARRAY',
  // Clear data in reducers
  CLEAR_ONE_SHARED_COFFEE = 'CLEAR_ONE_SHARED_COFFEE',
  CLEAR_ONE_COFFEE = 'CLEAR_ONE_COFFEE',
  // Snackbars
  SNACKBARS_CREATED_PROFILE = 'SNACKBARS_CREATED_PROFILE',
  SNACKBARS_UPDATED_PROFILE = 'SNACKBARS_UPDATED_PROFILE',
  SNACKBARS_METHODS_ERROR = 'SNACKBARS_METHODS_ERROR',
  SNACKBARS_FLAVORS_ERROR = 'SNACKBARS_FLAVORS_ERROR',
  SNACKBARS_ADDED_COFFEE = 'SNACKBARS_ADDED_COFFEE',
  SNACKBARS_EDITED_COFFEE = 'SNACKBARS_EDITED_COFFEE',
  SNACKBARS_DELETED_COFFEE = 'SNACKBARS_DELETED_COFFEE',
  SNACKBARS_ADDED_BREW = 'SNACKBARS_ADDED_BREW',
  SNACKBARS_EDITED_BREW = 'SNACKBARS_EDITED_BREW',
  SNACKBARS_DELETED_BREW = 'SNACKBARS_DELETED_BREW',
  SNACKBARS_SENT_SHARED_COFFEE = 'SNACKBARS_SENT_SHARED_COFFEE',
  SNACKBARS_DECLINED_SHARED_COFFEE = 'SNACKBARS_DECLINED_SHARED_COFFEE',
  SNACKBARS_ADDED_SHARED_COFFEE = 'SNACKBARS_ADDED_SHARED_COFFEE',
  CLEAR_SNACKBARS = 'CLEAR_SNACKBARS',
  // Login/Logout
  SET_USER = 'SET_USER',
  UNSET_USER = 'UNSET_USER',
}

export interface ReduxDispatchNoPayload {
  type: ReduxActions
}

export interface ReduxDispatch<T> extends ReduxDispatchNoPayload {
  payload: T
}

// Redux initial state interface
export interface InitialState {
  coffees: CoffeeItem[]
  oneCoffee: CoffeeItem
  flavors: Flavors[]
  methods: Methods[]
  brews: Brew[]
  snackbars: Snackbar
  user: User
  sharedCoffees: SharedCoffees[]
  sharingUserList: SharingUserList[]
  coffeeSearchList: CoffeeSearchList[]
  oneSharedCoffee: OneSharedCoffee
  landingErrors: LandingError
}
