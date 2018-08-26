import firebase from 'react-native-firebase';
import { db } from '../../App';
import {
  GET_COMPANIES,
  GET_EMPLOYEES,
  GET_MEMOS,
  ADD_COMPANY,
  EDIT_COMPANY,
  DELETE_COMPANY,
  TOGGLE_LISTENER_FETCHING,
  DELETE_MEMO,
  DELETE_EMPLOYEE,
  EDIT_MEMO,
  EDIT_EMPLOYEE
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
  dispatch({ type: TOGGLE_LISTENER_FETCHING, payload: true });
  listeners.company = db
    .collection('companies')
    .where('user', '==', firebase.auth().currentUser.uid)
    .onSnapshot({ includeMetadataChanges: true }, querySnapshot => {
      const obj = {};
      querySnapshot.forEach(doc => {
        Object.assign(obj, { [doc.id]: doc.data() });
      });
      dispatch({ type: GET_COMPANIES, payload: obj });

      // querySnapshot.docChanges().forEach(changed => {
      //   if (changed.type === 'added') {
      //     // dispatch({ type: ADD_COMPANY, id: changed.doc.id, payload: changed.doc.data() });
      //   }

      //   if (changed.type === 'modified') {
      //     dispatch({ type: EDIT_COMPANY, id: changed.doc.id, payload: changed.doc.data() });
      //   }

      //   if (changed.type === 'removed') {
      //     dispatch({ type: DELETE_COMPANY, id: changed.doc.id });
      //   }
      // });
      const source = querySnapshot.metadata.fromCache ? 'local cache' : 'server';
      console.log(`Company Data came from ${source}`);
      dispatch({ type: TOGGLE_LISTENER_FETCHING, payload: false });
    });
};

const getEmployees = () => dispatch => {
  dispatch({ type: TOGGLE_LISTENER_FETCHING, payload: true });
  listeners.employee = db
    .collection('employees')
    .where('user', '==', firebase.auth().currentUser.uid)
    .onSnapshot(querySnapshot => {
      const obj = {};
      querySnapshot.forEach(doc => {
        Object.assign(obj, { [doc.id]: doc.data() });
      });
      dispatch({ type: GET_EMPLOYEES, payload: obj });

      // querySnapshot.docChanges().forEach(changed => {
      //   if (changed.type === 'added') {
      //     console.log('employee add type');
      //   }
      //   if (changed.type === 'modified') {
      //     dispatch({ type: EDIT_EMPLOYEE, id: changed.doc.id, payload: changed.doc.data() });
      //   }
      //   if (changed.type === 'removed') {
      //     dispatch({ type: DELETE_EMPLOYEE, id: changed.doc.id });
      //   }
      // });
      const source = querySnapshot.metadata.fromCache ? 'local cache' : 'server';
      console.log(`EmployeE Data came from ${source}`);
    });
};

const getMemos = () => dispatch => {
  dispatch({ type: TOGGLE_LISTENER_FETCHING, payload: true });
  listeners.memo = db
    .collection('memos')
    .where('user', '==', firebase.auth().currentUser.uid)
    .onSnapshot(querySnapshot => {
      console.log('in getMemo');
      const obj = {};
      querySnapshot.forEach(doc => {
        Object.assign(obj, { [doc.id]: doc.data() });
      });
      dispatch({ type: GET_MEMOS, payload: obj });
      // querySnapshot.docChanges().forEach(changed => {
      //   if (changed.type === 'added') {
      //     console.log('type add memo');
      //   }
      //   if (changed.type === 'modified') {
      //     dispatch({ type: EDIT_MEMO, id: changed.doc.id, payload: changed.doc.data() });
      //   }
      //   if (changed.type === 'removed') {
      //     dispatch({ type: DELETE_MEMO, id: changed.doc.id });
      //   }
      // });
      const source = querySnapshot.metadata.fromCache ? 'local cache' : 'server';
      console.log(`MEMO Data came from ${source}`);
      dispatch({ type: TOGGLE_LISTENER_FETCHING, payload: false });
    });
};

export const unsubscribe = listenerName => {
  listeners[listenerName]();
  return {
    type: TOGGLE_LISTENER_FETCHING
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

// export const toggleListenerFetching = fetching => ({
//   type: TOGGLE_LISTENER_FETCHING,
//   payload: fetching
// });

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

// const getLastModifiedCacheTimestamp = () =>
//   db
//     .collection('companies')
//     .where('user', '==', firebase.auth().currentUser.uid)
//     .orderBy('cacheTimestamp', 'desc')
//     .limit(1)
//     .get()
//     .then(querySnapshot => {
//       let times = '';
//       querySnapshot.forEach(doc => {
//         times = doc.data().cacheTimestamp;
//       });
//       return times;
//     });

// const colRef = collection =>
//   db.collection(collection).where('user', '==', firebase.auth().currentUser.uid);
