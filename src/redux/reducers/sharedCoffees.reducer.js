const sharedCoffeesReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_SHARED_COFFEES':
      return action.payload;
    default:
      return state;
  }
};

export default sharedCoffeesReducer;
