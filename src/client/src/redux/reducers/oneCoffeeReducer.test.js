import { describe, test, expect } from 'vitest'
import oneCoffeeReducer from './oneCoffeeReducer'

describe('testing oneCoffeeReducer', () => {
  // EDIT_INPUTS
  test('action EDIT_INPUTS', () => {
    const state = { country: 'Colombia' }
    const action = {
      type: 'EDIT_INPUTS',
      payload: { key: 'producer', change: 'Luis Reinoso' },
    }
    expect(oneCoffeeReducer(state, action)).toEqual({
      country: 'Colombia',
      producer: 'Luis Reinoso',
    })
  })

  // EDIT_SWITCH
  test('action EDIT_SWITCH', () => {
    const state = { isBlend: true, brewing: false }
    const action = {
      type: 'EDIT_INPUTS',
      payload: { key: 'isBlend', change: false },
    }
    expect(oneCoffeeReducer(state, action)).toEqual({
      isBlend: false,
      brewing: false,
    })
  })

  // EDIT_FLAVORS_ARRAY
  test('action EDIT_FLAVORS_ARRAY', () => {
    const state = { flavorsArray: [1, 3, 4, 6] }
    const action = { type: 'EDIT_FLAVORS_ARRAY', payload: 6 }
    expect(oneCoffeeReducer(state, action)).toEqual({
      flavorsArray: [1, 3, 4],
    })
  })

  // EDIT_FLAVORS_ARRAY
  test('action opposite EDIT_FLAVORS_ARRAY', () => {
    const state = { flavorsArray: [1, 3, 4, 6] }
    const action = { type: 'EDIT_FLAVORS_ARRAY', payload: 8 }
    expect(oneCoffeeReducer(state, action)).toEqual({
      flavorsArray: [1, 3, 4, 6, 8],
    })
  })
})
