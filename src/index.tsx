import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, Store } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';

// Imports all reducers, stored in _root.reducer
import rootReducer from './redux/reducers/_rootReducer';
// Imports InitialState interface for Store
import { InitialState, ReduxDispatch } from './models/reduxResource';
import { ReduxDispatchPayloadTypes } from './models/reduxPayloadResource';

// Imports all sagas, stored in _root.saga
import rootSaga from './redux/sagas/_rootSaga';

// Imports our App to be rendered by React
import App from './components/App/App';

const sagaMiddleware = createSagaMiddleware();

// This line creates an array of all of redux middleware you want to use
// We don't want a ton of console logs in our production code
// Logger will only be added to your project if you're in development mode
const middlewareList =
  process.env.NODE_ENV === 'development'
    ? [sagaMiddleware, logger]
    : [sagaMiddleware];

const store: Store<
  InitialState,
  ReduxDispatch<ReduxDispatchPayloadTypes>
> = createStore(
  // Tells the saga middleware to use the rootReducer
  // rootReducer contains all of our other reducers
  rootReducer,
  // Adds all middleware to our project including saga and logger
  applyMiddleware(...middlewareList)
);

// Tells the saga middleware to use the rootSaga
// rootSaga contains all of our other sagas
sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('react-root') as HTMLElement
);
