const getInclude = (select, getFindOptions, Op, getModelByName) => {
  if (!select || !Object.keys(select)) {
    return undefined;
  }

  const relatedModels = Object.keys(select)
      .filter((key) => !key.startsWith('$')) // Used for keys like '$where'
      .filter((key) => typeof select[key] === 'object');

  if (!relatedModels.length) {
    return undefined;
  }

  return relatedModels
      .map((modelName) => {
        const options = getFindOptions({select: select[modelName], Op, getModelByName});

        return {
          model: getModelByName(modelName),
          as: modelName,
          required: true,

          /**
           * If the top `select` wants to use `$limit`
           * then we need to `duplicating: false` as described here:
           * https://github.com/sequelize/sequelize/issues/4446#issuecomment-138288921
           */
          duplicating: false,

          ...options,
        };
      });
};


module.exports = getInclude;
