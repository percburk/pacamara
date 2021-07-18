import { SharedCoffees } from '../../models/modelResource';
import {
  ReduxActions,
  ReduxDispatch,
} from '../../models/reduxSaga/reduxResource';

// sharedCoffeesReducer contains any entries of shared coffees
// sent by other users, this is checked in UseEffect() on Dashboard
const sharedCoffeesReducer = (
  state: SharedCoffees[] = [],
  action: ReduxDispatch<SharedCoffees[]>
): SharedCoffees[] => {
  switch (action.type) {
    case ReduxActions.SET_SHARED_COFFEES:
      return action.payload;
    default:
      return state;
  }
};

export default sharedCoffeesReducer;
