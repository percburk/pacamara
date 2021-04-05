// oneCoffeeReducer contains the coffee being displayed on CoffeeDetails
// It is also edited in EditCoffee through dispatches
const oneCoffeeReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_ONE_COFFEE':
      return action.payload;
    case 'EDIT_INPUTS':
      return { ...state, [action.payload.key]: action.payload.change };
    case 'EDIT_FLAVORS_ARRAY':
      const id = action.payload;
      if (!state.flavors_array.includes(id)) {
        return {
          ...state,
          flavors_array: [...state.flavors_array, id],
        };
      } else {
        return {
          ...state,
          flavors_array: state.flavors_array.filter((index) => index !== id),
        };
      }
    default:
      return state;
  }
};

export default oneCoffeeReducer;
