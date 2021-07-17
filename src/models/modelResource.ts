export interface Flavors {
  id: number;
  name: string;
}

export interface Methods extends Flavors {
  drip_speed: string;
  lrr: number;
}

export interface Brew {
  id: number;
  coffees_id: number;
  methods_id: number;
  liked: string;
  date: Date;
  water_code: number;
  coffee_dose: number;
  grind: number;
  moisture: number;
  co2: number;
  ratio: number;
  tds: number;
  ext: number;
  water_temp: number;
  time: string;
  lrr: number;
}

export interface LandingError {
  string: string;
  open: boolean;
}

export interface Snackbar extends LandingError {
  severity: 'info' | 'success' | 'error';
}

export interface User {
  id: number;
  username: string;
  profile_pic: string;
  methods_default_id: number;
  kettle: string;
  grinder: string;
  tds_min: number;
  tds_max: number;
  ext_min: number;
  ext_max: number;
  name: string;
  methods_default_lrr: number;
}

export interface SharedCoffees {
  id: number;
  sender_id: number;
  recipient_id: number;
  coffees_id: number;
  message: string;
  profile_pic: string;
  coffee_name: string;
  username: string;
}

export interface SharingUserList {
  id: number;
  username: string;
  name: string;
  profile_pic: string;
}

export interface OneSharedCoffee {
  id: number;
  date: string;
  roaster: string;
  roast_date: string;
  is_blend: boolean;
  blend_name?: string;
  country?: string;
  producer?: string;
  region?: string;
  elevation?: string;
  cultivars?: string;
  processing?: string;
  notes?: string;
  coffee_pic?: string;
  flavors_array: number[];
}

export interface CoffeeItem extends OneSharedCoffee {
  is_fav: boolean;
  shared_by_id?: number;
  brewing: boolean;
}

export interface CoffeeSearchList {
  country?: string;
  producer?: string;
  blend_name?: string;
  roaster: string;
  users_id: number;
}

export interface MethodsArrayAgg {
  array_agg: number[];
}

// Redux initial state interface
export interface InitialState {
  coffees: CoffeeItem[];
  oneCoffee: CoffeeItem;
  flavors: Flavors[];
  methods: Methods[];
  brews: Brew[];
  snackbars: Snackbar;
  user: User;
  sharedCoffees: SharedCoffees[];
  sharingUserList: SharingUserList[];
  coffeeSearchList: CoffeeSearchList[];
  oneSharedCoffee: OneSharedCoffee;
  landingErrors: LandingError;
}
