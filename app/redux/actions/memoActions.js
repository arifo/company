import firebase from 'firebase';

import { ADD_MEMO, DELETE_MEMO, EDIT_MEMO } from './types';

//const db = firebase.firestore();

export const addMemo = (memo, companyId) => dispatch => {
  // console.log('add action paload', memo, 'current company ID', companyId);
  dispatch({ type: ADD_MEMO, payload: memo, companyId });
};
export const deleteMemo = company => ({
  type: DELETE_MEMO,
  payload: company
});
export const editMemo = company => ({
  type: EDIT_MEMO,
  payload: company
});
