import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, Store } from 'redux'
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import App from './components/App/App'
import { ReduxDispatchPayloadTypes } from './models/redux/reduxPayloadResource'
import {
  InitialState,
  ReduxDispatch,
  ReduxDispatchNoPayload,
} from './models/redux/reduxResource'
import { SagaDispatchPayloadTypes } from './models/redux/sagaPayloadResource'
import { SagaDispatch, SagaDispatchNoPayload } from './models/redux/sagaResource'
import rootReducer from './redux/reducers/_rootReducer'
import rootSaga from './redux/sagas/_rootSaga'

const sagaMiddleware = createSagaMiddleware()

const middlewareList =
  process.env.NODE_ENV === 'development' ? [sagaMiddleware, logger] : [sagaMiddleware]

export const store: Store<
  InitialState,
  | ReduxDispatch<ReduxDispatchPayloadTypes>
  | ReduxDispatchNoPayload
  | SagaDispatch<SagaDispatchPayloadTypes>
  | SagaDispatchNoPayload
> = createStore(rootReducer, applyMiddleware(...middlewareList))

sagaMiddleware.run(rootSaga)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
