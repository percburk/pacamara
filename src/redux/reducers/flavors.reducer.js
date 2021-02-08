const flavorsReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_FLAVORS':
      return action.payload;
    default:
      return state;
  }
};

export default flavorsReducer;
