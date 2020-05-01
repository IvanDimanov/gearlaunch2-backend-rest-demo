const path = require('path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const config = dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});
dotenvExpand(config);
