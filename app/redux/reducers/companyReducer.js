import { GET_COMPANIES, GET_CURRENT_COMPANY, TOGGLE_COMPANY_FETCHING } from '../actions/types';

const initialState = {
  companies: [],
  currentCompany: {},
  isFetching: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_COMPANIES: {
      return { ...state, companies: action.payload, isFetching: action.isFetching };
    }
    case GET_CURRENT_COMPANY: {
      return { ...state, currentCompany: action.company, isFetching: action.isFetching };
    }
    case TOGGLE_COMPANY_FETCHING: {
      return {
        ...state,
        isFetching: action.payload
      };
    }
    default:
      return state;
  }
};
