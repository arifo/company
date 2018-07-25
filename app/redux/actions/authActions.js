import { LOGIN, LOGOUT, SIGNUP } from './types';

export const loginAction = () => ({
  type: LOGIN,
  loggedIn: true
});
export const logoutAction = () => ({
  type: LOGOUT,
  loggedIn: false
});
