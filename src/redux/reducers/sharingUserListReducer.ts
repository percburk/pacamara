import { SharingUserList } from '../../models/modelResource';
import { ReduxActions, ReduxDispatch } from '../../models/reduxResource';

// sharingUserListReducer holds the list of usernames that is searchable by
// the user, when they're looking to send someone a coffee entry
const shareUserListReducer = (
  state: SharingUserList[] = [],
  action: ReduxDispatch<SharingUserList[]>
): SharingUserList[] => {
  switch (action.type) {
    case ReduxActions.SET_SHARE_USER_LIST:
      return action.payload;
    default:
      return state;
  }
};

export default shareUserListReducer;
