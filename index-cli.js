#!/usr/bin/env node

const {run: runAndroid} = require('./src/android');
const {run: runiOS} = require('./src/ios');

const [argBasePath] = process.argv.slice(2);
const basePath = argBasePath || process.cwd();

runAndroid(basePath);
runiOS(basePath);
