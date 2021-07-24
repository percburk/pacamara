import { ReduxActions, ReduxDispatch } from '../../models/redux/reduxResource';
import {
  EditInputsPayload,
  OneCoffeePayloadTypes,
} from '../../models/redux/reduxPayloadResource';
import { CoffeeItem } from '../../models/modelResource';

const initialState: CoffeeItem = {
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
};

// oneCoffeeReducer contains the coffee being displayed on CoffeeDetails
// It is also edited in EditCoffee through dispatches
const oneCoffeeReducer = (
  state: CoffeeItem = initialState,
  action: ReduxDispatch<OneCoffeePayloadTypes>
): CoffeeItem => {
  switch (action.type) {
    case ReduxActions.SET_ONE_COFFEE:
      return action.payload as CoffeeItem;
    case ReduxActions.EDIT_INPUTS:
      const { key, change } = action.payload as EditInputsPayload;
      return { ...state, [key]: change };
    case ReduxActions.EDIT_FLAVORS_ARRAY:
      const id = action.payload as number;
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
    case ReduxActions.CLEAR_ONE_COFFEE:
      return initialState;
    default:
      return state;
  }
};

export default oneCoffeeReducer;
