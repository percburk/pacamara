import { User } from '../../models/modelResource'
import { ReduxActions, ReduxDispatch } from '../../models/redux/reduxResource'

const initialState = {
  id: 0,
  username: '',
  profilePic: '',
  methodsDefaultId: 0,
  kettle: '',
  grinder: '',
  tdsMin: 0,
  tdsMax: 0,
  extMin: 0,
  extMax: 0,
  name: '',
  methodsDefaultLrr: 0,
  methodsArray: [],
}

// userReducer will hold a username, password, and profile information
// if someone is logged in
const userReducer = (
  state: User = initialState,
  action: ReduxDispatch<User>
): User => {
  switch (action.type) {
    case ReduxActions.SET_USER:
      return action.payload
    case ReduxActions.UNSET_USER:
      return initialState
    default:
      return state
  }
}

export default userReducer
