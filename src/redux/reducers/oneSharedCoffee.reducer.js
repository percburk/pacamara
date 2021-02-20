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
