import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import firebase from 'firebase';
import 'firebase/firestore';

import RootNavigator from './navigation/RootNavigator';
import reducers from './redux/reducers';
import firebaseConfig from './config/firebaseConfig';

firebase.initializeApp(firebaseConfig);
const settings = { timestampsInSnapshots: true };
firebase.firestore().settings(settings);
export const db = firebase.firestore();

const middleWare = [thunk];

const store = createStore(reducers, applyMiddleware(...middleWare));

const App = () => (
  <Provider store={store}>
    <RootNavigator />
  </Provider>
);

export default App;
