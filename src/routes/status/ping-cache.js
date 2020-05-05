const Router = require('koa-router');
const router = new Router();

const validator = require('../../../utils/koa/validator');
const {CacheInSecondsSchema} = require('../../validators/params');

/**
 * @swagger
 * /api/accounts/v1/status/ping-cache:
 *   get:
 *     tags:
 *       - Status
 *     summary: Cached ping check
 *     description: |
 *       Common ping test to check if `Accounts BackEnd` is still alive.
 *       You can test caching by sending the `cacheInSeconds` param.
 *     operationId: getCachedServiceStatus
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: cacheInSeconds
 *         type: number
 *         example: 10
 *         default: 10
 *         description: |
 *           Tell Varnish how much time to keep this API response in cache.
 *     responses:
 *       200:
 *         description: General info about the Server.
 *         properties:
 *           name:
 *             type: string
 *             example: BackEnd Accounts
 *             description: A distinctive name of the current Accounts server.
 *           serverTime:
 *             type: string
 *             example: 2019-09-24T17:43:21.142Z
 *             description: Server ISO time.
 *       500:
 *         $ref: '#/responses/AppNotFound'
 */
router.get('/api/accounts/v1/status/ping-cache',
    validator.params(CacheInSecondsSchema),

    async (ctx) => {
      const {cacheInSeconds} = ctx.params;
      const sequelize = ctx.database.models.sequelize;
      let isDbConnected = true;

      try {
        await sequelize.authenticate();
      } catch (error) {
        isDbConnected = false;
      }

      ctx.set({
        'x-cache-ttl': `${cacheInSeconds}s`,
      });

      ctx.body = {
        name: 'BackEnd Accounts',
        serverTime: new Date().toISOString(),
        isDbConnected,
      };
    }
);

module.exports = router;
