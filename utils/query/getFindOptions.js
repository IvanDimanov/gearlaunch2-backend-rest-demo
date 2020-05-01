const getAttributes = require('./getAttributes');
const getInclude = require('./getInclude');
const getWhere = require('./getWhere');


const getFindOptions = ({select = {}, pagination = {}, Op, getModelByName}) => {
  const options = {
    ...pagination,
  };

  const attributes = getAttributes(select);
  if (attributes) {
    options.attributes = attributes;
  }

  const include = getInclude(select, getFindOptions, Op, getModelByName);
  if (include) {
    options.include = include;
  }

  const where = getWhere(select['$where'], Op);
  if (where) {
    options.where = where;
    options.required = 1;
  }

  return options;
};


module.exports = getFindOptions;
