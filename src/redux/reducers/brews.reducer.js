const brewsReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_BREWS':
      return action.payload;
    default:
      return state;
  }
};

export default brewsReducer;
