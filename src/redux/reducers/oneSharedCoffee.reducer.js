const oneSharedCoffeeReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_ONE_SHARED_COFFEE':
      return action.payload;
    default:
      return state;
  }
};

export default oneSharedCoffeeReducer;
