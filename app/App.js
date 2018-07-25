import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import RootNavigator from './navigation/RootNavigator';
import reducers from './redux/reducers';

const middleWare = [thunk];

const store = createStore(reducers, applyMiddleware(...middleWare));

const App = () => (
  <Provider store={store}>
    <RootNavigator />
  </Provider>
);

export default App;
