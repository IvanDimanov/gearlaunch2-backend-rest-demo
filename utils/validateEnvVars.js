require('./configureEnvVars');

const Joi = require('@hapi/joi');

const schema = {
  NODE_ENV: Joi.string()
      .valid('development', 'test', 'production')
      .insensitive()
      .required(),

  PORT: Joi.number().integer().min(10).max(10000).required(),

  DB_USERNAME: Joi.string(),
  DB_PASSWORD: Joi.string(),
  DB_HOST: Joi.string().hostname(),
  DB_PORT: Joi.number().port(),
  DB_NAME: Joi.string().required(),
  DB_DIALECT: Joi.string().required(),
  DB_URL: Joi.string().uri().required(),
  DB_MIGRATION_TABLE: Joi.string(),
  DB_CHARSET: Joi.string(),
  DB_COLLATE: Joi.string(),
  DB_LOGGING: Joi.boolean(),
  DB_CONNECTION_POOL_MAX: Joi.number().required(),
  DB_CONNECTION_POOL_MIN: Joi.number().required(),
  DB_CONNECTION_POOL_IDLE: Joi.number().required(),
  DB_CONNECTION_POOL_ACQUIRE: Joi.number().required(),
  DB_CONNECTION_POOL_EVICT: Joi.number().required(),

  ALLOW_CORS: Joi.boolean().required(),
  SWAGGER_HOST: Joi.string().required(),
  SWAGGER_DEFAULT_SCHEME: Joi.string().default('HTTPS'),
};

/* Be sure that the Server will run only with filtered, valid, and converted Env VARs */
const validateEnvVars = () => {
  /* Make sure we do not "leak" any Server ENV VARs that are not suppose to be used by the Server */
  process.env = Object.keys(schema).reduce((map, key) => {
    map[key] = process.env[key];
    return map;
  }, {});

  /* Validate the expected/filtered ENV VARs */
  const {value, error} = Joi.object(schema)
      .required()
      .validate(process.env, {abortEarly: false});

  /* Take the converted ENV VARs so we can have Numbers and Booleans in `process.env` */
  process.env = Object.keys(schema).reduce((map, key) => {
    map[key] = value[key];
    return map;
  }, {});

  return {value, error};
};

module.exports = {
  validateEnvVars,
};
