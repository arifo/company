import firebase from 'firebase';
import { Alert } from 'react-native';

import { LOGIN, LOGOUT, SIGNUP } from './types';

export const signUpAction = (values, bag) => async dispatch => {
  try {
    await firebase.auth().createUserWithEmailAndPassword(values.email, values.password);

    dispatch({
      type: SIGNUP,
      loggedIn: true
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
  try {
    await firebase.auth().signInWithEmailAndPassword(values.email, values.password);

    dispatch({ type: LOGIN, loggedIn: true });
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
