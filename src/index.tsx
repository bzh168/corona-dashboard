import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import Immutable from 'immutable';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import reducer from './reducer';
import mySaga from './sagas';
import Dashboard from './container/Dashboard';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducer,
  Immutable.Map({
    meta: {},
    timeRange: 'week_1',
  }),
  composeWithDevTools(applyMiddleware(sagaMiddleware)),
);

sagaMiddleware.run(mySaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

render(
  <Provider store={store}>
    <Dashboard />
  </Provider>,
  document.getElementById('root'),
);
