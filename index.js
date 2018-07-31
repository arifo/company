import { AppRegistry, YellowBox } from 'react-native';
import App from './app/App';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
console.ignoredYellowBox = ['Setting a timer', 'Warning'];

AppRegistry.registerComponent('company', () => App);
