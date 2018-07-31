import firebase from 'firebase';
import { Alert } from 'react-native';
import { db } from '../../App';

import { LOGIN, LOGOUT, SIGNUP } from './types';

export const signUpAction = (values, bag) => async dispatch => {
  const { email, password } = values;
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);

    const uid = firebase.auth().currentUser.uid;
    db.collection('users')
      .doc(uid)
      .set({ email, uid, companies: {} })
      .then(() => {
        dispatch({ type: SIGNUP, loggedIn: true, uid });
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
  }
};

export const loginAction = (values, bag) => async dispatch => {
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

export function logoutAction() {
  return dispatch => {
    firebase.auth().signOut();
    dispatch({ type: LOGOUT, loggedIn: false });
  };
}
