import { LOGIN, LOGOUT, SIGNUP, LISTENERS_UNSUBED, JUST_LOGGED_OUT } from '../actions/types';

const initialState = {
  loggedIn: false,
  user: {
    uid: '',
    companies: []
  },
  listenersUnsubed: false,
  isRelogging: true
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
    case LISTENERS_UNSUBED: {
      return { ...state, listenersUnsubed: action.payload };
    }
    case JUST_LOGGED_OUT: {
      return { ...state, isRelogging: action.payload };
    }
    default:
      return state;
  }
};
