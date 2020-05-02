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
 * /api/accounts/v1/merchants:
 *   get:
 *     tags:
 *       - Accounts
 *     summary: Find all Merchants
 *     description: |
 *       This API returns a list of all `Merchants` based on common `select` request.
 *     operationId: findAllMerchants
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
 *           For example, if you'd like to get a list of all `Merchants`, you can submit this `select`:
 *           ```
 *           {
 *             "merchant_name": ""
 *           }
 *           ```
 *
 *           Filtration is also supported with the special key of `"$where":{}`. The `$where` object supports all comparison operators
 *           from Sequelize ORM https://sequelize.org/master/manual/model-querying-basics.html#operators. Please note that operations are prefixed, e.g. instead of `Op.eq` => `$eq`.
 *
 *           For example, if you'd like to get a list of all `Merchants` within the continent of `Africa`, you can submit this `select`:
 *           ```
 *           {
 *             "merchant_name": "",
 *             "country": {
 *               "name": "",
 *               "continent_name": "",
 *               "$where": {
 *                 "continent_name": {
 *                   "$eq": "Africa"
 *                 }
 *               }
 *             }
 *           }
 *           ```
 *
 *         default:
 *           merchant_name: ''
 *     responses:
 *       200:
 *         description: |
 *           An array of `Merchants` that matched the request parameters.
 *         schema:
 *           type: 'array'
 *           items:
 *             $ref: '#/definitions/DatabaseMerchant'
 *       500:
 *         $ref: '#/responses/AppNotFound'
 */
router.get('/api/accounts/v1/merchants',
    parseSelectFromQuery,
    validator.query(SelectSchema),

    async (ctx) => {
      const {select} = ctx.request.query;
      const {models} = ctx.database;
      const {Sequelize: {Op}} = models;

      const findOptions = getFindOptions({select, Op, getModelByName});
      const merchants = await models.merchants.findAll(findOptions);

      ctx.body = merchants;
    }
);

module.exports = router;
