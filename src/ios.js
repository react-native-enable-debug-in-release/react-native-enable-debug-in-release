const {logger} = require('@react-native-community/cli-tools');
const {projectConfig} = require('@react-native-community/cli-platform-ios');
const findPodTargetLine = require('@react-native-community/cli-platform-ios/build/link-pods/findPodTargetLine').default;
const findLineToAddPod = require('@react-native-community/cli-platform-ios/build/link-pods/findLineToAddPod').default;
const {readFile, writeFile} = require('./libs/fs');

const run = basePath => {
  logger.info('Step: iOS');
  const {podfile, projectName} = projectConfig(basePath, {});
  forceDebugMode(podfile, projectName);
};

/**
 * Forces usage of debug preprocessor flags
 * Modifies Podfile to achieve this goal
 * @param {string} podfilePath - path to Podfile
 * @param {string} projectName - target with such name will be modified in Podfile
 */
const forceDebugMode = (podfilePath, projectName) => {
  const content = readFile(podfilePath);

  if (content.includes('RCT_DEBUG')) {
      logger.info(' - iOS - [SKIP] Debug mode already enabled');
      return;
  }

  const podLines = content.split(/\r?\n/g);
  const lineData = getLineDataToAddPostInstallFunction(podLines, projectName);
  if (!lineData) {
    return false;
  }

  const postInstallCode = `
post_install do |installer|
  installer.target_installation_results.pod_target_installation_results
    .each do |pod_name, target_installation_result|
      target_installation_result.native_target.build_configurations.each do |config|
        config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= ['$(inherited)']
        config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] << 'DEBUG=1'
        config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] << 'RCT_DEBUG=1'
        config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] << 'RCT_DEV=1'
      end
  end
end
`;
  
  const formatted = postInstallCode
    .split('\n')
    // Add identations
    .map(row => ' '.repeat(lineData.indentation) + row)
    // Trim empty lines
    .map(row => (row.trim().length === 0) ? '' : row)
    // Remove first line if empty
    .filter((row, index) => index > 0 || row.trim().length > 0)
    .join('\n')
  ;

  podLines.splice(lineData.line, 0, formatted);
  const nextContent = podLines.join('\n');

  writeFile(podfilePath, nextContent);
  logger.success(' - iOS - [DONE] Debug mode enabled');
};

/**
 * Finds line data for inserting new instructions in Podfile
 * @param {Array} podLines - lines of Podfile
 * @param {string} projectCodeName - name of project
 * @returns {({indentation: number, line: number}|null)} indentation and line or null if cannot find
 */
const getLineDataToAddPostInstallFunction = (podLines, projectName) => {
  const firstTargetLine = findPodTargetLine(podLines, projectName);
  if (firstTargetLine === null) {
    logger.error(' - iOS - cannot find line, make sure that Podfile has target with main projectName');
    return null;
  }

  return findLineToAddPod(podLines, firstTargetLine)
};

module.exports = {
  run,
  forceDebugMode,
  getLineDataToAddPostInstallFunction,
};
