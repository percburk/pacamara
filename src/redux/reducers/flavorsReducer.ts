import { Flavors } from '../../models/modelResource';
import { ReduxActions, ReduxDispatch } from '../../models/reduxResource';

// flavorsReducer contains list of flavors, which are displayed as Chips
// in various places around the app
const flavorsReducer = (
  state: Flavors[] = [],
  action: ReduxDispatch<Flavors[]>
): Flavors[] => {
  switch (action.type) {
    case ReduxActions.SET_FLAVORS:
      return action.payload;
    default:
      return state;
  }
};

export default flavorsReducer;
