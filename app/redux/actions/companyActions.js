import firebase from 'firebase';
import { db } from '../../App';

import {
  GET_COMPANIES,
  ADD_COMPANY,
  DELETE_COMPANY,
  GET_EMPLOYEES,
  DELETE_EMPLOYEE,
  GET_MEMOS,
  TOGGLE_LISTENER_FETCHING,
  LISTENERS_UNSUBED,
  DELETE_MEMO,
  GET_ALL_COMPANIES,
  GET_ALL_EMPLOYEES,
  GET_ALL_MEMOS
} from './types';

const listeners = {
  company: {},
  employee: {},
  memo: {}
};

export const getCompanies = () => dispatch => {
  listeners.company = db
    .collection('companies')
    .where('user', '==', firebase.auth().currentUser.uid)
    .onSnapshot({ includeMetadataChanges: true }, querySnapshot => {
      const obj = {};
      querySnapshot.docChanges().forEach(changed => {
        if (changed.type === 'added') {
          querySnapshot.forEach(doc => {
            Object.assign(obj, { [doc.id]: doc.data() });
          });
          dispatch({ type: GET_ALL_COMPANIES, payload: obj });
        }
        if (changed.type === 'modified') {
          dispatch({ type: GET_COMPANIES, id: changed.doc.id, payload: changed.doc.data() });
        }
        if (changed.type === 'removed') {
          dispatch({ type: DELETE_COMPANY, id: changed.doc.id });
        }
      });
      dispatch({ type: TOGGLE_LISTENER_FETCHING, payload: false });
    });
};

export const getMemos = () => dispatch => {
  listeners.memo = db
    .collection('memos')
    .where('user', '==', firebase.auth().currentUser.uid)
    .onSnapshot(querySnapshot => {
      const obj = {};
      querySnapshot.docChanges().forEach(changed => {
        if (changed.type === 'added') {
          querySnapshot.forEach(doc => {
            Object.assign(obj, { [doc.id]: doc.data() });
          });
          dispatch({ type: GET_ALL_MEMOS, payload: obj });
        }
        if (changed.type === 'modified') {
          dispatch({ type: GET_MEMOS, id: changed.doc.id, payload: changed.doc.data() });
        }
        if (changed.type === 'removed') {
          dispatch({ type: DELETE_MEMO, id: changed.doc.id });
        }
      });
      dispatch({ type: TOGGLE_LISTENER_FETCHING, payload: false });
    });
};

export const getEmployees = () => dispatch => {
  listeners.employee = db
    .collection('employees')
    .where('user', '==', firebase.auth().currentUser.uid)
    .onSnapshot(querySnapshot => {
      const obj = {};
      querySnapshot.docChanges().forEach(changed => {
        if (changed.type === 'added') {
          querySnapshot.forEach(doc => {
            Object.assign(obj, { [doc.id]: doc.data() });
          });
          dispatch({ type: GET_ALL_EMPLOYEES, payload: obj });
        }
        if (changed.type === 'modified') {
          dispatch({ type: GET_EMPLOYEES, id: changed.doc.id, payload: changed.doc.data() });
        }
        if (changed.type === 'removed') {
          dispatch({ type: DELETE_EMPLOYEE, id: changed.doc.id });
        }
      });
      dispatch({ type: TOGGLE_LISTENER_FETCHING, payload: false });
    });
};

export const unsubscribe = listenerName => {
  listeners[listenerName]();
  return {
    type: LISTENERS_UNSUBED
  };
};

export const addCompany = (companyInfo, uuid) => dispatch => {
  const batch = db.batch();

  const addCompanyRef = db.collection('companies').doc(uuid);
  batch.set(addCompanyRef, companyInfo);

  const updateUserCompaniesRef = db.collection('users').doc(companyInfo.user);

  batch.set(updateUserCompaniesRef, { companies: { [`${uuid}`]: true } }, { merge: true });

  batch.commit();
  dispatch({ type: ADD_COMPANY, payload: companyInfo, id: uuid });
};

export const deleteCompany = (id, user) => dispatch => {
  db.collection('employees')
    .where('companyID', '==', id)
    .get()
    .then(querySnapshot => {
      const batch = db.batch();

      querySnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      return batch.commit();
    })
    .then(() => {
      console.log('all related employees deletes');
    });
  db.collection('memos')
    .where('companyID', '==', id)
    .get()
    .then(querySnapshot => {
      const batch = db.batch();

      querySnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      return batch.commit();
    })
    .then(() => {
      console.log('all related memos deletes');
    });

  const batch = db.batch();
  const companyToDeleteRef = db.collection('companies').doc(id);
  batch.delete(companyToDeleteRef);

  const deleteUserCompanyRef = db.collection('users').doc(user);
  batch.update(deleteUserCompanyRef, `companies.${id}`, firebase.firestore.FieldValue.delete());

  batch.commit();
};

export const editCompany = (values, companyID, timestamp) => dispatch => {
  db.collection('companies')
    .doc(companyID)
    .set(
      {
        name: values.name,
        description: values.description,
        lastModified: timestamp
      },
      { merge: true }
    )
    .then(() => {});
};

export const toggleListenerFetching = fetching => ({
  type: TOGGLE_LISTENER_FETCHING,
  payload: fetching
});
