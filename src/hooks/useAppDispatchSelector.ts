import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'
import {store} from '../index'
import {InitialState} from '../models/redux/reduxResource'

export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<InitialState> = useSelector
