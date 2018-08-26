import firebase from 'react-native-firebase';
import { StackActions } from 'react-navigation';
import { NetInfo } from 'react-native';
import { db } from '../../App';

import { ADD_EMPLOYEE, EDIT_EMPLOYEE, DELETE_EMPLOYEE } from './types';

const popAction = StackActions.pop({ n: 1 });

export const addEmployee = (employeeInfo, uuid, navigation) => async dispatch => {
  let info = Object.assign({}, employeeInfo);

  if (info.avatar) {
    const avatar = await uploadImage(info.avatar, uuid, info.companyID);
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
  let avatar = '';
  if (avatarUri) {
    await NetInfo.isConnected.fetch().then(async isConnected => {
      if (isConnected) {
        await uploadImage(avatarUri, employee.id, employee.companyID).then(ava => {
          console.log('asdfas', ava);
          avatar = ava;
          return avatar;
        });
        console.log('avatar inside isconnetdet', avatar);
      }
      avatar = avatarUri;
    });

    data = Object.assign(data, { avatar });
  }
  console.log('avatar', avatar);

  docRef.set(data, { merge: true });

  db.collection('companies')
    .doc(navigation.state.params.companyID)
    .set({ cacheTimestamp: timestamp }, { merge: true });
  dispatch({ type: EDIT_EMPLOYEE, id: employee.id, payload: data });
  navigation.dispatch(popAction);
};

const uploadImage = async (uri, imageName, companyID) => {
  let avatar = '';
  await firebase
    .storage()
    .ref()
    .child(`${firebase.auth().currentUser.uid}/${companyID}/${imageName}`)
    .putFile(uri)
    .then(result => {
      console.log('result', result);
      if (result.state === 'success') {
        avatar = result.downloadURL;
        return avatar;
      }
    })
    .catch(error => {
      console.log('upload error', error);
    });
  return avatar;
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
