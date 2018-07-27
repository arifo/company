import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import firebase from 'firebase';

import RootNavigator from './navigation/RootNavigator';
import reducers from './redux/reducers';
import firebaseConfig from './config/firebaseConfig';

firebase.initializeApp(firebaseConfig);

const middleWare = [thunk];

const store = createStore(reducers, applyMiddleware(...middleWare));

const App = () => (
  <Provider store={store}>
    <RootNavigator />
  </Provider>
);

export default App;
