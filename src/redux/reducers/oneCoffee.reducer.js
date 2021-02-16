const oneCoffeeReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_ONE_COFFEE':
      return action.payload;
    case 'EDIT_INPUTS':
      return { ...state, [action.payload.key]: action.payload.change };
    case 'EDIT_ROAST_DATE':
      return { ...state, roast_date: action.payload };
    case 'EDIT_IS_BLEND':
      return { ...state, is_blend: !state.is_blend };
    case 'EDIT_SWITCH':
      if (action.payload === 'is_blend') {
        return { ...state, is_blend: !state.is_blend };
      } else {
        return { ...state, brewing: !state.brewing };
      }
    case 'EDIT_PHOTO':
      return { ...state, coffee_pic: action.payload };
    case 'EDIT_FLAVORS_ARRAY':
      const id = action.payload;
      if (state.flavors_array.indexOf(id) === -1) {
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
