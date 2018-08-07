import firebase from 'firebase';
import { Alert } from 'react-native';

import { db } from '../../App';

import { LOGIN, LOGOUT, SIGNUP, ALREADY_LOGGED_IN, LISTENERS_UNSUBED } from './types';

export const signUpAction = (values, bag, navigation) => async dispatch => {
  const { email, password } = values;
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);

    const uid = firebase.auth().currentUser.uid;
    db.collection('users')
      .doc(uid)
      .set({ email, uid, companies: {} })
      .then(() => {
        dispatch({ type: SIGNUP, loggedIn: true, uid });
        navigation.navigate('App');
      })
      .catch(error => {
        console.error('Error adding document: ', error);
      });
  } catch (error) {
    dispatch(() => {
      bag.setSubmitting(false);
      if (error.code === 'auth/email-already-in-use') {
        bag.setErrors({ email: error.message });
      }
    });
    dispatch({ type: SIGNUP, loggedIn: false });
  }
};

export const loginAction = (values, bag, navigation) => dispatch => {
  console.log('login');
  const { email, password } = values;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      db.collection('users')
        .where('email', '==', email)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            dispatch({ type: LOGIN, loggedIn: true, user: doc.data() });
            navigation.navigate('App');
          });
        });
    })
    .catch(error => {
      dispatch({ type: LOGIN, loggedIn: false });
      dispatch(() => {
        bag.setSubmitting(false);
        bag.setErrors({ email: error.message });
      });
    });
};

/*
export const loginAction = (values, bag) => async dispatch => {
  console.log('login');
  const { email, password } = values;
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);

    db.collection('users')
      .where('email', '==', email)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          dispatch({ type: LOGIN, loggedIn: true, user: doc.data() });
        });
      });
  } catch (error) {
    dispatch(() => {
      bag.setSubmitting(false);
      bag.setErrors({ email: error.message });
    });
  }
};
*/

export const forgotPassAction = (values, bag, navigation) => async dispatch => {
  try {
    await firebase.auth().sendPasswordResetEmail(values.email);

    Alert.alert(
      'Reset Password',
      'Password reset instructions are sent to submitted email address',
      [{ text: 'OK', onPress: () => navigation.goBack() }],
      { cancelable: false }
    );
  } catch (error) {
    dispatch(() => {
      bag.setSubmitting(false);
      bag.setErrors({ email: error.message });
    });
  }
};

export function alreadyLoggedIn(navigation) {
  return dispatch => {
    dispatch({ type: ALREADY_LOGGED_IN, loggedIn: true });
    dispatch(() => navigation.navigate('App'));
  };
}

export function logoutAction() {
  return dispatch => {
    dispatch({ type: LOGOUT, loggedIn: false });
    firebase.auth().signOut();
    console.log('firebase signout');
  };
}

// console.log('logout action getState().auth.listenersUnsubed', getState().auth.listenersUnsubed);
//     if (getState().auth.listenersUnsubed) {
//       firebase.auth().signOut();
//       console.log(
//         'logout action getState().auth.listenersUnsubed',
//         getState().auth.listenersUnsubed
//       );
//       console.log('logout action firebase state', firebase.auth().currentUser);
//     }
