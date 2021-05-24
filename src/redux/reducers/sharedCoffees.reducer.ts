// sharedCoffeesReducer contains any entries of shared coffees 
// sent by other users, this is checked in UseEffect() on Dashboard
const sharedCoffeesReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_SHARED_COFFEES':
      return action.payload;
    default:
      return state;
  }
};

export default sharedCoffeesReducer;
