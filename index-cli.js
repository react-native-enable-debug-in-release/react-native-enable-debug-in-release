#!/usr/bin/env node

console.log(process.cwd());
const {run: runAndroid} = require('./src/android');
const getApplicationInfo = require('./src/libs/react-native-app-info');

const info = getApplicationInfo();
if (!info) {
  return;
}

const {basePath, projectCodeName, bundleIdentifier} = info;
runAndroid(basePath, bundleIdentifier);
//runiOS({cwd, projectCodeName, bundleIdentifier});
