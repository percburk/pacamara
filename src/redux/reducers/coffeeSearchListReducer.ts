import { CoffeeSearchList } from '../../models/modelResource';
import { ReduxDispatch, ReduxActions } from '../../models/reduxResource';

// searchReducer contains a pared down list of coffee info the user can search
// through on Nav
const coffeeSearchListReducer = (
  state: CoffeeSearchList[] = [],
  action: ReduxDispatch<CoffeeSearchList[]>
): CoffeeSearchList[] => {
  switch (action.type) {
    case ReduxActions.SET_COFFEE_SEARCH_LIST:
      return action.payload;
    default:
      return state;
  }
};

export default coffeeSearchListReducer;
