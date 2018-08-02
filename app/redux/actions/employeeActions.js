import firebase from 'firebase';
import { db } from '../../App';

import { GET_EMPLOYEES, GET_CURRENT_EMPLOYEE, TOGGLE_EMPLOYE_FETCHING } from './types';

export const getEmployees = id => dispatch => {
  const unsubscribe = db
    .collection('employees')
    .where('companyID', '==', id)
    .onSnapshot(querySnapshot => {
      const arr = [];
      querySnapshot.forEach(doc => {
        arr.push(doc.data());
      });
      console.log('listener is fetching Employee document!', arr);
      dispatch({ type: GET_EMPLOYEES, payload: arr });
    });

  // unsubscribe();
};

export const getCurrentEmployee = employeeID => (dispatch, getState) => {
  console.log('before if in employe action....getstate', getState().employee.isFetching);
  if (getState().employee.isFetching) {
    console.log('if in employee action....getstate', getState().employee.isFetching);

    const docRef = db.collection('employees').doc(employeeID);
    docRef
      .get()
      .then(doc => {
        if (doc.exists) {
          console.log('Fetched document!', doc.data());
          dispatch({ type: GET_CURRENT_EMPLOYEE, employee: doc.data(), isFetching: false });
        } else {
          console.log('No such document!');
        }
      })
      .catch(error => {
        console.log('Error getting document:', error);
      });
  }
};

export const addEmployee = (employeeInfo, uuid) => dispatch => {
  const batch = db.batch();

  const addEmployeeRef = db.collection('employees').doc(uuid);
  batch.set(addEmployeeRef, employeeInfo);

  const updateCompanyEmployeesRef = db.collection('companies').doc(employeeInfo.companyID);
  batch.set(updateCompanyEmployeesRef, { employees: { [`${uuid}`]: true } }, { merge: true });

  batch.commit();
};

export const deleteEmployee = employee => dispatch => {
  const { id, companyID } = employee;

  const batch = db.batch();
  const employeeToDeleteRef = db.collection('employees').doc(id);
  batch.delete(employeeToDeleteRef);

  const deleteCompanyEmployeeRef = db.collection('companies').doc(companyID);
  batch.update(deleteCompanyEmployeeRef, `employees.${id}`, firebase.firestore.FieldValue.delete());

  batch.commit();
};

export const editEmployee = (values, employeeID, timestamp) => dispatch => {
  const docRef = db.collection('employees').doc(employeeID);

  docRef.set(
    {
      name: values.name,
      phone: values.phone,
      email: values.email,
      department: values.department,
      joinDate: values.joinDate,
      rating: values.rating,
      lastModified: timestamp
    },
    { merge: true }
  );
};

export const toggleEmployeeFetching = fetching => ({
  type: TOGGLE_EMPLOYE_FETCHING,
  payload: fetching
});
