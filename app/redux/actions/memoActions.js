import firebase from 'firebase';
import { db } from '../../App';

import { GET_MEMOS, GET_CURRENT_MEMO, TOGGLE_MEMO_FETCHING } from './types';

export const getMemos = id => (dispatch, getState) => {
  if (!getState().auth.loggedIn) {
    unsubscribe();
  }
  const unsubscribe = db
    .collection('memos')
    .where('companyID', '==', id)
    .onSnapshot(querySnapshot => {
      const arr = [];
      querySnapshot.forEach(doc => {
        arr.push(doc.data());
      });
      console.log('listener is fetching MEMO document!', arr);
      dispatch({ type: GET_MEMOS, payload: arr });
    });
};

export const getCurrentMemo = memoID => (dispatch, getState) => {
  console.log('before if in action....getstate', getState().memo.isFetching);
  if (getState().memo.isFetching) {
    console.log('if in action....getstate', getState().memo.isFetching);
    const docRef = db.collection('memos').doc(memoID);
    docRef
      .get()
      .then(doc => {
        if (doc.exists) {
          console.log('Fetched document!', doc.data());
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

export const editMemo = (values, memoID, timestamp) => dispatch => {
  const docRef = db.collection('memos').doc(memoID);

  docRef.set(
    {
      title: values.title,
      note: values.note,
      reminders: values.reminders,
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
