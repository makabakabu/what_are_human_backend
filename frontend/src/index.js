import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import { throttle } from 'lodash';
import { loadStorage, saveStorage } from './localStorage';
import App from './App';
import app from './Reducer/app';
import registerServiceWorker from './registerServiceWorker';
import initState from './initState';

const storage = loadStorage({ initState });

const store = createStore(
  app,
  storage,
  composeWithDevTools(applyMiddleware(logger)),
);

store.subscribe(throttle(() => saveStorage({ state: store.getState() }), 3000));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
