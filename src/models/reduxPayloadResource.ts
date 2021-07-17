import {
  CoffeeItem,
  Flavors,
  Methods,
  Brew,
  User,
  SharedCoffees,
  CoffeeSearchList,
  SharingUserList,
  OneSharedCoffee,
} from './modelResource';

export interface EditInputsPayload {
  key: string;
  change: string;
}

export type OneCoffeePayloadTypes = CoffeeItem | number | EditInputsPayload;

export type ReduxDispatchPayloadTypes =
  | CoffeeItem[]
  | CoffeeItem
  | Methods[]
  | Flavors[]
  | Brew[]
  | User
  | SharedCoffees[]
  | CoffeeSearchList[]
  | SharingUserList[]
  | OneSharedCoffee
  | EditInputsPayload
  | number;
