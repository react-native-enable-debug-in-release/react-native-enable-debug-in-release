#!/usr/bin/env node

console.log(process.cwd());
const runAndroid = require('./src/run-android');
const getApplicationInfo = require('./src/libs/react-native-app-info');

const {basePath, projectCodeName, bundleIdentifier} = getApplicationInfo();
runAndroid({basePath, projectCodeName, bundleIdentifier});
//runiOS({cwd, projectCodeName, bundleIdentifier});
