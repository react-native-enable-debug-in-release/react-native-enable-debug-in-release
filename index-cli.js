#!/usr/bin/env node

const {run: runAndroid} = require('./src/android');
const {run: runiOS} = require('./src/ios');

const basePath = process.cwd();
runAndroid(basePath);
runiOS(basePath);
