export interface Flavors {
  id: number;
  name: string;
}

export interface Methods extends Flavors {
  dripSpeed: string;
  lrr: number;
}

export interface Brew {
  id: number;
  coffeesId: number;
  methodsId: number;
  liked: string;
  date: string;
  waterDose: number;
  coffeeDose: number;
  grind: number;
  moisture: number;
  co2: number;
  ratio: number;
  tds: number;
  ext: number;
  waterTemp: number;
  time: string;
  lrr: number;
}

export interface User {
  id: number;
  username: string;
  profilePic: string;
  methodsDefaultId: number;
  kettle: string;
  grinder: string;
  tdsMin: number;
  tdsMax: number;
  extMin: number;
  extMax: number;
  name: string;
  methodsDefaultLrr: number;
  methodsArray: number[];
}

export interface SharedCoffees {
  id: number;
  senderId: number;
  recipientId: number;
  coffeesId: number;
  message: string;
  profilePic: string;
  coffeeName: string;
  username: string;
}

export interface SharingUserList {
  id: number;
  username: string;
  name: string;
  profilePic: string;
}

export interface OneSharedCoffee {
  id: number;
  date: string;
  roaster: string;
  roastDate: string;
  isBlend: boolean;
  blendName: string;
  country: string;
  producer: string;
  region: string;
  elevation: string;
  cultivars: string;
  processing: string;
  notes: string;
  coffeePic: string;
  flavorsArray: number[];
}

export interface CoffeeItem extends OneSharedCoffee {
  isFav: boolean;
  sharedById: number | null;
  brewing: boolean;
}

export interface CoffeeSearchList {
  country?: string;
  producer?: string;
  blendName?: string;
  roaster: string;
  usersId: number;
}

export interface MethodsArrayAgg {
  arrayAgg: number[];
}

export interface BrewLikeStatus {
  change: 'yes' | 'no' | 'none';
}

export interface FavBrewCoffee {
  change: string;
  id: number;
}

export interface SendSharedCoffeePayload {
  recipientId: number;
  coffeesId: number;
  coffeeName: string;
  message: string;
}

export interface AddSharedCoffeeToDashboardPayload {
  coffeesId: number;
  sharedById: number;
}

export interface RegisterRequest {
  username: string;
  password: string;
}
