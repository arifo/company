import firebase from 'firebase';
import { db } from '../../App';

import { GET_CURRENT_MEMO, TOGGLE_MEMO_FETCHING } from './types';

export const getCurrentMemo = memoID => (dispatch, getState) => {
  if (getState().memo.isFetching) {
    const docRef = db.collection('memos').doc(memoID);
    docRef
      .get()
      .then(doc => {
        if (doc.exists) {
          dispatch({ type: GET_CURRENT_MEMO, memo: doc.data(), isFetching: false });
        } else {
          console.log('No such document!');
        }
      })
      .catch(error => {
        console.log('Error getting current Memo document:', error);
      });
  }
};

export const addMemo = (memo, uuid) => dispatch => {
  const batch = db.batch();

  const addMemoRef = db.collection('memos').doc(uuid);
  batch.set(addMemoRef, memo);

  const updateCompanyMemosRef = db.collection('companies').doc(memo.companyID);
  batch.set(updateCompanyMemosRef, { memos: { [`${uuid}`]: true } }, { merge: true });

  batch.commit();
};

export const deleteMemo = memo => dispatch => {
  const { id, companyID } = memo;
  const batch = db.batch();
  const memoToDeleteRef = db.collection('memos').doc(id);
  batch.delete(memoToDeleteRef);
  const deleteCompanyMemoRef = db.collection('companies').doc(companyID);
  batch.update(deleteCompanyMemoRef, `memos.${id}`, firebase.firestore.FieldValue.delete());
  batch.commit();
};

export const editMemo = (values, memoID, reminders, timestamp) => dispatch => {
  const docRef = db.collection('memos').doc(memoID);

  docRef.set(
    {
      title: values.title,
      note: values.note,
      reminders,
      contact: values.contact,
      lastModified: timestamp
    },
    { merge: true }
  );
};

export const toggleMemoFetching = fetching => ({
  type: TOGGLE_MEMO_FETCHING,
  payload: fetching
});
