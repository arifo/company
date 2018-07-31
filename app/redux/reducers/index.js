import { combineReducers } from 'redux';
import authReducer from './authReducer';
import companyReducer from './companyReducer';
import employeeReducer from './employeeReducer';
import memoReducer from './memoReducer';

export default combineReducers({
  auth: authReducer,
  company: companyReducer,
  employee: employeeReducer,
  memo: memoReducer
});
