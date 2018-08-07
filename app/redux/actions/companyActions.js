import firebase from 'firebase';
import { db } from '../../App';

import {
  GET_COMPANIES,
  GET_CURRENT_COMPANY,
  TOGGLE_COMPANY_FETCHING,
  TOGGLE_LISTENER_FETCHING,
  LISTENERS_UNSUBED,
  GET_MEMOS,
  GET_EMPLOYEES
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
      const arr = [];
      querySnapshot.forEach(doc => {
        arr.push(doc.data());
      });
      dispatch({ type: GET_COMPANIES, payload: arr });
      dispatch({ type: TOGGLE_LISTENER_FETCHING, payload: false });
    });
};

export const getMemos = id => dispatch => {
  listeners.memo = db
    .collection('memos')
    .where('companyID', '==', id)
    .onSnapshot(querySnapshot => {
      const arr = [];
      querySnapshot.forEach(doc => {
        arr.push(doc.data());
      });
      dispatch({ type: GET_MEMOS, payload: arr });
    });
};

export const getEmployees = id => dispatch => {
  listeners.employee = db
    .collection('employees')
    .where('companyID', '==', id)
    .onSnapshot(querySnapshot => {
      const arr = [];
      querySnapshot.forEach(doc => {
        arr.push(doc.data());
      });
      dispatch({ type: GET_EMPLOYEES, payload: arr });
    });
};

export const unsubscribe = listenerName => {
  // console.log(`unsubscribing ${listenerName} listener...`);
  listeners[listenerName]();
  return {
    type: LISTENERS_UNSUBED
  };
};

export const getCurrentCompany = companyID => (dispatch, getState) => {
  if (getState().company.isFetching) {
    const docRef = db.collection('companies').doc(companyID);

    docRef
      .get()
      .then(doc => {
        if (doc.exists) {
          // console.log('Fetched company document!', doc.data());
          dispatch({ type: GET_CURRENT_COMPANY, company: doc.data(), isFetching: false });
        } else {
          console.log('No such document!');
        }
      })
      .catch(error => {
        console.log('Error getting document:', error);
      });
  }
};

export const addCompany = (companyInfo, uuid) => dispatch => {
  const batch = db.batch();

  const addCompanyRef = db.collection('companies').doc(uuid);
  batch.set(addCompanyRef, companyInfo);

  const updateUserCompaniesRef = db.collection('users').doc(companyInfo.user);

  batch.set(updateUserCompaniesRef, { companies: { [`${uuid}`]: true } }, { merge: true });

  batch.commit();
};

export const deleteCompany = company => dispatch => {
  const { id, user } = company;

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

export const toggleCompanyFetching = fetching => ({
  type: TOGGLE_COMPANY_FETCHING,
  payload: fetching
});
export const toggleListenerFetching = fetching => ({
  type: TOGGLE_LISTENER_FETCHING,
  payload: fetching
});
