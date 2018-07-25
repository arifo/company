import { LOGIN, LOGOUT, SIGNUP } from '../actions/types';

const initialState = {
  loggedIn: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN: {
      return { ...state, loggedIn: action.loggedIn };
    }
    case LOGOUT: {
      return { ...state, loggedIn: action.loggedIn };
    }
    case SIGNUP: {
      return { ...state, loggedIn: action.loggedIn };
    }
    default:
      return state;
  }
};
