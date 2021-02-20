// brewsReducer contains the list of brew instances for the coffee displayed
// on CoffeeDetails
const brewsReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_BREWS':
      return action.payload;
    default:
      return state;
  }
};

export default brewsReducer;
