import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import App from './App';
import app from './Reducer/app';
import registerServiceWorker from './registerServiceWorker';
import initState from './initState';
import { composeWithDevTools } from 'redux-devtools-extension';


const store = createStore(
  app,
  initState,
  composeWithDevTools(applyMiddleware(logger)),
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
