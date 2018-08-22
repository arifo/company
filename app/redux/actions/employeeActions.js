import firebase from 'firebase';
import { StackActions } from 'react-navigation';
import { db } from '../../App';

import { ADD_EMPLOYEE, EDIT_EMPLOYEE, DELETE_EMPLOYEE } from './types';

const popAction = StackActions.pop({ n: 1 });

export const addEmployee = (employeeInfo, uuid, navigation) => async dispatch => {
  let info = Object.assign({}, employeeInfo);

  if (info.avatar) {
    const avatar = await uploadImage(info.avatar, uuid, info.companyID).catch(error => {
      console.log('upload error', error);
    });
    info = Object.assign(info, { avatar });
  }

  const batch = db.batch();

  const addEmployeeRef = db.collection('employees').doc(uuid);
  batch.set(addEmployeeRef, info);

  const updateCompanyEmployeesRef = db.collection('companies').doc(info.companyID);
  batch.set(
    updateCompanyEmployeesRef,
    { employees: { [`${uuid}`]: true }, cacheTimestamp: info.createdAt },
    { merge: true }
  );

  batch.commit();

  dispatch({ type: ADD_EMPLOYEE, payload: employeeInfo, id: uuid });
  navigation.dispatch(popAction);
};

export const deleteEmployee = (employee, navigation) => dispatch => {
  const { id, companyID } = employee;
  if (employee.avatar) {
    deleteAvatar(employee.avatar);
  }
  const batch = db.batch();
  const employeeToDeleteRef = db.collection('employees').doc(id);
  batch.delete(employeeToDeleteRef);

  const deleteCompanyEmployeeRef = db.collection('companies').doc(companyID);
  batch.update(deleteCompanyEmployeeRef, `employees.${id}`, firebase.firestore.FieldValue.delete());

  batch.commit();
  dispatch({ type: DELETE_EMPLOYEE, id });
  navigation.goBack();
};

export const editEmployee = (
  values,
  employee,
  timestamp,
  avatarUri,
  rating,
  navigation
) => async dispatch => {
  const docRef = db.collection('employees').doc(employee.id);
  let data = {
    ...employee,
    name: values.name,
    phone: values.phone,
    email: values.email,
    department: values.department,
    joinDate: values.joinDate,
    rating,
    lastModified: timestamp,
    avatar: avatarUri
  };
  if (avatarUri) {
    const avatar = await uploadImage(avatarUri, employee.id, employee.companyID).catch(error => {
      console.log('upload error', error);
    });
    data = Object.assign(data, { avatar });
  }

  docRef.set(data, { merge: true });

  db.collection('companies')
    .doc(navigation.state.params.companyID)
    .set({ cacheTimestamp: timestamp }, { merge: true });
  dispatch({ type: EDIT_EMPLOYEE, id: employee.id, payload: data });
  navigation.dispatch(popAction);
};

const uploadImage = async (uri, imageName, companyID) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const ref = firebase
    .storage()
    .ref()
    .child(`${firebase.auth().currentUser.uid}/${companyID}/${imageName}`);
  const uploadTask = ref.put(blob);

  return new Promise((res, rej) => {
    uploadTask.then(() =>
      uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
        if (downloadURL === undefined) {
          rej();
        }
        res(downloadURL);
      })
    );
  });
};

export const deleteAvatar = avatar => dispatch => {
  firebase
    .storage()
    .refFromURL(avatar)
    .delete()
    .then(() => {
      console.log('File deleted successfully');
    })
    .catch(error => {
      console.log('Uh-oh, an error occurred!', error);
    });
};
