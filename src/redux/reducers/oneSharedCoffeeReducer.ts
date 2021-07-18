import { ReduxActions, ReduxDispatch } from '../../models/reduxResource';
import { OneSharedCoffee } from '../../models/modelResource';

const initialState = {
  id: 0,
  date: '',
  roaster: '',
  roast_date: '',
  is_blend: false,
  blend_name: '',
  country: '',
  producer: '',
  region: '',
  elevation: '',
  cultivars: '',
  processing: '',
  notes: '',
  coffee_pic: '',
  flavors_array: [],
};

// Contains list of coffee info displayed on SharedCoffeeDialog, when a user
// clicks on a shared coffee on their AvatarMenu
const oneSharedCoffeeReducer = (
  state: OneSharedCoffee = initialState,
  action: ReduxDispatch<OneSharedCoffee>
): OneSharedCoffee => {
  switch (action.type) {
    case ReduxActions.SET_ONE_SHARED_COFFEE:
      return action.payload;
    case ReduxActions.CLEAR_ONE_SHARED_COFFEE:
      return initialState;
    default:
      return state;
  }
};

export default oneSharedCoffeeReducer;
