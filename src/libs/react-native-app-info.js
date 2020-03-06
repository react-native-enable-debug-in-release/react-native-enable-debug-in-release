const path = require('path');
const {logger} = require('@react-native-community/cli-tools');
const {readFile} = require('./fs');

const getApplicationInfo = () => {
  const basePath = getBasePath();
  const packageJsonInfo = getPackageJsonInfo(basePath);

  if (!packageJsonInfo) {
    return false;
  }
  
  if (!packageJsonInfo.dependencies || !packageJsonInfo.dependencies['react-native']) {
    logger.error('Run command from root directory of your react native application (where package.json located and contains dependency on react-native)');
    return false;
  }

  const bundleIdentifier = getBundleIdentifier(basePath);
  const projectCodeName = getProjectCodeName(basePath);

  return {
    basePath,
    bundleIdentifier,
    projectCodeName,
  }

};

const getBasePath = () => {
  return process.cwd();
};

const getPackageJsonInfo = basePath => {
  const filename = path.resolve(basePath, 'package.json');
  let info = null;
  try {
    info = JSON.parse(readFile(filename));
  } catch (e) {
    logger.error('Run command from root directory of your react native application (where package.json located)');
    return false;
  }
  return info;
};

const getBundleIdentifier = basePath => {
  const filename = path.resolve(basePath, 'android', 'app', 'build.gradle');
  const gradleContent = readFile(filename);
  const [, bundleIdentifier] = gradleContent.match(/applicationId\s+"?(.*?)"?\s/i);
  return bundleIdentifier;
};

const getProjectCodeName = basePath => {
  const filename = path.resolve(basePath, 'ios', 'Podfile');
  const podfileContent = readFile(filename);
  const [, projectCodeName] = podfileContent.match(/target '(.*?)'/i);
  return projectCodeName;
};

module.exports = getApplicationInfo;
