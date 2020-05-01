const {v4: uuidv4} = require('uuid');

/**
 * This middleware catches all thrown code error and
 * tries to return a proper error JSON response to the API call.
 *
 * @memberof koa
 * @param {Error} error The execution error that broke the script flow.
 * @param {object} ctx Koa context
 */
const onError = (error, ctx) => {
  const errorId = error.id || uuidv4();
  ctx.logger.error(error.stack, {errorId});

  ctx.status = error.status || 500;
  ctx.body = {
    errorId,
    errorCode: error.code || 'INTERNAL_ERROR',
    errorMessage: error.message || `Page ${ctx.request.method} ${ctx.request.url} failed`,
  };
};

module.exports = onError;
