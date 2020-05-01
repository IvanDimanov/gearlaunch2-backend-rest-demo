const Joi = require('@hapi/joi');

/**
 * This validation schema is used when we send params in the form of:
 *  {
 *     "select": {
 *       "full_name": "",
 *       "country": {}
 *     }
 *  }
 */
const SelectSchema = Joi.object()
    .keys({
      select: Joi.object().default({}),
    });

module.exports = SelectSchema;
