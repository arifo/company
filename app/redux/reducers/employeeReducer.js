import {
  GET_EMPLOYEES,
  ADD_EMPLOYEE,
  DELETE_EMPLOYEE,
  LOGOUT,
  GET_ALL_EMPLOYEES
} from '../actions/types';

const initialState = {
  employees: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_EMPLOYEES: {
      return { ...state, employees: action.payload };
    }
    case GET_EMPLOYEES: {
      return { ...state, employees: { ...state.employees, [action.id]: action.payload } };
    }
    case ADD_EMPLOYEE: {
      return { ...state, employees: { ...state.employees, [action.id]: action.payload } };
    }
    case DELETE_EMPLOYEE: {
      const updatedEmployees = removeEmployee(state.employees, action.id);
      return { ...state, employees: updatedEmployees };
    }
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

const removeEmployee = (obj, id) =>
  Object.keys(obj).reduce((acc, key) => {
    if (key !== id) {
      return { ...acc, [key]: obj[key] };
    }
    return acc;
  }, {});
