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
 * /api/products/v1/orders:
 *   get:
 *     tags:
 *       - Products
 *     summary: Find all Orders
 *     description: |
 *       This API returns a list of all `Orders` based on common `select` request.
 *     operationId: findAllOrders
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
 *           For example, if you'd like to get a list of all `Orders`, you can submit this `select`:
 *           ```
 *           {
 *             "status": ""
 *           }
 *           ```
 *
 *           Filtration is also supported with the special key of `"$where" :{}`. The `$where` object supports all comparison operators
 *           from Sequelize ORM https://sequelize.org/master/manual/model-querying-basics.html#operators. Please note that operations are prefixed, e.g. instead of `Op.eq` => `$eq`.
 *
 *           For example, if you'd like to get a list of all `Orders` with status `in_progress` that were bought by `Users` from Africa, you can submit this `select`:
 *           ```
 *           {
 *             "status": "",
 *             "$where": {
 *               "status": {
 *                 "$eq": "in_progress"
 *               }
 *             },
 *             "user": {
 *               "full_name": "",
 *               "country": {
 *                 "name": "",
 *                 "continent_name": "",
 *                 "$where": {
 *                   "continent_name": {
 *                     "$eq": "Africa"
 *                   }
 *                 }
 *               }
 *             }
 *           }
 *           ```
 *
 *         default:
 *           status: ''
 *     responses:
 *       200:
 *         description: |
 *           An array of `Orders` that matched the request parameters.
 *         schema:
 *           type: 'array'
 *           items:
 *             $ref: '#/definitions/DatabaseOrder'
 *       500:
 *         $ref: '#/responses/AppNotFound'
 */
router.get('/api/products/v1/orders',
    parseSelectFromQuery,
    validator.query(SelectSchema),

    async (ctx) => {
      const {select} = ctx.request.query;
      const {models} = ctx.database;
      const {Sequelize: {Op}} = models;

      const findOptions = getFindOptions({select, Op, getModelByName});
      const orders = await models.orders.findAll(findOptions);

      ctx.body = orders;
    }
);

module.exports = router;
