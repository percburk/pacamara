// coffeesReducer contains all the coffees displayed on a user's dashboard
// also contains search results
const coffeesReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_COFFEES':
      return action.payload;
    default:
      return state;
  }
};

export default coffeesReducer;
