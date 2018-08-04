import firebase from 'firebase';
import ImagePicker from 'react-native-image-picker';
import moment from 'moment';
import { db } from '../../App';

import {
  GET_EMPLOYEES,
  GET_CURRENT_EMPLOYEE,
  TOGGLE_EMPLOYE_FETCHING,
  LISTENERS_UNSUBED
} from './types';

export const getEmployees = id => (dispatch, getState) => {
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
  if (!getState().auth.loggedIn) {
    console.log('unsubscribing employee listener...');
    unsubscribe();
    dispatch({ type: LISTENERS_UNSUBED, payload: true });
  }
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

export const editEmployee = (values, employeeID, timestamp, avataruRi) => dispatch => {
  const docRef = db.collection('employees').doc(employeeID);

  docRef.set(
    {
      name: values.name,
      phone: values.phone,
      email: values.email,
      department: values.department,
      joinDate: values.joinDate,
      rating: values.rating,
      lastModified: timestamp,
      avatar: avataruRi
    },
    { merge: true }
  );
};

export const toggleEmployeeFetching = fetching => ({
  type: TOGGLE_EMPLOYE_FETCHING,
  payload: fetching
});

//

export function uploadImagesToFirebaseStorage(state, companyID) {
  return dispatch => {
    const uploadImage = async (uri, imageName) => {
      const response = await fetch(uri);
      const blob = await response.blob();
      const ref = firebase
        .storage()
        .ref()
        .child(`${firebase.auth().currentUser.uid}/${companyID}/${imageName}`);
      const uploadTask = ref.put(blob);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING:
            console.log('Upload is running');
            break;
          default:
            return;
        }
      });

      uploadTask.then(() => {
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          if (downloadURL === undefined) {
            return;
          }
          console.log('image downloadURL', downloadURL);
          dispatch(() =>
            state.setState({ avatar: downloadURL, imageUploading: false, imageSelected: true })
          );
        });
      });
      return uploadTask;
    };

    const options = {
      title: 'Select Avatar',
      cameraType: 'front',
      quality: 0.4,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        const imgName = moment().valueOf();
        uploadImage(response.uri, imgName)
          .then(() => {
            console.log('Upload Success', source);
          })
          .catch(error => {
            console.log('upload error', error);
          });
      }
    });
  };
}

export const deleteAvatarFromStorage = avatar => dispatch => {
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

// export function uploadImagesToFirebaseStorage(state) {
//   return dispatch => {
//     const uploadImage = async (uri, imageName) => {
//       const response = await fetch(uri);
//       const blob = await response.blob();
//       const ref = firebase
//         .storage()
//         .ref()
//         .child(`${firebase.auth().currentUser.uid}/${imageName}`);
//       const uploadTask = ref.put(blob);

//       uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
//         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         console.log(`Upload is ${progress}% done`);
//         switch (snapshot.state) {
//           case firebase.storage.TaskState.PAUSED:
//             console.log('Upload is paused');
//             break;
//           case firebase.storage.TaskState.RUNNING:
//             console.log('Upload is running');
//             break;
//           default:
//             return;
//         }
//       });

//       uploadTask.then(() => {
//         uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
//           if (downloadURL === undefined) {
//             return;
//           }
//           console.log('image downloadURL', downloadURL);
//           dispatch(() => state.setState({ avatar: downloadURL, imageUploading: false }));
//         });
//       });
//       return uploadTask;
//     };

//     const imgName = `Avatar_${moment().format('YYYYMMDDHHMMSS')}`;

//     uploadImage(state.state.avatarSource, imgName)
//       .then(() => {
//         console.log('Upload Success', state.state.avatarSource);
//       })
//       .catch(error => {
//         console.log('upload error', error);
//       });
//   };
// }
