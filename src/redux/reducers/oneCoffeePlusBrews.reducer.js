const oneCoffeePlusBrewsReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_ONE_COFFEE':
      return action.paylaod;
    default:
      return state;
  }
}

export default oneCoffeePlusBrewsReducer;