import firebase from 'firebase';

import { SORT_MEMOS } from './types';

//const db = firebase.firestore();

export const addMemo = company => dispatch => {
  dispatch(sortList(company, true));
  //dispatch({ type: ADD_COMPANY, payload: company });
};
export const deleteMemo = company => ({
  type: DELETE_COMPANY,
  payload: company
});
export const editMemo = company => ({
  type: EDIT_COMPANY,
  payload: company
});

export const sortMemoList = (company, state) => {
  company.memos.sort(
    (a, b) =>
      state
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
  );
  console.log('company', company);
  return {
    type: SORT_MEMOS,
    payload: company
  };
};
