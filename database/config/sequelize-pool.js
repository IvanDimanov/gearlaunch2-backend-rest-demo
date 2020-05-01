/**
 * Without this check `DataTypes.BIGINT` is returned as {String}
 * https://github.com/sequelize/sequelize/issues/1774#issuecomment-44318978
 */
require('pg').defaults.parseInt8 = true;

const Sequelize = require('sequelize');
const {v4: uuid} = require('uuid');
const {getConfig} = require('./config');
const config = getConfig();

Sequelize.formatLogging = (sql) => sql.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ');

const instance = new Sequelize(config.url, config);

instance.id = uuid();
instance.types = Sequelize;
instance.formatLogging = Sequelize.formatLogging;
instance.config = getConfig(); // Get a new JSON Object with config data just to be sure no one will alter the config inuse

const getInstance = () => instance;

module.exports = {
  Sequelize,
  getInstance,
};
