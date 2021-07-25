import { CoffeeItem } from '../../models/modelResource';
import {
  ReduxDispatch,
  ReduxActions,
} from '../../models/redux/reduxResource';

// coffeesReducer contains all the coffees displayed on a user's dashboard
// also contains search results
const coffeesReducer = (
  state: CoffeeItem[] = [],
  action: ReduxDispatch<CoffeeItem[]>
): CoffeeItem[] => {
  switch (action.type) {
    case ReduxActions.SET_COFFEES:
      return action.payload;
    default:
      return state;
  }
};

export default coffeesReducer;
