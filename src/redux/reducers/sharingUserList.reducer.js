const shareUserListReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_SHARE_USER_LIST':
      return action.payload;
    default:
      return state;
  }
};

export default shareUserListReducer;
