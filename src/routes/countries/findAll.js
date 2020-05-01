const Router = require('koa-router');
const router = new Router();
const {
  parseSelectFromQuery,
  validator,
} = require('../../../utils/koa');

const {SelectSchema} = require('../../validators/params');

const getModelByName = require('../../../utils/query/getModelByName');
const getFindOptions = require('../../../utils/query/getFindOptions');

/**
 * @swagger
 * /api/accounts/v1/countries:
 *   get:
 *     tags:
 *       - Accounts
 *     summary: Find all Countries
 *     description: |
 *       This API returns a list of all `Countries` based on common `select` request.
 *     operationId: findAllCountries
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: select
 *         in: query
 *         type: object
 *         description: |
 *           The `select` query object is used to point what data the API need to return.
 *           Adding a property to the `select` object will return the corresponding data.
 *
 *           For example, if you'd like to get a list of all `Countries` with their continent, you can submit this `select`:
 *           ```
 *           {
 *             "name": "",
 *             "continent_name": ""
 *           }
 *           ```
 *
 *           Filtration is also supported with the special key of `"$where" :{}`. The `$where` object supports all comparison operators
 *           from Sequelize ORM https://sequelize.org/master/manual/model-querying-basics.html#operators. Please note that operations are prefixed, e.g. instead of `Op.eq` => `$op`.
 *
 *           For example, if you'd like to get a list of all `Countries` within the continent of `Africa`, you can submit this `select`:
 *           ```
 *           {
 *             "name": "",
 *             "$where": {
 *               "continent_name": {
 *                 "$eq": "Africa"
 *               }
 *             }
 *           }
 *           ```
 *
 *         default:
 *           code: ''
 *           name: ''
 *     responses:
 *       200:
 *         description: |
 *           An array of `Countries` that matched the request parameters.
 *         schema:
 *           type: 'array'
 *           items:
 *             $ref: '#/definitions/DatabaseCountry'
 *       500:
 *         $ref: '#/responses/AppNotFound'
 */
router.get('/api/accounts/v1/countries',
    parseSelectFromQuery,
    validator.query(SelectSchema),

    async (ctx) => {
      const {select} = ctx.request.query;
      const {models} = ctx.database;
      const {Sequelize: {Op}} = models;

      const findOptions = getFindOptions({select, Op, getModelByName});
      const countries = await models.countries.findAll(findOptions);

      ctx.body = countries;
    }
);

module.exports = router;
