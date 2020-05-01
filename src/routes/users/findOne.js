const Router = require('koa-router');
const router = new Router();

const {
  HttpError,
  parseSelectFromQuery,
  validator,
} = require('../../../utils/koa');

const {SelectSchema, IDSchema} = require('../../validators/params');

const getModelByName = require('../../../utils/query/getModelByName');
const getFindOptions = require('../../../utils/query/getFindOptions');

/**
 * @swagger
 * /api/accounts/v1/users/{id}:
 *   get:
 *     tags:
 *       - Accounts
 *     summary: Find one User
 *     description: |
 *       This API returns a single one `User` based on common `select` request
 *       and the `id` URL param
 *     operationId: findOneUser
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#/parameters/PathUniqueIdentifier'
 *       - name: select
 *         in: query
 *         type: object
 *         description: |
 *           The `select` query object is used to point what data the API need to return.
 *           Adding a property to the `select` object will return the corresponding data.
 *
 *           For example, if you'd like to get the `User` full name, you can submit this `select`:
 *           ```
 *           {
 *             "full_name": ""
 *           }
 *           ```
 *
 *           Filtration is also supported with the special key of `"$where" :{}`. The `$where` object supports all comparison operators
 *           from Sequelize ORM https://sequelize.org/master/manual/model-querying-basics.html#operators. Please note that operations are prefixed, e.g. instead of `Op.eq` => `$op`.
 *
 *           For example, if you'd like to get a list of all `Products` a specific `User` bought around Christmas, you can submit this `select`:
 *           ```
 *           {
 *             "full_name": "",
 *             "orders": {
 *               "created_at": "",
 *               "$where": {
 *                 "created_at": {
 *                   "$and": [
 *                     {"$gt": "2019-12-10T00:00:00.000Z"},
 *                     {"$lt": "2019-12-27T00:00:00.000Z"}
 *                   ]
 *                 }
 *               },
 *               "order_items": {
 *                 "quantity": "",
 *                 "product": {
 *                   "name": ""
 *                 }
 *               }
 *             }
 *           }
 *           ```
 *
 *         default:
 *           full_name: ''
 *     responses:
 *       200:
 *         description: |
 *           Single one `Users` that matched the request parameters.
 *         schema:
 *           $ref: '#/definitions/DatabaseUser'
 *       404:
 *         description: Unable to find User with the requested params.
 *         schema:
 *           $ref: '#/definitions/ResponseError'
 *         examples:
 *           application/json:
 *             errorId: a34f4558-1b88-47cd-8d63-ae4eaf038bd7
 *             errorCode: USER_NOT_FOUND
 *             errorMessage: Unable to find user
 *       500:
 *         $ref: '#/responses/AppNotFound'
 */
router.get('/api/accounts/v1/users/:id',
    parseSelectFromQuery,
    validator.query(SelectSchema),
    validator.params(IDSchema),

    async (ctx) => {
      const {id} = ctx.params;
      let {select} = ctx.request.query;

      const {models} = ctx.database;
      const {Sequelize: {Op}} = models;

      select = {
        ...select,
        '$where': {
          ...select['$where'],
          id: {
            '$eq': id,
          },
        },
      };

      const findOptions = getFindOptions({select, Op, getModelByName});
      const user = await models.users.findOne(findOptions);

      if (!user) {
        throw new HttpError(
            404,
            'USER_NOT_FOUND',
            'Unable to find user'
        );
      }

      ctx.body = user.get({plain: true});
    }
);

module.exports = router;
