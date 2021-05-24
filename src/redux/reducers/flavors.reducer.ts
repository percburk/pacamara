// flavorsReducer contains list of flavors, which are displayed as Chips 
// in various places around the app
const flavorsReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_FLAVORS':
      return action.payload;
    default:
      return state;
  }
};

export default flavorsReducer;
