import { User } from '../../models/modelResource';
import {
  ReduxActions,
  ReduxDispatch,
} from '../../models/redux/reduxResource';

const initialState = {
  id: 0,
  username: '',
  profile_pic: '',
  methods_default_id: 0,
  kettle: '',
  grinder: '',
  tds_min: 0,
  tds_max: 0,
  ext_min: 0,
  ext_max: 0,
  name: '',
  methods_default_lrr: 0,
};

// userReducer will hold a username, password, and profile information
// if someone is logged in
const userReducer = (
  state: User = initialState,
  action: ReduxDispatch<User>
): User => {
  switch (action.type) {
    case ReduxActions.SET_USER:
      return action.payload;
    case ReduxActions.UNSET_USER:
      return initialState;
    default:
      return state;
  }
};

export default userReducer;
