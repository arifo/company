import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { PersistGate } from 'redux-persist/lib/integration/react';
import thunk from 'redux-thunk';
import firebase from 'firebase';
import 'firebase/firestore';
import { ActivityIndicator, PlatformIOS } from 'react-native';

import RootNavigator from './navigation/RootNavigator';
import reducers from './redux/reducers';
import firebaseConfig from './config/firebaseConfig';
import Container from './components/Container';

firebase.initializeApp(firebaseConfig);
const settings = { timestampsInSnapshots: true };
firebase.firestore().settings(settings);
export const db = firebase.firestore();

const middleWare = [thunk];

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2 // see "Merge Process" section for details.
};

const pReducer = persistReducer(persistConfig, reducers);
const store = createStore(pReducer, applyMiddleware(...middleWare));
const persistor = persistStore(store);
// persistor.purge();

const LoadingView = () => (
  <Container style={{ alignItems: 'center', justifyContent: 'center' }}>
    <ActivityIndicator size={PlatformIOS ? 'large' : 50} />
  </Container>
);

const App = () => (
  <Provider store={store}>
    <PersistGate loading={<LoadingView />} persistor={persistor}>
      <RootNavigator />
    </PersistGate>
  </Provider>
);

export default App;
