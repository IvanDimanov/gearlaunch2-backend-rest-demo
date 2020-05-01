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
 * /api/products/v1/order_items:
 *   get:
 *     tags:
 *       - Products
 *     summary: Find all OrderItems
 *     description: |
 *       This API returns a list of all `OrderItems` based on common `select` request.
 *     operationId: findAllOrderItems
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
 *           For example, if you'd like to get a list of all `OrderItems`, you can submit this `select`:
 *           ```
 *           {
 *             "quantity": ""
 *           }
 *           ```
 *
 *           Filtration is also supported with the special key of `"$where" :{}`. The `$where` object supports all comparison operators
 *           from Sequelize ORM https://sequelize.org/master/manual/model-querying-basics.html#operators. Please note that operations are prefixed, e.g. instead of `Op.eq` => `$op`.
 *
 *           For example, if you'd like to get a list of all `OrderItems` that are `in_progress` for all buyer `Users` in Africa, you can submit this `select`:
 *           ```
 *           {
 *             "quantity": "",
 *             "product": {
 *               "name": ""
 *             },
 *             "order": {
 *               "status": "",
 *               "$where": {
 *                 "status": {
 *                   "$eq": "in_progress"
 *                 }
 *               },
 *               "user": {
 *                 "full_name": "",
 *                 "country": {
 *                   "name": "",
 *                   "continent_name": "",
 *                   "$where": {
 *                     "continent_name": {
 *                       "$eq": "Africa"
 *                     }
 *                   }
 *                 }
 *               }
 *             }
 *           }
 *           ```
 *
 *         default:
 *           quantity: ''
 *     responses:
 *       200:
 *         description: |
 *           An array of `OrderItems` that matched the request parameters.
 *         schema:
 *           type: 'array'
 *           items:
 *             $ref: '#/definitions/DatabaseOrderItem'
 *       500:
 *         $ref: '#/responses/AppNotFound'
 */
router.get('/api/products/v1/order_items',
    parseSelectFromQuery,
    validator.query(SelectSchema),

    async (ctx) => {
      const {select} = ctx.request.query;
      const {models} = ctx.database;
      const {Sequelize: {Op}} = models;

      const findOptions = getFindOptions({select, Op, getModelByName});
      const orderItems = await models.order_items.findAll(findOptions);

      ctx.body = orderItems;
    }
);

module.exports = router;
