import { CallEffect, PutEffect } from '@redux-saga/core/effects';
import { AxiosResponse } from 'axios';
import { MethodsArrayAgg, User } from './modelResource';
import { ReduxDispatch, ReduxDispatchNoPayload } from './reduxResource';

export interface SagaDispatchNoPayload {
  type: SagaActions;
}
export interface SagaDispatch<T> extends SagaDispatchNoPayload {
  payload: T;
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
>;

export enum SagaActions {
  FETCH_BREWS = 'FETCH_BREWS',
  DELETE_BREW = 'DELETE_BREW',
  LIKE_BREW = 'LIKE_BREW',
  ADD_BREW = 'ADD_BREW',
  EDIT_BREW = 'EDIT_BREW',
  FETCH_COFFEES = 'FETCH_COFFEES',
  FETCH_ONE_COFFEE = 'FETCH_ONE_COFFEE',
  SET_BREWING_OR_FAV = 'SET_BREWING_OR_FAV',
  DELETE_COFFEE = 'DELETE_COFFEE',
  ADD_COFFEE = 'ADD_COFFEE',
  EDIT_COFFEE = 'EDIT_COFFEE',
  FETCH_COFFEE_SEARCH_LIST = 'FETCH_COFFEE_SEARCH_LIST',
  FETCH_FLAVORS = 'FETCH_FLAVORS',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  FETCH_METHODS = 'FETCH_METHODS',
  REGISTER = 'REGISTER',
  FETCH_SHARING_USER_LIST = 'FETCH_SHARING_USER_LIST',
  SEND_SHARED_COFFEE = 'SEND_SHARED_COFFEE',
  FETCH_SHARED_COFFEES = 'FETCH_SHARED_COFFEES',
  FETCH_ONE_SHARED_COFFEE = 'FETCH_ONE_SHARED_COFFEE',
  DELETE_SHARED_COFFEE = 'DELETE_SHARED_COFFEE',
  ADD_SHARED_COFFEE_TO_DASHBOARD = 'ADD_SHARED_COFFEE_TO_DASHBOARD',
  UPDATE_PROFILE = 'UPDATE_PROFILE',
  FETCH_USER = 'FETCH_USER',
}
