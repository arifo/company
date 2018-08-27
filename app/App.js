import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import firebase from 'react-native-firebase';

import RootNavigator from './navigation/RootNavigator';
import reducers from './redux/reducers';
import firebaseConfig from './config/firebaseConfig';

const androidConfig = {
  clientId: '507097460163-qj71pgs2j1v21d3ajisr3p51ponjcqab.apps.googleusercontent.com',
  appId: '1:507097460163:android:fb6b97098b540906',
  apiKey: 'AIzaSyDuyOrZ1a_JHjfJSSJ5wXN1sPPWiVFdjRY',
  databaseURL: 'https://company-720b2.firebaseio.com',
  storageBucket: 'company-720b2.appspot.com',
  messagingSenderId: '507097460163',
  projectId: 'company-720b2',

  // enable persistence by adding the below flag
  persistence: true
};
const iosConfig = {
  clientId: 'x',
  appId: 'x',
  apiKey: 'x',
  databaseURL: 'x',
  storageBucket: 'x',
  messagingSenderId: 'x',
  projectId: 'x',

  // enable persistence by adding the below flag
  persistence: true
};
firebase.initializeApp(androidConfig);
const settings = { timestampsInSnapshots: true, enablePersistence: true };
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
