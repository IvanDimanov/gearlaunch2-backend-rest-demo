const {getInstance} = require('../config/sequelize-pool');
const instance = getInstance();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

const db = {};

fs
    .readdirSync(__dirname)
    .filter((file) => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach((file) => {
      const model = instance['import'](path.join(__dirname, file));
      db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = instance;
db.Sequelize = Sequelize;

/**
 * A Model represents a table in the database.
 *
 * @typedef {object} Model
 * @property {Function} build - create model instance
 * @external Model
 * @see {@link https://sequelize.org/master/class/lib/model.js~Model.html}
 */

/**
 * This is the main database object.
 * Models are stored here under the name given to sequelize.define.
 *
 * @namespace db
 * @type {Model[]}
 * @property {getInstance} instance - a fully configured Sequelize instance
 * @property {Sequelize} Sequelize - require('sequelize')
 * @see {@link https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html#instance-member-models}
 */
module.exports = db;
