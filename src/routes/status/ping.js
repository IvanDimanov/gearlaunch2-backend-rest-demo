const Router = require('koa-router');
const router = new Router();

/**
 * @swagger
 * /api/accounts/v1/status/ping:
 *   get:
 *     tags:
 *       - Status
 *     summary: Checks latency between the client and API server
 *     description: |
 *       Common ping test to check if `Accounts BackEnd` is still alive.
 *     operationId: getServiceStatus
 *     produces:
 *       - application/json
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
router.get('/api/accounts/v1/status/ping',
    async (ctx) => {
      const sequelize = ctx.database.models.sequelize;
      let isDbConnected = true;

      try {
        await sequelize.authenticate();
      } catch (error) {
        isDbConnected = false;
      }

      ctx.body = {
        name: 'BackEnd Accounts',
        serverTime: new Date().toISOString(),
        isDbConnected,
      };
    }
);

module.exports = router;
