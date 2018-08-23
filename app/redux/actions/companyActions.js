import firebase from 'firebase';
import _ from 'lodash';
import { db } from '../../App';
import {
  GET_COMPANIES,
  GET_EMPLOYEES,
  GET_MEMOS,
  ADD_COMPANY,
  EDIT_COMPANY,
  DELETE_COMPANY,
  TOGGLE_LISTENER_FETCHING
} from './types';

export const handleCaching = () => async (dispatch, getState) => {
  const localCompanies = getState().company.companies;

  if (_.isEmpty(localCompanies)) {
    getData()(dispatch);
    console.log('got all the data -Companies-Employees-Memos');
    return;
  }
  const dbTimestamp = await getLastModifiedCacheTimestamp();
  console.log('await dbTimestamp result', dbTimestamp);

  const localTimestamp = getState().company.lastModified;
  console.log('check timestamp difference', localTimestamp, dbTimestamp);

  if (localTimestamp !== dbTimestamp) {
    console.log('Data has changed');
    getData()(dispatch);
    return;
  }
  console.log('using cache', localCompanies);
};

const getLastModifiedCacheTimestamp = () =>
  db
    .collection('companies')
    .where('user', '==', firebase.auth().currentUser.uid)
    .orderBy('cacheTimestamp', 'desc')
    .limit(1)
    .get()
    .then(querySnapshot => {
      let times = '';
      querySnapshot.forEach(doc => {
        times = doc.data().cacheTimestamp;
      });
      return times;
    });

const colRef = collection =>
  db.collection(collection).where('user', '==', firebase.auth().currentUser.uid);

export const getData = () => dispatch => {
  dispatch({ type: TOGGLE_LISTENER_FETCHING, payload: true });
  colRef('companies')
    .get()
    .then(querySnapshot => {
      const obj = {};
      querySnapshot.forEach(doc => {
        Object.assign(obj, { [doc.id]: doc.data() });
      });
      const lastModifiedCompany = _.orderBy(obj, ['cacheTimestamp'], ['desc']);
      const lastModified = lastModifiedCompany[0].cacheTimestamp;
      dispatch({ type: GET_COMPANIES, payload: obj, lastModified });
    });

  colRef('employees')
    .get()
    .then(querySnapshot => {
      const obj = {};
      querySnapshot.forEach(doc => {
        Object.assign(obj, { [doc.id]: doc.data() });
      });
      dispatch({ type: GET_EMPLOYEES, payload: obj });
    });

  colRef('memos')
    .get()
    .then(querySnapshot => {
      const obj = {};
      querySnapshot.forEach(doc => {
        Object.assign(obj, { [doc.id]: doc.data() });
      });
      dispatch({ type: GET_MEMOS, payload: obj });
    });
  dispatch({ type: TOGGLE_LISTENER_FETCHING, payload: false });
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
  dispatch({ type: DELETE_COMPANY, id });
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

// export const toggleListenerFetching = fetching => ({
//   type: TOGGLE_LISTENER_FETCHING,
//   payload: fetching
// });

// const listeners = {
//   company: {},
//   employee: {},
//   memo: {}
// };

// export const getCompanies = () => dispatch => {
//   console.log('in getCompanies');
//   listeners.company = db
//     .collection('companies')
//     .where('user', '==', firebase.auth().currentUser.uid)
//     .onSnapshot({ includeMetadataChanges: true }, querySnapshot => {
//       console.log('getCompanies');
//       const obj = {};
//       querySnapshot.docChanges().forEach(async changed => {
//         if (changed.type === 'added') {
//           querySnapshot.forEach(doc => {
//             Object.assign(obj, { [doc.id]: doc.data() });
//           });
//           // AsyncStorage.setItem('companies', JSON.stringify(obj));
//           const lastModifiedCompany = _.orderBy(obj, ['cacheTimestamp'], ['desc']);
//           // AsyncStorage.setItem('timestamp', lastModifiedCompany[0].cacheTimestamp);
//           const lastModified = lastModifiedCompany[0].cacheTimestamp;

//           dispatch({ type: GET_COMPANIES, payload: obj, lastModified });
//         }
//         if (changed.type === 'modified') {
//           dispatch({ type: EDIT_COMPANY, id: changed.doc.id, payload: changed.doc.data() });
//         }
//         if (changed.type === 'removed') {
//           dispatch({ type: DELETE_COMPANY, id: changed.doc.id });
//         }
//       });
//       dispatch({ type: TOGGLE_LISTENER_FETCHING, payload: false });
//     });
// };

// export const getMemos = () => dispatch => {
//   listeners.memo = db
//     .collection('memos')
//     .where('user', '==', firebase.auth().currentUser.uid)
//     .onSnapshot(querySnapshot => {
//       const obj = {};
//       querySnapshot.docChanges().forEach(changed => {
//         if (changed.type === 'added') {
//           querySnapshot.forEach(doc => {
//             Object.assign(obj, { [doc.id]: doc.data() });
//           });
//           AsyncStorage.setItem('memos', JSON.stringify(obj));
//           dispatch({ type: GET_MEMOS, payload: obj });
//         }
//         if (changed.type === 'modified') {
//           dispatch({ type: GET_MEMOS, id: changed.doc.id, payload: changed.doc.data() });
//         }
//         if (changed.type === 'removed') {
//           dispatch({ type: DELETE_MEMO, id: changed.doc.id });
//         }
//       });
//       dispatch({ type: TOGGLE_LISTENER_FETCHING, payload: false });
//     });
// };

// export const getEmployees = () => dispatch => {
//   listeners.employee = db
//     .collection('employees')
//     .where('user', '==', firebase.auth().currentUser.uid)
//     .onSnapshot(querySnapshot => {
//       const obj = {};
//       querySnapshot.docChanges().forEach(changed => {
//         if (changed.type === 'added') {
//           querySnapshot.forEach(doc => {
//             Object.assign(obj, { [doc.id]: doc.data() });
//           });
//           AsyncStorage.setItem('employees', JSON.stringify(obj));
//           dispatch({ type: GET_EMPLOYEES, payload: obj });
//         }
//         if (changed.type === 'modified') {
//           dispatch({ type: GET_EMPLOYEES, id: changed.doc.id, payload: changed.doc.data() });
//         }
//         if (changed.type === 'removed') {
//           dispatch({ type: DELETE_EMPLOYEE, id: changed.doc.id });
//         }
//       });
//       dispatch({ type: TOGGLE_LISTENER_FETCHING, payload: false });
//     });
// };

// export const unsubscribe = listenerName => {
//   listeners[listenerName]();
//   return {
//     type: LISTENERS_UNSUBED
//   };
// };
