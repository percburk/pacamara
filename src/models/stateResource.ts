import { DateTime } from 'luxon';

export interface AddCoffeeState {
  roaster: string;
  roastDate: string | DateTime;
  isBlend: boolean;
  brewing: boolean;
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

export interface BrewState {
  coffeesId: number;
  methodsId: number;
  waterDose: number;
  coffeeDose: number;
  grind: number;
  moisture: number;
  co2: number;
  tds: number;
  ext: number;
  waterTemp: number;
  time: string;
  lrr: number;
}

export interface BrewChartState {
  x: number;
  y: number;
  i: number;
}

export type SortState = 'date' | 'roaster' | 'country' | 'producer';

export type FilterKeys = 'isFav' | 'brewing' | 'isBlend' | 'sharedById';

export interface FilterMenuOptions {
  filterKey: FilterKeys;
  display: string;
}

export interface UpdateProfileState {
  name: string;
  profilePic: string;
  methodsDefaultId: number | null;
  methodsDefaultLrr: number | null;
  kettle: string;
  grinder: string;
  methodsArray: number[];
  tdsRange: number[];
  extRange: number[];
}
