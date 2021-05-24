import userReducer from './user.reducer';

describe('testing userReducer', () => {
  // SET_USER
  test('action SET_USER', () => {
    const state = [];
    const action = {
      type: 'SET_USER',
      payload: { username: 'percburk', password: '12345' },
    };
    expect(userReducer(state, action)).toEqual({
      username: 'percburk',
      password: '12345',
    });
  });

  // UNSET_USER
  test('action UNSET_USER', () => {
    const state = { username: 'percburk' };
    const action = { type: 'UNSET_USER' };
    expect(userReducer(state, action)).toEqual([]);
  });

  // OTHER
  test('action OTHER', () => {
    const state = { username: 'percburk' };
    const action = { type: 'SNACKBARS' };
    expect(userReducer(state, action)).toEqual({
      username: 'percburk',
    });
  });
});
