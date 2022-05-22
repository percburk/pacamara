import {CallEffect, PutEffect} from '@redux-saga/core/effects'
import {AxiosResponse} from 'axios'
import {ReduxDispatch, ReduxDispatchNoPayload} from './reduxResource'

export interface SagaDispatchNoPayload {
  type: SagaActions
}
export interface SagaDispatch<T> extends SagaDispatchNoPayload {
  payload: T
}

export type SagaGeneratorReturn<T, U = void> = Generator<
  | PutEffect<
      | ReduxDispatch<T | U>
      | ReduxDispatchNoPayload
      | SagaDispatch<T>
      | SagaDispatchNoPayload
    >
  | CallEffect<unknown>,
  void,
  AxiosResponse<T>
>

export enum SagaActions {
  // Data for dashboard
  FETCH_DASHBOARD = 'FETCH_DASHBOARD',
  // Brews
  FETCH_BREWS = 'FETCH_BREWS',
  DELETE_BREW = 'DELETE_BREW',
  LIKE_BREW = 'LIKE_BREW',
  ADD_BREW = 'ADD_BREW',
  EDIT_BREW = 'EDIT_BREW',
  // Coffees
  FETCH_COFFEES = 'FETCH_COFFEES',
  // One coffee
  FETCH_ONE_COFFEE = 'FETCH_ONE_COFFEE',
  SET_BREWING_OR_FAV = 'SET_BREWING_OR_FAV',
  DELETE_COFFEE = 'DELETE_COFFEE',
  ADD_COFFEE = 'ADD_COFFEE',
  EDIT_COFFEE = 'EDIT_COFFEE',
  // Coffee search
  FETCH_COFFEE_SEARCH_LIST = 'FETCH_COFFEE_SEARCH_LIST',
  // Flavors
  FETCH_FLAVORS = 'FETCH_FLAVORS',
  // Login/Logout/Register
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
  // Methods
  FETCH_METHODS = 'FETCH_METHODS',
  // Share coffees
  FETCH_SHARING_USER_LIST = 'FETCH_SHARING_USER_LIST',
  SEND_SHARED_COFFEE = 'SEND_SHARED_COFFEE',
  FETCH_SHARED_COFFEES = 'FETCH_SHARED_COFFEES',
  FETCH_ONE_SHARED_COFFEE = 'FETCH_ONE_SHARED_COFFEE',
  DELETE_SHARED_COFFEE = 'DELETE_SHARED_COFFEE',
  ADD_SHARED_COFFEE_TO_DASHBOARD = 'ADD_SHARED_COFFEE_TO_DASHBOARD',
  // User
  UPDATE_PROFILE = 'UPDATE_PROFILE',
  FETCH_USER = 'FETCH_USER',
}
