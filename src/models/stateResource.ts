export interface AddCoffeeState {
  roaster: string;
  roast_date: string;
  is_blend: boolean;
  brewing: boolean;
  blend_name: string;
  country: string;
  producer: string;
  region: string;
  elevation: string;
  cultivars: string;
  processing: string;
  notes: string;
  coffee_pic: string;
  flavors_array: number[];
}

export interface BrewState {
  coffees_id: number;
  methods_id: number;
  water_dose: number;
  coffee_dose: number;
  grind: number;
  moisture: number;
  co2: number;
  tds: number;
  ext: number;
  water_temp: number;
  time: number;
  lrr: number;
}

export interface BrewChartState {
  x: number;
  y: number;
  i: number;
}

export type SortState = 'date' | 'roaster' | 'country' | 'producer';

export type FilterKeys = 'is_fav' | 'brewing' | 'is_blend' | 'shared_by_id';

export interface FilterMenu {
  key: FilterKeys;
  string: string;
}

export interface UpdateProfileState {
  name: string;
  methods_default_id: number | null;
  methods_default_lrr: number | null;
  kettle: string;
  grinder: string;
}

export interface TabPanelState {
  children: JSX.Element;
  tab: number;
  index: number;
}
