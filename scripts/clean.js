'use strict';

const fs = require('fs-extra');

(async () => {
  const deletedPaths = ['./.env', './dist', '.nyc_output'].filter((deletePath) => fs.pathExistsSync(deletePath));

  if (deletedPaths.length) {
    deletedPaths.forEach((deletePath) => fs.remove(deletePath));
    console.log(`Files and directories that were deleted:\n- ${deletedPaths.join('\n- ')}`);
  } else {
    console.log(`No temporary files present, nothing changed`);
  }
})();
