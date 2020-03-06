#!/usr/bin/env node

const path = require('path');
const {run: runAndroid} = require('./src/android');
const {run: runiOS} = require('./src/ios');

// Get Current Working Directory as base path or use first argument as path
const [argBasePath] = process.argv.slice(2);
const basePath = !argBasePath ? process.cwd() : path.resolve(process.cwd(), argBasePath);

// Run for all platforms
runAndroid(basePath);
runiOS(basePath);
