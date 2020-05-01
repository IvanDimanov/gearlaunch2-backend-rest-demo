'use strict';

const {validateEnvVars} = require('../../utils/validateEnvVars');
const {error} = validateEnvVars();
/* istanbul ignore next: because this involves killing the test if a ENV VAR is missing or invalid */
if (error) {
  process.stderr.write(`Invalid ENV VAR:
${error.details
      .map(({message, context}) => `  ${message}; currently ${context.key}=${context.value}`)
      .join('\n')}
\n`,
  );
  process.exit(1);
}

/**
 * Generates a valid DB connection info object.
 *
 * @returns {object} All info needed to connect Sequelize to DB
 */
function getConfig() {
  return {
    'url': process.env.DB_URL,
    'dialect': process.env.DB_DIALECT,
    'dialectOptions': {
      'operatorsAliases': false,
    },
    'minifyAliases': true,
    'migrationStorageTableName': process.env.DB_MIGRATION_TABLE,
    'define': {
      'underscored': false,
      'freezeTableName': true,
      'charset': process.env.DB_CHARSET,
      'dialectOptions': {
        'collate': process.env.DB_COLLATE,
      },
      'timestamps': false,
      'paranoid': false,
    },
    'logging': process.env.DB_LOGGING && console.log,
    'pool': {
      'max': process.env.DB_CONNECTION_POOL_MAX,
      'min': process.env.DB_CONNECTION_POOL_MIN,
      'idle': process.env.DB_CONNECTION_POOL_IDLE,
      'acquire': process.env.DB_CONNECTION_POOL_ACQUIRE,
      'evict': process.env.DB_CONNECTION_POOL_EVICT,
    },
  };
}

module.exports = {
  getConfig,
  ...getConfig(),
};
