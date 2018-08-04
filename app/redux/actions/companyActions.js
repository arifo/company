import firebase from 'firebase';
import { db } from '../../App';

import {
  GET_COMPANIES,
  GET_CURRENT_COMPANY,
  TOGGLE_COMPANY_FETCHING,
  LISTENERS_UNSUBED
} from './types';

export const getCompanies = unsub => (dispatch, getState) => {
  if (!getState().auth.loggedIn && unsub) {
    console.log('unsubscribing company listener...');
    unsubscribe();
    dispatch({ type: LISTENERS_UNSUBED, payload: true });
  }
  const unsubscribe = db
    .collection('companies')
    .where('user', '==', firebase.auth().currentUser.uid)
    .onSnapshot({ includeMetadataChanges: true }, querySnapshot => {
      const arr = [];
      querySnapshot.forEach(doc => {
        arr.push(doc.data());
      });
      console.log('listener is fetching Companies documents!', arr);
      dispatch({ type: GET_COMPANIES, payload: arr });
    });
};

export const getCurrentCompany = companyID => (dispatch, getState) => {
  console.log('before if in company action....getstate', getState().company.isFetching);
  if (getState().company.isFetching) {
    console.log('if in company action....getstate', getState().company.isFetching);

    const docRef = db.collection('companies').doc(companyID);

    docRef
      .get()
      .then(doc => {
        if (doc.exists) {
          console.log('Fetched company document!', doc.data());
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
      console.log('all related employees deletes');
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

// const listen = db
//   .collection('companies')
//   .where('user', '==', firebase.auth().currentUser.uid)
//   .onSnapshot();

// export const startGettingCompanies = () => dispatch => {
//   listen(querySnapshot => {
//     const arr = [];
//     querySnapshot.forEach(doc => {
//       arr.push(doc.data());
//     });
//     dispatch({ type: GET_COMPANIES, payload: arr });
//   });
// };

// export const stopGettingCompanies = () => {
//   listen();
// };

// docRef.set(
//   { [`${this.state.shopId}`]: { [`${timestamp}`]: true } },
//   { merge: true }
// );
