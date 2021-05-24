// sharingUserListReducer holds the list of usernames that is searchable by
// the user, when they're looking to send someone a coffee entry
const shareUserListReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_SHARE_USER_LIST':
      return action.payload;
    default:
      return state;
  }
};

export default shareUserListReducer;
