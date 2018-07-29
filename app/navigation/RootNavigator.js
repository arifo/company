import React from 'react';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import LoadingScreen from '../screens/authScreens/LoadingScreen';
import LoginScreen from '../screens/authScreens/LoginScreen';
import SignUpScreen from '../screens/authScreens/SignUpScreen';
import ForgotPassword from '../screens/authScreens/ForgotPassword';
import Companies from '../screens/Companies';
import ViewCompany from '../screens/companyScreens/ViewCompany';
import AddCompany from '../screens/companyScreens/AddCompany';
import AddEmployee from '../screens/employeeScreens/AddEmployee';
import ViewEmployee from '../screens/employeeScreens/ViewEmployee';
import EditEmployee from '../screens/employeeScreens/EditEmployee';
import AddMemo from '../screens/memoScreens/AddMemo';
import ViewMemo from '../screens/memoScreens/ViewMemo';
import EditMemo from '../screens/memoScreens/EditMemo';

const AuthStack = createStackNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      header: () => null
    }
  },
  SignUp: {
    screen: SignUpScreen,
    navigationOptions: {
      header: () => null
    }
  },
  ForgotPassword: {
    screen: ForgotPassword,
    navigationOptions: {
      header: () => null
    }
  }
});

const AppStack = createStackNavigator(
  {
    Companies: {
      screen: Companies,
      navigationOptions: {
        header: () => null
      }
    },
    AddCompany: {
      screen: AddCompany,
      navigationOptions: ({ navigation }) => ({
        headerTitle: navigation.state.params.title
      })
    },
    ViewCompany: {
      screen: ViewCompany,
      navigationOptions: ({ navigation }) => ({
        headerTitle: navigation.state.params.title,
        headerRight: (
          <Icon
            name="edit"
            type="feather"
            color="#0082C0"
            size={25}
            onPress={() =>
              navigation.navigate('AddCompany', {
                title: `Edit ${navigation.state.params.title}`,
                type: 'edit',
                company: navigation.state.params.company
              })
            }
          />
        ),
        headerRightContainerStyle: { padding: 15 }
      })
    },
    AddEmployee: {
      screen: AddEmployee,
      navigationOptions: ({ navigation }) => ({
        headerTitle: navigation.state.params.title
      })
    },
    ViewEmployee: {
      screen: ViewEmployee,
      navigationOptions: ({ navigation }) => ({
        headerTitle: navigation.state.params.title,
        headerRight: (
          <Icon
            name="edit"
            type="feather"
            color="#0082C0"
            size={25}
            onPress={() =>
              navigation.navigate('EditEmployee', {
                title: `Edit ${navigation.state.params.title}`
              })
            }
          />
        ),
        headerRightContainerStyle: { padding: 15 }
      })
    },
    EditEmployee: {
      screen: EditEmployee,
      navigationOptions: ({ navigation }) => ({
        headerTitle: navigation.state.params.title,
        headerRight: (
          <Icon
            name="save"
            type="entypo"
            color="#0082C0"
            size={25}
            onPress={() => navigation.goBack()}
          />
        ),
        headerRightContainerStyle: { padding: 15 }
      })
    },
    AddMemo: {
      screen: AddMemo,
      navigationOptions: ({ navigation }) => ({
        headerTitle: navigation.state.params.title
      })
    },
    ViewMemo: {
      screen: ViewMemo,
      navigationOptions: ({ navigation }) => ({
        headerTitle: navigation.state.params.title,
        headerRight: (
          <Icon
            name="edit"
            type="feather"
            color="#0082C0"
            size={25}
            onPress={() =>
              navigation.navigate('EditMemo', {
                title: `Edit ${navigation.state.params.title}`
              })
            }
          />
        ),
        headerRightContainerStyle: { padding: 15 }
      })
    },
    EditMemo: {
      screen: EditMemo,
      navigationOptions: ({ navigation }) => ({
        headerTitle: navigation.state.params.title,
        headerRight: (
          <Icon
            name="save"
            type="entypo"
            color="#0082C0"
            size={25}
            onPress={() => navigation.goBack()}
          />
        ),
        headerRightContainerStyle: { padding: 15 }
      })
    }
  },
  {
    // navigationOptions: {
    //   header: null
    // },
    // initialRouteName: 'Settings'
  }
);

export default createSwitchNavigator(
  {
    AuthLoading: LoadingScreen,
    App: AppStack,
    Auth: AuthStack
  },
  {
    initialRouteName: 'AuthLoading'
  }
);
