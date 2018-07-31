import firebase from 'firebase';
import { db } from '../../App';

import { GET_EMPLOYEES } from './types';

export const getEmployees = id => dispatch => {
  db.collection('employees')
    .where('companyID', '==', id)
    .onSnapshot(querySnapshot => {
      const arr = [];
      querySnapshot.forEach(doc => {
        arr.push(doc.data());
      });
      dispatch({ type: GET_EMPLOYEES, payload: arr });
    });
  const unsubscribe = db.collection('employees').onSnapshot(() => {});
  unsubscribe();
};

export const addEmployee = (employeeInfo, uuid) => dispatch => {
  const batch = db.batch();

  const addEmployeeRef = db.collection('employees').doc(uuid);
  batch.set(addEmployeeRef, employeeInfo);

  const updateCompanyEmployeesRef = db.collection('companies').doc(employeeInfo.companyID);

  batch.set(updateCompanyEmployeesRef, { employees: { [`${uuid}`]: true } }, { merge: true });

  // docRef.set(
  //   { [`${this.state.shopId}`]: { [`${timestamp}`]: true } },
  //   { merge: true }
  // );

  batch.commit();
};

export const deletasdeCompany = company => dispatch => {
  const { id, user } = company;

  const batch = db.batch();
  const companyToDeleteRef = db.collection('companies').doc(id);
  batch.delete(companyToDeleteRef);

  const deleteUserCompanyRef = db.collection('users').doc(user);
  batch.update(deleteUserCompanyRef, `companies.${id}`, firebase.firestore.FieldValue.delete());

  batch.commit();
};

export const edasditCompany = (values, companyID) => {
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
