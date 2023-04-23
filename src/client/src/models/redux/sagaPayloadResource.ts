export interface BrewCoffeeIdPayload {
  brewId: number
  coffeeId: number
}

export interface FavBrewPayload extends BrewCoffeeIdPayload {
  change: string
}

export interface BrewingOrFavPayload {
  id?: number
  change: string
  q?: string
  oneCoffeeId?: number
}

export interface DeleteCoffeePayload {
  id: number
  q?: string
}

export interface LoginRegisterPayload {
  username: string
  password: string
}

export interface SendSharedCoffeePayload {
  recipientId: number
  coffeesId: number
  coffeeName: string
  message: string
}

export interface AddSharedCoffeeToDashboardPayload {
  coffeesId: number
  sharedById: number
}

export interface UpdateProfilePayload {
  profilePic: string
  methodsDefaultId: number
  kettle: string
  grinder: string
  tdsMin: number
  tdsMax: number
  extMin: number
  extMax: number
  name: string
  methodsDefaultLrr: number
}

export type SagaDispatchPayloadTypes =
  | BrewCoffeeIdPayload
  | FavBrewPayload
  | BrewingOrFavPayload
  | DeleteCoffeePayload
  | LoginRegisterPayload
  | SendSharedCoffeePayload
  | AddSharedCoffeeToDashboardPayload
  | UpdateProfilePayload
