const {logger} = require('@react-native-community/cli-tools');
const {projectConfig} = require('@react-native-community/cli-platform-android');
const {readFile, writeFile} = require('./libs/fs');

const run = basePath => {
  logger.info('Step: Android');
  const {manifestPath, mainFilePath} = projectConfig(basePath);
  allowClearTextHttpTraffic(manifestPath);
  forceDeveloperSupportEnabled(mainFilePath);
};

/**
 * Modifies AndroidManifest.xml file to allow Cleartext Traffic (HTTP instead of HTTPS) in Release configuration
 * Unfortunately, this is necessary, because right now React Native mobile application supports connecting to Metro Bundler using HTTP traffic only ("http" and "ws" hardcoded).
 * @see getWebsocketProxyURL - https://github.com/facebook/react-native/blob/48001c597eba1c9f4eafb6b47e0b9f758e6c424f/ReactAndroid/src/main/java/com/facebook/react/devsupport/DevServerHelper.java#L360
 * @see createBundleURL - https://github.com/facebook/react-native/blob/48001c597eba1c9f4eafb6b47e0b9f758e6c424f/ReactAndroid/src/main/java/com/facebook/react/devsupport/DevServerHelper.java#L427
 * @param {String} manifestPath - path to AndroidManifest.xml file
 */
const allowClearTextHttpTraffic = manifestPath => {
  let content = readFile(manifestPath);

  if (content.includes('android:usesCleartextTraffic')) {
      if (content.includes('android:usesCleartextTraffic="true"')) {
          logger.info(' - Android - [SKIP] cleartext (http) traffic already enabled');
          return;
      }
      content = content.replace('android:usesCleartextTraffic="false"', 'android:usesCleartextTraffic="true"');
  } else {
      content = content.replace('<application', '<application\n      android:usesCleartextTraffic="true"');
  }

  writeFile(manifestPath, content);
  logger.success(' - Android - [DONE] cleartext (http) traffic enabled');
};

/**
 * Modifies getUseDeveloperSupport() method in MainApplication.java file to force return true always
 * @param {String} mainFilePath - path to MainApplication.java file
 */
const forceDeveloperSupportEnabled = mainFilePath => {
  const content = readFile(mainFilePath);
  const replaceSearch = 'return BuildConfig.DEBUG;';

  if (!content.includes(replaceSearch) && content.includes('public boolean getUseDeveloperSupport() {')) {
      logger.info(' - Android - [SKIP] Developer Support already enabled');
      return;
  }
  const nextContent = content.replace(replaceSearch, 'return true;');
  writeFile(mainFilePath, nextContent);
  logger.success(' - Android - [DONE] Developer Support enabled');
};

module.exports = {
  run,
  allowClearTextHttpTraffic,
  forceDeveloperSupportEnabled,
};
