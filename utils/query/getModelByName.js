const models = require('../../database/models');

/**
 * TODO: This array of names can be calculated and returned from here:
 * database/config/sequelize-pool.js
 *
 * like:
 *  module.exports = {
 *    Sequelize,
 *    getInstance,
 *    getModelByName,   // <= Newly added
 *  };
 */
const nameToModel = Object.keys(models)
    .map((key) => models[key])
    .filter(({options: {name} = {}}) => name)
    .reduce((map, model) => ({
      ...map,
      [model.options.name.plural]: model,
      [model.options.name.singular]: model,
    }), {});

const getModelByName = (name) => nameToModel[name];

module.exports = getModelByName;
