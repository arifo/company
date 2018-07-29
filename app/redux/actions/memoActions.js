import firebase from 'firebase';

import { SORT_MEMOS } from './types';

//const db = firebase.firestore();

export const addMemo = company => dispatch => {
  dispatch({ type: ADD_COMPANY, payload: company });
};
export const deleteMemo = company => ({
  type: DELETE_COMPANY,
  payload: company
});
export const editMemo = company => ({
  type: EDIT_COMPANY,
  payload: company
});
