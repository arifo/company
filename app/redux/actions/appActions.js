import firebase from 'firebase';

import { ADD_COMPANY, EDIT_COMPANY, DELETE_COMPANY, SORT_A_TO_Z } from './types';

//const db = firebase.firestore();

export const addCompany = company => ({
    type: ADD_COMPANY,
    payload: company
  });
export const deleteCompany = company => ({
    type: DELETE_COMPANY,
    payload: company
  });
export const editCompany = company => ({
    type: EDIT_COMPANY,
    payload: company
  });

export const sortList = companies => ({
    type: SORT_A_TO_Z,
    payload: companies
  });
