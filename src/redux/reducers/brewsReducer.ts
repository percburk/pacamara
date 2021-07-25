import { ReduxDispatch, ReduxActions } from '../../models/redux/reduxResource';
import { Brew } from '../../models/modelResource';

// brewsReducer contains the list of brew instances for the coffee displayed
// on CoffeeDetails
const brewsReducer = (
  state: Brew[] = [],
  action: ReduxDispatch<Brew[]>
): Brew[] => {
  switch (action.type) {
    case ReduxActions.SET_BREWS:
      return action.payload;
    default:
      return state;
  }
};

export default brewsReducer;
