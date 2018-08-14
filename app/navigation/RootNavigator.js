import React from 'react';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';

import LoadingScreen from '../screens/authScreens/LoadingScreen';
import LoginScreen from '../screens/authScreens/LoginScreen';
import SignUpScreen from '../screens/authScreens/SignUpScreen';
import ForgotPassword from '../screens/authScreens/ForgotPassword';
import Companies from '../screens/Companies';
import ViewCompany from '../screens/companyScreens/ViewCompany';
import AddCompany from '../screens/companyScreens/AddCompany';
import AddEmployee from '../screens/employeeScreens/AddEmployee';
import ViewEmployee from '../screens/employeeScreens/ViewEmployee';
import AddMemo from '../screens/memoScreens/AddMemo';
import ViewMemo from '../screens/memoScreens/ViewMemo';
import HeaderButton from '../components/HeaderButton';

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
          <HeaderButton
            name="edit"
            type="feather"
            color="#0082C0"
            onPress={() =>
              navigation.replace('AddCompany', {
                title: `Edit ${navigation.state.params.title}`,
                companyID: navigation.state.params.companyID,
                type: 'edit'
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
          <HeaderButton
            name="edit"
            type="feather"
            color="#0082C0"
            onPress={() =>
              navigation.replace('AddEmployee', {
                title: `Edit ${navigation.state.params.title}`,
                type: 'edit',
                employeeID: navigation.state.params.employeeID,
                companyID: navigation.state.params.companyID
              })
            }
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
          <HeaderButton
            name="edit"
            type="feather"
            color="#0082C0"
            onPress={() =>
              navigation.replace('AddMemo', {
                title: `Edit ${navigation.state.params.title}`,
                type: 'edit',
                memoID: navigation.state.params.memoID,
                companyID: navigation.state.params.companyID
              })
            }
          />
        ),
        headerRightContainerStyle: { padding: 15 }
      })
    }
  },
  {}
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
