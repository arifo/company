import firebase from 'firebase';
import { NavigationActions, StackActions } from 'react-navigation';
import PushNotification from 'react-native-push-notification';

import { db } from '../../App';

import { ADD_MEMO, ADD_COMPANY, ALREADY_LOGGED_IN } from './types';

export const addMemo = (memo, uuid, navigation) => dispatch => {
  const batch = db.batch();

  const addMemoRef = db.collection('memos').doc(uuid);
  batch.set(addMemoRef, memo);

  const updateCompanyMemosRef = db.collection('companies').doc(memo.companyID);
  batch.set(updateCompanyMemosRef, { memos: { [`${uuid}`]: true } }, { merge: true });

  batch.commit();
  dispatch({ type: ADD_MEMO, payload: memo, id: uuid });
  navigation.replace('ViewMemo', {
    title: memo.title,
    memoID: memo.id,
    companyID: memo.companyID
  });
};

export const deleteMemo = (memo, navigation) => dispatch => {
  const { id, companyID } = memo;

  const batch = db.batch();
  const memoToDeleteRef = db.collection('memos').doc(id);
  batch.delete(memoToDeleteRef);

  const deleteCompanyMemoRef = db.collection('companies').doc(companyID);
  batch.update(deleteCompanyMemoRef, `memos.${id}`, firebase.firestore.FieldValue.delete());
  batch.commit();
  navigation.goBack();
};

export const editMemo = (values, memoID, reminders, timestamp, navigation) => dispatch => {
  const docRef = db.collection('memos').doc(memoID);
  const popAction = StackActions.pop({ n: 1 });

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
  navigation.dispatch(popAction);
};

export const getNotificationMemo = (companyID, memoID, notif, navigation) => dispatch => {
  const companyDocRef = db.collection('companies').doc(companyID);
  const memoDocRef = db.collection('memos').doc(memoID);
  // dispatch({ type: ALREADY_LOGGED_IN, loggedIn: true });
  memoDocRef
    .get()
    .then(doc => {
      if (doc.exists) {
        dispatch({ type: ADD_MEMO, payload: doc.data(), id: doc.id });
      } else {
        console.log('No such document!');
      }
    })
    .then(() => {
      companyDocRef
        .get()
        .then(doc => {
          if (doc.exists) {
            dispatch({ type: ADD_COMPANY, payload: doc.data(), id: doc.id });
          } else {
            console.log('No such document!');
          }
        })
        .then(() => {
          resetStack(notif, navigation);
          cancelNotif(notif.id);
        });
    })
    .catch(error => {
      console.log('Error getting current Memo document:', error);
    });
};

const cancelNotif = id => {
  PushNotification.cancelLocalNotifications({ id });
};

const resetStack = (notif, navigation) => {
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
            title: notif.title,
            companyID: notif.group
          }
        }),
        NavigationActions.navigate({
          routeName: 'ViewMemo',
          params: {
            title: notif.message,
            memoID: notif.tag,
            companyID: notif.group
          }
        })
      ]
    })
  );
};
