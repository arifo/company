import firebase from 'firebase';

import { ADD_COMPANY, EDIT_COMPANY, DELETE_COMPANY, SORT_A_TO_Z } from './types';

//const db = firebase.firestore();

export const addCompany = company => dispatch => {
  dispatch(sortList(company, true));
  //dispatch({ type: ADD_COMPANY, payload: company });
};
export const deleteCompany = company => ({
  type: DELETE_COMPANY,
  payload: company
});
export const editCompany = company => ({
  type: EDIT_COMPANY,
  payload: company
});

export const sortList = (companies, state) => {
  const sortedArray = JSON.parse(JSON.stringify(companies)).sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (state) {
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    } else if (!state) {
      if (nameA > nameB) {
        return -1;
      }
      if (nameA < nameB) {
        return 1;
      }
      return 0;
    }
  });
  return {
    type: SORT_A_TO_Z,
    payload: sortedArray
  };
};
