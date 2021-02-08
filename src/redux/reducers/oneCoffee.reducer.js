const oneCoffeeReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_ONE_COFFEE':
      return action.payload;
    default:
      return state;
  }
}

export default oneCoffeeReducer;