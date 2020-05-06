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
 *     summary: Find and count all Merchants
 *     description: |
 *       Returns a list of `Merchants` that matched the `select` criteria.
 *     operationId: findAndCountAllMerchants
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
 *           <br />
 *
 *           Whenever you fee like you want only a slice of the response you can apply pagination via the `$offset` and `$limit` props.
 *           For example, if you'd like to get page **3** of all `Merchants` with a maximum of **5** rows per page, you can submit this `select`:
 *           ```
 *           {
 *             "merchant_name": "",
 *             "$offset": 10,
 *             "$limit": 5
 *           }
 *           ```
 *           <br />
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
 *           <br />
 *
 *           Similarly, you can use the `"$order":[]` object to set a specific order of your results. The `$order` object is an array of rules that will be applied starting from the first rule in the array down to the last one.
 *
 *           For example, if you'd like to get a list of all `Merchants` ordered by country in "asc" direction but
 *           also sort their `Products` price in "desc" direction then you can submit this `select`:
 *           ```
 *           {
 *             "merchant_name": "",
 *             "country": {
 *               "name": ""
 *             },
 *             "products": {
 *               "price": ""
 *             },
 *             "$order": [
 *               ["country.name", "asc"],
 *               ["products.price", "desc"]
 *             ]
 *           }
 *           ```
 *           <br />
 *
 *         default:
 *           merchant_name: ''
 *
 *     responses:
 *       200:
 *         description: |
 *           `count` and `rows` response of `Merchants` that matched the request parameters.
 *         schema:
 *           type: object
 *           properties:
 *             count:
 *               type: number
 *               format: integer
 *               description: |
 *                 Total number of records that match the `select` criteria.
 *               example: 12
 *             rows:
 *               description: |
 *                 An array of `Merchants` that matched the request parameters.
 *               type: 'array'
 *               items:
 *                 $ref: '#/definitions/DatabaseMerchant'
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
      const merchants = await models.merchants.findAndCountAll(findOptions);

      ctx.body = merchants;
    }
);

module.exports = router;
