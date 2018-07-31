import firebase from 'firebase';
import { db } from '../../App';

import { GET_COMPANIES } from './types';

export const getCompanies = () => dispatch => {
  db.collection('companies')
    .where('user', '==', firebase.auth().currentUser.uid)
    .onSnapshot(querySnapshot => {
      const arr = [];
      querySnapshot.forEach(doc => {
        arr.push(doc.data());
      });
      dispatch({ type: GET_COMPANIES, payload: arr });
    });
  const unsubscribe = db.collection('companies').onSnapshot(() => {});
  unsubscribe();
};

export const addCompany = (companyInfo, uuid) => dispatch => {
  const batch = db.batch();

  const addCompanyRef = db.collection('companies').doc(uuid);
  batch.set(addCompanyRef, companyInfo);

  const updateUserCompaniesRef = db.collection('users').doc(companyInfo.user);

  batch.set(updateUserCompaniesRef, { companies: { [`${uuid}`]: true } }, { merge: true });

  // docRef.set(
  //   { [`${this.state.shopId}`]: { [`${timestamp}`]: true } },
  //   { merge: true }
  // );

  batch.commit();
};

export const deleteCompany = company => dispatch => {
  const { id, user } = company;

  const batch = db.batch();
  const companyToDeleteRef = db.collection('companies').doc(id);
  batch.delete(companyToDeleteRef);

  const deleteUserCompanyRef = db.collection('users').doc(user);
  batch.update(deleteUserCompanyRef, `companies.${id}`, firebase.firestore.FieldValue.delete());

  batch.commit();
};

export const editCompany = (values, companyID) => {
  db.collection('companies')
    .doc(companyID)
    .set(
      {
        name: values.name,
        description: values.description
      },
      { merge: true }
    )
    .then(() => {
      console.log('Document successfully updated!');
    });
};
