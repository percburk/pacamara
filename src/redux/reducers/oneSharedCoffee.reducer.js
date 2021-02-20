// Contains list of coffee info displayed on SharedCoffeeDialog, when a user
// clicks on a shared coffee on their AvatarMenu
const oneSharedCoffeeReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_ONE_SHARED_COFFEE':
      return action.payload;
    case 'CLEAR_ONE_SHARED_COFFEE':
      return {};
    default:
      return state;
  }
};

export default oneSharedCoffeeReducer;
