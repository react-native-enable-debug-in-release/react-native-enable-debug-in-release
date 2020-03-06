#!/usr/bin/env node

console.log(process.cwd());
const runAndroid = require('./src/run-android');
const getApplicationInfo = require('./src/libs/react-native-app-info');

const info = getApplicationInfo();
if (!info) {
  return;
}

const {basePath, projectCodeName, bundleIdentifier} = info;
runAndroid({basePath, projectCodeName, bundleIdentifier});
//runiOS({cwd, projectCodeName, bundleIdentifier});
