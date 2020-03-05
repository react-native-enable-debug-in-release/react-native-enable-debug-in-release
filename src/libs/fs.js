const fs = require('fs');

const readFile = path => {
  return fs.readFileSync(path, 'utf8');
};

const writeFile = (path, content) => {
  return fs.writeFileSync(path, content);
};

module.exports = {
  readFile,
  writeFile,
};
