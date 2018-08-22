import firebase from 'firebase';
import moment from 'moment';
import { NavigationActions, StackActions } from 'react-navigation';

import { db } from '../../App';

import { ADD_MEMO, EDIT_MEMO, DELETE_MEMO } from './types';

const popAction = StackActions.pop({ n: 1 });
const isReminderDue = reminder => moment() < moment(reminder);

export const addMemo = (memo, uuid, navigation) => dispatch => {
  const batch = db.batch();

  const addMemoRef = db.collection('memos').doc(uuid);
  batch.set(addMemoRef, memo);

  const updateCompanyMemosRef = db.collection('companies').doc(memo.companyID);
  batch.set(
    updateCompanyMemosRef,
    { memos: { [`${uuid}`]: true }, cacheTimestamp: memo.createdAt },
    { merge: true }
  );

  batch.commit();
  dispatch({ type: ADD_MEMO, payload: memo, id: uuid });
  navigation.dispatch(popAction);
};

export const deleteMemo = (memo, navigation) => dispatch => {
  const { id, companyID } = memo;

  const batch = db.batch();
  const memoToDeleteRef = db.collection('memos').doc(id);
  batch.delete(memoToDeleteRef);

  const deleteCompanyMemoRef = db.collection('companies').doc(companyID);
  batch.update(deleteCompanyMemoRef, `memos.${id}`, firebase.firestore.FieldValue.delete());
  batch.commit();
  dispatch({ type: DELETE_MEMO, id });
  navigation.goBack();
};

export const editMemo = (values, memo, reminders, timestamp, navigation) => dispatch => {
  const docRef = db.collection('memos').doc(memo.id);
  const data = {
    ...memo,
    title: values.title,
    note: values.note,
    reminders,

    contact: values.contact,
    lastModified: timestamp
  };
  docRef.set(data, { merge: true });

  db.collection('companies')
    .doc(navigation.state.params.companyID)
    .set({ cacheTimestamp: timestamp }, { merge: true });

  dispatch({ type: EDIT_MEMO, id: memo.id, payload: data });

  navigation.dispatch(popAction);
};

export const handleDueReminders = oldMemo => dispatch => {
  const memo = Object.assign({}, oldMemo);
  const oldRemindersCount = (memo.oldReminders || []).length;

  memo.oldReminders = memo.reminders
    .concat(memo.oldReminders || [])
    .filter(q => !isReminderDue(q))
    .sort((a, b) => new Date(b) - new Date(a));
  memo.reminders = memo.reminders.filter(q => isReminderDue(q));

  memo.lastModified =
    oldRemindersCount !== memo.oldReminders.length ? new Date() : memo.lastModified;

  const docRef = db.collection('memos').doc(memo.id);
  const data = { ...memo };
  docRef.set(data, { merge: true });

  db.collection('companies')
    .doc(memo.companyID)
    .set({ cacheTimestamp: memo.lastModified }, { merge: true });

  dispatch({ type: EDIT_MEMO, id: memo.id, payload: data });
};

export const getNotificationMemo = (memo, company, notif, navigation) => dispatch => {
  resetStack(company, memo, navigation, notif);
};

const resetStack = (company, memo, navigation, notif) => {
  navigation.dispatch(
    StackActions.reset({
      index: 2,
      actions: [
        NavigationActions.navigate({
          routeName: 'Companies'
        }),
        NavigationActions.navigate({
          routeName: 'ViewCompany',
          params: {
            title: company.name,
            companyID: company.id
          }
        }),
        NavigationActions.navigate({
          routeName: 'ViewMemo',
          params: {
            title: memo.title,
            memoID: memo.id,
            companyID: company.id,
            notifID: notif.id,
            type: 'notification'
          }
        })
      ]
    })
  );
};
