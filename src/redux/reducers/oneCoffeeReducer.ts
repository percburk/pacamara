import {ReduxActions, ReduxDispatch} from '../../models/redux/reduxResource'
import {
  EditInputsPayload,
  OneCoffeePayloadTypes,
} from '../../models/redux/reduxPayloadResource'
import {CoffeeItem} from '../../models/modelResource'

const initialState: CoffeeItem = {
  id: 0,
  date: '',
  roaster: '',
  roastDate: '',
  isBlend: false,
  blendName: '',
  country: '',
  producer: '',
  region: '',
  elevation: '',
  cultivars: '',
  processing: '',
  notes: '',
  coffeePic: '',
  flavorsArray: [],
  isFav: false,
  sharedById: 0,
  brewing: false,
}

// oneCoffeeReducer contains the coffee being displayed on CoffeeDetails
// It is also edited in EditCoffee through dispatches
const oneCoffeeReducer = (
  state: CoffeeItem = initialState,
  action: ReduxDispatch<OneCoffeePayloadTypes>
): CoffeeItem => {
  switch (action.type) {
    case ReduxActions.SET_ONE_COFFEE:
      return action.payload as CoffeeItem
    case ReduxActions.EDIT_INPUTS:
      const {key, change} = action.payload as EditInputsPayload
      return {...state, [key]: change}
    case ReduxActions.EDIT_FLAVORS_ARRAY:
      const id = action.payload as number
      if (!state.flavorsArray.includes(id)) {
        return {
          ...state,
          flavorsArray: [...state.flavorsArray, id],
        }
      } else {
        return {
          ...state,
          flavorsArray: state.flavorsArray.filter((index) => index !== id),
        }
      }
    case ReduxActions.CLEAR_ONE_COFFEE:
      return initialState
    default:
      return state
  }
}

export default oneCoffeeReducer
