const path = require('path');
const {logger} = require('@react-native-community/cli-tools');
const {readFile, writeFile} = require('./libs/fs');

const run = (basePath, bundleIdentifier) => {
  logger.info('Step: Android');
  allowClearTextHttpTraffic(basePath);
  forceDeveloperSupportEnabled(basePath, bundleIdentifier);
};

/**
 * This method modifies AndroidManifest.xml file to allow Cleartext Traffic (HTTP instead of HTTPS) in Release configuration
 * Unfortunately, this is necessary, because right now React Native mobile application supports connecting to Metro Bundler using HTTP traffic only ("http" and "ws" hardcoded).
 * @see getWebsocketProxyURL - https://github.com/facebook/react-native/blob/48001c597eba1c9f4eafb6b47e0b9f758e6c424f/ReactAndroid/src/main/java/com/facebook/react/devsupport/DevServerHelper.java#L360
 * @see createBundleURL - https://github.com/facebook/react-native/blob/48001c597eba1c9f4eafb6b47e0b9f758e6c424f/ReactAndroid/src/main/java/com/facebook/react/devsupport/DevServerHelper.java#L427
 * @param {String} basePath 
 */
const allowClearTextHttpTraffic = basePath => {
  const fullpath = path.resolve(basePath, 'android', 'app', 'src' , 'main', 'AndroidManifest.xml');
  let content = readFile(fullpath);

  if (content.includes('android:usesCleartextTraffic')) {
      if (content.includes('android:usesCleartextTraffic="true"')) {
          logger.info(' - Android - [SKIP] cleartext (http) traffic already enabled');
          return;
      }
      content = content.replace('android:usesCleartextTraffic="false"', 'android:usesCleartextTraffic="true"');
  } else {
      content = content.replace('<application', '<application android:usesCleartextTraffic="true"');
  }

  writeFile(fullpath, content);
  logger.success(' - Android - [DONE] cleartext (http) traffic enabled');
};

const forceDeveloperSupportEnabled = (basePath, bundleIdentifier) => {
  const fullpath = path.resolve(basePath, 'android', 'app', 'src' , 'main', 'java', ...(bundleIdentifier.split('.')), 'MainApplication.java');
  const content = readFile(fullpath);

  const replaceSearch = 'return BuildConfig.DEBUG;';

  if (!content.includes(replaceSearch) && content.includes('public boolean getUseDeveloperSupport() {')) {
      logger.info(' - Android - [SKIP] Developer Support already enabled');
      return;
  }
  const nextContent = content.replace(replaceSearch, 'return true;');
  writeFile(fullpath, nextContent);
  logger.success(' - Android - [DONE] Developer Support enabled');
};

module.exports = {
  run,
  allowClearTextHttpTraffic,
  forceDeveloperSupportEnabled,
};
