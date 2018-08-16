import {
  GET_COMPANIES,
  ADD_COMPANY,
  DELETE_COMPANY,
  TOGGLE_LISTENER_FETCHING,
  LOGOUT,
  GET_ALL_COMPANIES
} from '../actions/types';

const initialState = {
  companies: {},
  listerFetching: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_COMPANIES: {
      return { ...state, companies: action.payload };
    }
    case GET_COMPANIES: {
      return { ...state, companies: { ...state.companies, [action.id]: action.payload } };
    }
    case DELETE_COMPANY: {
      const updatedCompanies = removeCompany(state.companies, action.id);
      return { ...state, companies: updatedCompanies };
    }
    case ADD_COMPANY: {
      return { ...state, companies: { ...state.companies, [action.id]: action.payload } };
    }
    case TOGGLE_LISTENER_FETCHING: {
      return {
        ...state,
        listerFetching: action.payload
      };
    }
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

const removeCompany = (obj, id) =>
  Object.keys(obj).reduce((acc, key) => {
    if (key !== id) {
      return { ...acc, [key]: obj[key] };
    }
    return acc;
  }, {});
