const path = require('path');

const getPath = (basePath, type, projectCodeName, bundleIdentifier) => {
  switch (type) {
    case 'AndroidManifest.xml':
      return path.resolve(basePath, 'android', 'app', 'src' , 'main', 'AndroidManifest.xml');
    case 'MainApplication.java':
      const bundleIdentifierParts = bundleIdentifier.split('.');
      return path.resolve(basePath, 'android', 'app', 'src' , 'main', 'java', ...bundleIdentifierParts, 'MainApplication.java');
    default:
      throw Error('Unknown type for path: ' + type);
  }
};

module.exports = getPath;
