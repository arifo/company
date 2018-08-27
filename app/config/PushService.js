import PushNotification from 'react-native-push-notification';

export default class PushService {
  constructor(onNotification) {
    this.configure(onNotification);
  }

  configure(onNotification) {
    PushNotification.configure({
      // (required) Called when a remote or local notification is opened or received
      onNotification, //this._onNotification,

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
      requestPermissions: true
    });
  }

  cancelNotif(id) {
    PushNotification.cancelLocalNotifications({ id });
  }

  cancelAll() {
    PushNotification.cancelAllLocalNotifications();
  }
}
