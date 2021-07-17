import { ReduxActions, ReduxDispatch } from '../../models/reduxResource';
import {
  EditInputsPayload,
  OneCoffeePayloadTypes,
} from '../../models/payloadResource';
import { CoffeeItem } from '../../models/modelResource';

// oneCoffeeReducer contains the coffee being displayed on CoffeeDetails
// It is also edited in EditCoffee through dispatches
const oneCoffeeReducer = (
  state = {
    id: 0,
    date: '',
    roaster: '',
    roast_date: '',
    is_blend: false,
    blend_name: '',
    country: '',
    producer: '',
    region: '',
    elevation: '',
    cultivars: '',
    processing: '',
    notes: '',
    coffee_pic: '',
    flavors_array: [],
    is_fav: false,
    shared_by_id: 0,
    brewing: false,
  },
  action: ReduxDispatch<OneCoffeePayloadTypes>
) => {
  switch (action.type) {
    case ReduxActions.SET_ONE_COFFEE:
      return action.payload;
    case ReduxActions.EDIT_INPUTS:
      const { key, change } = action.payload as EditInputsPayload;
      return { ...state, [key]: change };
    case ReduxActions.EDIT_FLAVORS_ARRAY:
      const id = action.payload;
      const { flavors_array } = state as CoffeeItem;
      if (!flavors_array.includes(id as number)) {
        return {
          ...state,
          flavors_array: [...flavors_array, id],
        };
      } else {
        return {
          ...state,
          flavors_array: flavors_array.filter((index) => index !== id),
        };
      }
    default:
      return state;
  }
};

export default oneCoffeeReducer;
