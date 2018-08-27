import firebase from 'react-native-firebase';
import { db } from '../../App';
import {
  GET_COMPANIES,
  GET_EMPLOYEES,
  GET_MEMOS,
  ADD_COMPANY,
  EDIT_COMPANY,
  DELETE_COMPANY,
  TOGGLE_IS_FETCHING
} from './types';

const listeners = {
  company: {},
  employee: {},
  memo: {}
};

export const getData = () => dispatch => {
  try {
    getCompanies()(dispatch);
    getEmployees()(dispatch);
    getMemos()(dispatch);
  } catch (error) {
    console.log('catched an error', error);
  }
};

const getCompanies = () => dispatch => {
  dispatch({ type: TOGGLE_IS_FETCHING, payload: true });
  listeners.company = db
    .collection('companies')
    .where('user', '==', firebase.auth().currentUser.uid)
    .onSnapshot({ includeMetadataChanges: true }, querySnapshot => {
      const obj = {};

      querySnapshot.forEach(doc => {
        Object.assign(obj, { [doc.id]: doc.data() });
      });

      dispatch({ type: GET_COMPANIES, payload: obj });
      dispatch({ type: TOGGLE_IS_FETCHING, payload: false });
    });
};

const getEmployees = () => dispatch => {
  dispatch({ type: TOGGLE_IS_FETCHING, payload: true });
  listeners.employee = db
    .collection('employees')
    .where('user', '==', firebase.auth().currentUser.uid)
    .onSnapshot(querySnapshot => {
      const obj = {};

      querySnapshot.forEach(doc => {
        Object.assign(obj, { [doc.id]: doc.data() });
      });

      dispatch({ type: GET_EMPLOYEES, payload: obj });
      dispatch({ type: TOGGLE_IS_FETCHING, payload: false });
    });
};

const getMemos = () => dispatch => {
  dispatch({ type: TOGGLE_IS_FETCHING, payload: true });
  listeners.memo = db
    .collection('memos')
    .where('user', '==', firebase.auth().currentUser.uid)
    .onSnapshot(querySnapshot => {
      const obj = {};

      querySnapshot.forEach(doc => {
        Object.assign(obj, { [doc.id]: doc.data() });
      });

      dispatch({ type: GET_MEMOS, payload: obj });
      dispatch({ type: TOGGLE_IS_FETCHING, payload: false });
    });
};

export const unsubscribe = listenerName => {
  listeners[listenerName]();
  return {
    type: TOGGLE_IS_FETCHING
  };
};

export const addCompany = (companyInfo, uuid, navigation) => dispatch => {
  const batch = db.batch();

  const addCompanyRef = db.collection('companies').doc(uuid);
  batch.set(addCompanyRef, companyInfo);

  const updateUserCompaniesRef = db.collection('users').doc(companyInfo.user);

  batch.set(updateUserCompaniesRef, { companies: { [`${uuid}`]: true } }, { merge: true });

  batch.commit().then(() => {});
  dispatch({ type: ADD_COMPANY, payload: companyInfo, id: uuid });
  navigation.replace('ViewCompany', {
    title: companyInfo.name,
    companyID: companyInfo.id
  });
};

export const deleteCompany = (id, user) => dispatch => {
  deleteCompanyEmployees(id)(dispatch);
  deleteCompanyMemos(id)(dispatch);

  const batch = db.batch();
  const companyToDeleteRef = db.collection('companies').doc(id);
  batch.delete(companyToDeleteRef);

  const deleteUserCompanyRef = db.collection('users').doc(user);
  batch.update(deleteUserCompanyRef, `companies.${id}`, firebase.firestore.FieldValue.delete());

  batch.commit();
  dispatch({ type: DELETE_COMPANY, id });
};

const deleteCompanyEmployees = id => dispatch => {
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
};

const deleteCompanyMemos = id => dispatch => {
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
};

export const editCompany = (values, company, timestamp, navigation) => dispatch => {
  const data = {
    ...company,
    name: values.name,
    description: values.description,
    lastModified: timestamp,
    cacheTimestamp: timestamp
  };

  db.collection('companies')
    .doc(company.id)
    .set(data, { merge: true })
    .then(() => {});

  dispatch({ type: EDIT_COMPANY, id: company.id, payload: data });

  navigation.replace('ViewCompany', {
    companyID: company.id,
    title: values.name
  });
};
