// searchReducer contains a pared down list of coffee info the user can search
// through on Nav
const coffeeSearchListReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_COFFEE_SEARCH_LIST':
      return action.payload;
    default:
      return state;
  }
};

export default coffeeSearchListReducer;
