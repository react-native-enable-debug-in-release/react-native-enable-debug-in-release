const {readFile, writeFile} = require('./libs/fs');
const getPath = require('./libs/react-native-path');

const runAndroid = ({basePath, projectCodeName, bundleIdentifier}) => {
  console.log('Step: Android');

  const path = getPath(basePath, 'MainApplication.java', projectCodeName, bundleIdentifier);
  let content = readFile(path);

  androidAllowClearTextHttpTraffic({basePath, projectCodeName, bundleIdentifier});

  const replaceSearch = 'return BuildConfig.DEBUG;';
  if (!content.includes(replaceSearch) && content.includes('public boolean getUseDeveloperSupport() {')) {
      console.log(' - Android - [SKIP] Debug mode already enabled');
      return;
  }
  content = content.replace(replaceSearch, 'return true;');
  writeFile(path, content);
  console.log(' - Android - [DONE] Debug mode enabled');
}

const androidAllowClearTextHttpTraffic = ({basePath, projectCodeName, bundleIdentifier}) => {
  const path = getPath(basePath, 'AndroidManifest.xml', projectCodeName, bundleIdentifier);
  let content = readFile(path);

  if (content.includes('android:usesCleartextTraffic')) {
      if (content.includes('android:usesCleartextTraffic="true"')) {
          console.log(' - Android - [SKIP] cleartext (http) traffic already enabled');
          return;
      }
      content = content.replace('android:usesCleartextTraffic="false"', 'android:usesCleartextTraffic="true"');
  } else {
      content = content.replace('<application', '<application android:usesCleartextTraffic="true"');
  }

  writeFile(path, content);
  console.log(' - Android - [DONE] cleartext (http) traffic enabled');
};

module.exports = runAndroid;
