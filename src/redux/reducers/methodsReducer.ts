import { Methods } from '../../models/modelResource';
import {
  ReduxActions,
  ReduxDispatch,
} from '../../models/redux/reduxResource';

// methodsReducer contains the list of brew methods a user can choose from
const methodsReducer = (
  state: Methods[] = [],
  action: ReduxDispatch<Methods[]>
): Methods[] => {
  switch (action.type) {
    case ReduxActions.SET_METHODS:
      return action.payload;
    default:
      return state;
  }
};

export default methodsReducer;
