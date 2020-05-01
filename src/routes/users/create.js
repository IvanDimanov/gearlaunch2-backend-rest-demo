const Router = require('koa-router');
const {
  HttpError,
  validator,
} = require('../../../utils/koa');

const {UserSchema} = require('../../validators/body');

const router = new Router();

/**
 * @swagger
 * /api/accounts/v1/users:
 *   post:
 *     tags:
 *       - Accounts
 *     summary: Create a User
 *     description: |
 *       Take the incoming POST Body and try to create a `User` entity out of it.
 *       This API will return the newly created `User` on success.
 *     operationId: createUser
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         in: body
 *         description: |
 *           The payload data for the `User` we want to create.
 *         schema:
 *           type: object
 *           required:
 *             - full_name
 *             - country_code
 *           properties:
 *             full_name:
 *               type: string
 *               minimum: 2
 *               example: John Smith
 *             country_code:
 *               type: integer
 *               minimum: 1
 *               example: 21
 *     responses:
 *       200:
 *         description: The newly created User
 *         schema:
 *           $ref: '#/definitions/DatabaseUser'
 *       400:
 *         $ref: '#/responses/InvalidRequest'
 *       404:
 *         description: Unable to find Country with the requested code.
 *         schema:
 *           $ref: '#/definitions/ResponseError'
 *         examples:
 *           application/json:
 *             errorId: a34f4558-1b88-47cd-8d63-ae4eaf038bd7
 *             errorCode: COUNTRY_NOT_FOUND
 *             errorMessage: Unable to find country
 *       500:
 *         $ref: '#/responses/AppNotFound'
 */
router.post('/api/accounts/v1/users',
    validator.body(UserSchema),

    async (ctx) => {
      const user = ctx.request.body;
      const {models} = ctx.database;

      const country = await models.countries.findOne({where: {
        code: user.country_code,
      }});

      if (!country) {
        throw new HttpError(
            404,
            'COUNTRY_NOT_FOUND',
            'Unable to find country'
        );
      }

      const transaction = await models.sequelize.transaction();
      try {
        const createdUser = await models.users.create(user, {
          returning: true,
          transaction,
        });

        await transaction.commit();
        ctx.body = createdUser.get({plain: true});
      } catch (error) {
        transaction.finished !== 'commit' && (await transaction.rollback());

        ctx.logger.error(`Unexpected error in createUser API`, error.stack);

        throw error;
      }
    }
);

module.exports = router;
