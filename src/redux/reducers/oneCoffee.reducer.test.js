import oneCoffeeReducer from './oneCoffee.reducer';

describe('testing oneCoffeeReducer', () => {
  // EDIT_INPUTS
  test('action EDIT_INPUTS', () => {
    const state = { country: 'Colombia' };
    const action = {
      type: 'EDIT_INPUTS',
      payload: { key: 'producer', change: 'Luis Reinoso' },
    };
    expect(oneCoffeeReducer(state, action)).toEqual({
      country: 'Colombia',
      producer: 'Luis Reinoso',
    });
  });

  // EDIT_SWITCH
  test('action EDIT_SWITCH', () => {
    const state = { is_blend: true, brewing: false };
    const action = {
      type: 'EDIT_SWITCH',
      payload: 'is_blend',
    };
    expect(oneCoffeeReducer(state, action)).toEqual({
      is_blend: false,
      brewing: false,
    });
  });

  // EDIT_FLAVORS_ARRAY
  test('action EDIT_FLAVORS_ARRAY', () => {
    const state = { flavors_array: [1, 3, 4, 6] };
    const action = { type: 'EDIT_FLAVORS_ARRAY', payload: 6 };
    expect(oneCoffeeReducer(state, action)).toEqual({
      flavors_array: [1, 3, 4],
    });
  });

  // EDIT_FLAVORS_ARRAY
  test('action opposite EDIT_FLAVORS_ARRAY', () => {
    const state = { flavors_array: [1, 3, 4, 6] };
    const action = { type: 'EDIT_FLAVORS_ARRAY', payload: 8 };
    expect(oneCoffeeReducer(state, action)).toEqual({
      flavors_array: [1, 3, 4, 6, 8],
    });
  });
});
