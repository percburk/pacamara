import { describe, test, expect } from 'vitest'
import userReducer from './userReducer'

describe('testing userReducer', () => {
  // SET_USER
  test('action SET_USER', () => {
    const state = []
    const action = {
      type: 'SET_USER',
      payload: { username: 'percburk', password: '12345' },
    }
    expect(userReducer(state, action)).toEqual({
      username: 'percburk',
      password: '12345',
    })
  })

  // UNSET_USER
  test('action UNSET_USER', () => {
    const state = { username: 'percburk' }
    const action = { type: 'UNSET_USER' }
    expect(userReducer(state, action)).toEqual({
      id: 0,
      username: '',
      profilePic: '',
      methodsDefaultId: 0,
      kettle: '',
      grinder: '',
      tdsMin: 0,
      tdsMax: 0,
      extMin: 0,
      extMax: 0,
      name: '',
      methodsDefaultLrr: 0,
      methodsArray: [],
    })
  })

  // OTHER
  test('action OTHER', () => {
    const state = { username: 'percburk' }
    const action = { type: 'SNACKBARS_CREATED_PROFILE' }
    expect(userReducer(state, action)).toEqual({
      username: 'percburk',
    })
  })
})
