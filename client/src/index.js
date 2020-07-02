import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import reduxThunk from 'redux-thunk'
import logger from 'redux-logger'

import App from './App'
import reducers from './reducers';

// import 'bootstrap/dist/css/bootstrap.min.css';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewares = [reduxThunk]
const store = createStore(reducers, {}, composeEnhancers(applyMiddleware(...middlewares)))

ReactDOM.render(
   <Provider store={store}>
      <BrowserRouter>
         <App />
      </BrowserRouter>
   </Provider>
   , document.querySelector('#root'))

