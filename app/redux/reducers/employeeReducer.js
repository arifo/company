import { GET_EMPLOYEES, GET_CURRENT_EMPLOYEE, TOGGLE_EMPLOYE_FETCHING } from '../actions/types';

const initialState = {
  employees: [],
  currentEmployee: {},
  isFetching: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_EMPLOYEES: {
      return { ...state, employees: action.payload };
    }
    case GET_CURRENT_EMPLOYEE: {
      return { ...state, currentEmployee: action.employee, isFetching: action.isFetching };
    }
    case TOGGLE_EMPLOYE_FETCHING: {
      return {
        ...state,
        isFetching: action.payload
      };
    }
    default:
      return state;
  }
};
