export interface BrewCoffeeIdPayload {
  brewId: number;
  coffeeId: number;
}

export interface FavBrewPayload extends BrewCoffeeIdPayload {
  change: string;
}

export interface BrewingOrFavPayload {
  id?: number;
  change: string;
  q?: string;
  oneCoffeeId?: number;
}

export interface DeleteCoffeePayload {
  id: number;
  q?: number;
}

export interface LoginRegisterPayload {
  username: string;
  password: string;
}

export interface SendSharedCoffeePayload {
  recipient_id: number;
  coffees_id: number;
  coffee_name: string;
  message: string;
}

export interface AddSharedCoffeeToDashboardPayload {
  coffees_id: number;
  shared_by_id: number;
}

export interface UpdateProfilePayload {
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