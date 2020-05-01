'use strict';

const fs = require('fs-extra');

const srcPath = './.env-template';
const destPath = './.env';

(async () => {
  const pathExists = await fs.pathExists(destPath);
  if (pathExists) {
    return console.warn(`${destPath} already exists, nothing changed`);
  }

  await fs.copy(srcPath, destPath);
  console.log(`${srcPath} was copied to ${destPath}`);
})();
