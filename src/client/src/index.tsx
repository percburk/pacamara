import axios from 'axios'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, Store } from 'redux'
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
// Imports all reducers, stored in _root.reducer
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
// Imports all sagas, stored in _root.saga
import rootSaga from './redux/sagas/_rootSaga'

// Imports our App to be rendered by React
axios.defaults.baseURL = import.meta.env.VITE_SERVER_BASE_URL

const sagaMiddleware = createSagaMiddleware()

// This line creates an array of all of redux middleware you want to use
// We don't want a ton of console logs in our production code
// Logger will only be added to your project if you're in development mode
const middlewareList =
  process.env.NODE_ENV === 'development' ? [sagaMiddleware, logger] : [sagaMiddleware]

export const store: Store<
  InitialState,
  | ReduxDispatch<ReduxDispatchPayloadTypes>
  | ReduxDispatchNoPayload
  | SagaDispatch<SagaDispatchPayloadTypes>
  | SagaDispatchNoPayload
> = createStore(
  // Tells the saga middleware to use the rootReducer
  // rootReducer contains all of our other reducers
  rootReducer,
  // Adds all middleware to our project including saga and logger
  applyMiddleware(...middlewareList)
)

// Tells the saga middleware to use the rootSaga
// rootSaga contains all of our other sagas
sagaMiddleware.run(rootSaga)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
