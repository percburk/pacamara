const searchReducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_SEARCH_STRING':
      return action.payload;
    case 'CLEAR_SEARCH_STRING':
      return '';
    default:
      return state;
  }
};

export default searchReducer;
