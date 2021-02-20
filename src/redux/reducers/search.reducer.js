// searchReducer contains a pared down list of coffee info the user can search
// through on Nav
const searchReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_SEARCH':
      return action.payload;
    default:
      return state;
  }
};

export default searchReducer;
