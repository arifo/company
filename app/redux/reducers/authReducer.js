import { LOGIN, LOGOUT, SIGNUP } from '../actions/types';

const initialState = {
  loggedIn: false,
  user: {
    uid: '',
    companies: []
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN: {
      return { ...state, loggedIn: action.loggedIn, user: action.user };
    }
    case LOGOUT: {
      return { ...state, loggedIn: action.loggedIn };
    }
    case SIGNUP: {
      return { ...state, loggedIn: action.loggedIn, user: { ...state.user, uid: action.uid } };
    }
    default:
      return state;
  }
};
