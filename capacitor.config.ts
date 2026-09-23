import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.taskbuddies',
  appName: 'Task Buddies',
  webDir: 'dist',
  backgroundColor: '#FAF3E8',
  loggingBehavior: 'production',
  zoomEnabled: false,
  android: {
    allowMixedContent: false,
    backgroundColor: '#FAF3E8',
  },
  ios: {
    backgroundColor: '#FAF3E8',
    contentInset: 'never',
    scrollEnabled: true,
    // iPad defaults to desktop-mode rendering (wide viewport, scaled down). Force the phone-style viewport.
    preferredContentMode: 'mobile',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 800,
      backgroundColor: '#FAF3E8',
      showSpinner: false,
    },
    StatusBar: {
      overlaysWebView: false,
      style: 'LIGHT',
      backgroundColor: '#FAF3E8',
    },
    LocalNotifications: {
      iconColor: '#E89B6F',
    },
  },
};

export default config;
