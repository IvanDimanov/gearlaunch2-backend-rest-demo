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
 * /api/products/v1/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Find all Products
 *     description: |
 *       This API returns a list of all `Products` based on common `select` request.
 *     operationId: findAllProducts
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
 *           For example, if you'd like to get a list of all `Products`, you can submit this `select`:
 *           ```
 *           {
 *             "name": ""
 *           }
 *           ```
 *
 *           Filtration is also supported with the special key of `"$where":{}`. The `$where` object supports all comparison operators
 *           from Sequelize ORM https://sequelize.org/master/manual/model-querying-basics.html#operators. Please note that operations are prefixed, e.g. instead of `Op.eq` => `$eq`.
 *
 *           For example, if you'd like to get a list of all `Products` with status `in_stock` that were created by `Merchants` from Africa, you can submit this `select`:
 *           ```
 *           {
 *             "name": "",
 *             "status": "",
 *             "$where": {
 *               "status": {
 *                 "$eq": "in_stock"
 *               }
 *             },
 *             "merchant": {
 *               "merchant_name": "",
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
 *           name: ''
 *     responses:
 *       200:
 *         description: |
 *           An array of `Products` that matched the request parameters.
 *         schema:
 *           type: 'array'
 *           items:
 *             $ref: '#/definitions/DatabaseProduct'
 *       500:
 *         $ref: '#/responses/AppNotFound'
 */
router.get('/api/products/v1/products',
    parseSelectFromQuery,
    validator.query(SelectSchema),

    async (ctx) => {
      const {select} = ctx.request.query;
      const {models} = ctx.database;
      const {Sequelize: {Op}} = models;

      const findOptions = getFindOptions({select, Op, getModelByName});
      const products = await models.products.findAll(findOptions);

      ctx.body = products;
    }
);

module.exports = router;
