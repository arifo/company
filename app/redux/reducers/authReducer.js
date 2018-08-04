import { LOGIN, LOGOUT, SIGNUP, LISTENERS_UNSUBED, ALREADY_LOGGED_IN } from '../actions/types';

const initialState = {
  loggedIn: false,
  user: {
    uid: '',
    companies: []
  },
  listenersUnsubed: false
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
    case ALREADY_LOGGED_IN: {
      return { ...state, loggedIn: action.loggedIn };
    }
    default:
      return state;
  }
};
