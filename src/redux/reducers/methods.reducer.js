const methodsReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_METHODS':
      return action.payload;
    default:
      return state;
  }
};

export default methodsReducer;
