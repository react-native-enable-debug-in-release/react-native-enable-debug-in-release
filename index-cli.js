#!/usr/bin/env node

const {run: runAndroid} = require('./src/android');
const {run: runiOS} = require('./src/ios');
const getApplicationInfo = require('./src/libs/react-native-app-info');

const info = getApplicationInfo();
if (!info) {
  return;
}

const {basePath} = info;
runAndroid(basePath);
runiOS(basePath);
