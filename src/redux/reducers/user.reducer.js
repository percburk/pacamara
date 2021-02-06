// userReducer will hold a username and password if someone is logged in
const userReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload;
    case 'UNSET_USER':
      return {};
    default:
      return state;
  }
};

// On Redux as state.user
export default userReducer;
