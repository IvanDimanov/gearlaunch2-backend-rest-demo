'use strict';

const path = require('path');
const {validateEnvVars} = require('../utils/validateEnvVars');
const {error} = validateEnvVars();
/* istanbul ignore next: because this involves killing the test if a ENV VAR is missing or invalid */
if (error) {
  process.stderr.write(`Invalid ENV VAR:
${error.details
      .map(({message, context}) => `  ${message}; currently ${context.key}=${context.value}`)
      .join('\n')}
\n`,
  );
  process.exit(1);
}

const Koa = require('koa');
const koaBody = require('koa-body');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');

const catchError = require('../utils/koa/catchError');
const logger = require('../utils/koa/logger');
const notFound = require('../utils/koa/notFound');
const onError = require('../utils/koa/onError');
const applyAllRoutes = require('../utils/koa/applyAllRoutes');

const models = require('../database/models');

const getPort = () => process.env.PORT || 8000;

/**
 * Creates the main Koa app with all middlewares, APIs, logging, and error handling.
 *
 * @returns {object} Instance of Koa
 */
function createApp() {
  const app = new Koa();

  /* Provide access to PostgreSQL and ElasticSearch DB to all API routes */
  app.context.database = {
    models,
  };


  app
      .use(helmet())
      .use(catchError())
      .use(logger)
      .use(koaBody({
        formLimit: '100mb',
        multipart: true,
      }));

  if (process.env.ALLOW_CORS) {
    app.use(cors({
      exposeHeaders: ['authorization'],
    }));
  }

  applyAllRoutes(app, path.join(__dirname, '/', 'routes'));

  app
      .use(notFound)
      .on('error', onError);

  return app;
}

/* Check if this file is called for starting the app or called as additional module to already started app */
/* istanbul ignore next: because this involves loading file via `require` or executing the file directly from the terminal */
if (process.env.NODE_ENV === 'test') {
  module.exports = {
    createApp,
    getPort,
  };
} else {
  const server = createApp().listen(getPort(), () => {
    process.stdout.write(`Server listening on ${JSON.stringify(server.address())}\n`);
  });
}

/**
 * @swagger
 * definitions:
 *   ResponseError:
 *     type: object
 *     description: |
 *       Schema for `4XX` server error response body.
 *       Response includes a UUIDv4, error code and message body.
 *     properties:
 *       errorId:
 *         type: string
 *         format: uuid
 *         example: a34f4558-1b88-47cd-8d63-ae4eaf038bd7
 *       errorCode:
 *         type: string
 *         example: GENERIC_SERVER_ERROR
 *       errorMessage:
 *         type: string
 *         example: Generic server error
 *     required:
 *       - errorId
 *       - errorCode
 *       - errorMessage
 *
 * parameters:
 *   PaginationLimit:
 *     in: query
 *     name: pageSize
 *     type: integer
 *     minimum: 2
 *     maximum: 100
 *     default: 10
 *     description: |
 *       The `number` of items to retrieve in a listing.
 *
 *   PaginationOffset:
 *     in: query
 *     name: pageNumber
 *     type: integer
 *     minimum: 1
 *     default: 1
 *     description: |
 *       The `page` of items to retrieve in a listing.
 *
 *   SortingKey:
 *     in: query
 *     name: sortKey
 *     type: array
 *     items:
 *       type: string
 *     minItems: 1
 *     uniqueItems: true
 *     default: [created_at]
 *     description: |
 *       An array of table fields to sort a listing by.
 *       Possible values limited to Model fields.
 *
 *   SortingDirection:
 *     in: query
 *     name: sortOrder
 *     type: array
 *     items:
 *       type: string
 *     minItems: 1
 *     default: [asc]
 *     description: |
 *       An array of table fields to sort a listing by.
 *       Possible values limited to `asc` and `desc`.
 *
 *   PathUniqueIdentifier:
 *     in: path
 *     name: id
 *     type: number
 *     format: integer
 *     required: true
 *     description: |
 *       The `id` property of the entity we want to retrieve.
 *
 *   QueryUniqueIdentifierV4:
 *     in: query
 *     name: id
 *     type: string
 *     format: uuid
 *     required: true
 *     description: |
 *       The string literal `UUIDv4` of the Entity we want to retrieve.
 *
 *   withProductCategoriesAssociation:
 *     in: query
 *     name: withProductCategories
 *     type: boolean
 *     default: true
 *     description: |
 *       Optional boolean flag that can be `true` or `false`.
 *       Indicates whether we should attach a `ProductCategories` association to the query.
 *
 *   withProductClassAssociation:
 *     in: query
 *     name: withProductClass
 *     type: boolean
 *     default: false
 *     description: |
 *       Optional boolean flag that can be `true` or `false`.
 *       Indicates whether we should attach a `ProductClasses` association to the query.
 *
 *   withProductTypeAssociation:
 *     in: query
 *     name: withProductType
 *     type: boolean
 *     default: false
 *     description: |
 *       Optional boolean flag that can be `true` or `false`.
 *       Indicates whether we should attach the `ProductType` association to the query.
 *
 *   withContainerAssociation:
 *     in: query
 *     name: withContainer
 *     type: boolean
 *     default: false
 *     description: |
 *       Optional boolean flag that can be `true` or `false`.
 *       Indicates whether we should attach the `Container` association to the query.
 *
 *   withCurrentAddressAssociation:
 *     in: query
 *     name: withCurrentAddress
 *     type: boolean
 *     default: false
 *     description: |
 *       Optional boolean flag that can be `true` or `false`.
 *       Indicates whether we should attach the current `Address` association to the query.
 *
 *   withOriginAddressAssociation:
 *     in: query
 *     name: withOriginAddress
 *     type: boolean
 *     default: false
 *     description: |
 *       Optional boolean flag that can be `true` or `false`.
 *       Indicates whether we should attach the origin `Address` association to the query.
 *
 *   withUserAssociation:
 *     in: query
 *     name: withUser
 *     type: boolean
 *     default: false
 *     description: |
 *       Optional boolean flag that can be `true` or `false`.
 *       Indicates whether we should attach the owner `User` association to the query.
 *
 *   withSaleListingAssociation:
 *     in: query
 *     name: withSaleListing
 *     type: boolean
 *     default: false
 *     description: |
 *       Optional boolean flag that can be `true` or `false`.
 *       Indicates whether we should attach the owner `SaleListing` association to the query.
 *
 *   withSaleListingIngredientsAssociation:
 *     in: query
 *     name: withSaleListingIngredients
 *     type: boolean
 *     default: false
 *     description: |
 *       Optional boolean flag that can be `true` or `false`.
 *       Indicates whether we should attach the `Ingredients` association to the `SaleListing` object in query.
 *
 *   withSaleListingProductTypeAssociation:
 *     in: query
 *     name: withSaleListingProductType
 *     type: boolean
 *     default: false
 *     description: |
 *       Optional boolean flag that can be `true` or `false`.
 *       Indicates whether we should attach the `ProductType` association to the `SaleListing` object in query.
 *
 *   withSaleListingContainerAssociation:
 *     in: query
 *     name: withSaleListingContainer
 *     type: boolean
 *     default: false
 *     description: |
 *       Optional boolean flag that can be `true` or `false`.
 *       Indicates whether we should attach the `Container` association to the `SaleListing` object in query.
 *
 *   withSaleListingOriginAddressAssociation:
 *     in: query
 *     name: withSaleListingOriginAddress
 *     type: boolean
 *     default: false
 *     description: |
 *       Optional boolean flag that can be `true` or `false`.
 *       Indicates whether we should attach the origin `Address` association to the `SaleListing` object in query.
 *
 *   withSaleListingCurrentAddressAssociation:
 *     in: query
 *     name: withSaleListingCurrentAddress
 *     type: boolean
 *     default: false
 *     description: |
 *       Optional boolean flag that can be `true` or `false`.
 *       Indicates whether we should attach the current `Address` association to the `SaleListing` object in query.
 *
 *   withSampleAssociation:
 *     in: query
 *     name: withSample
 *     type: boolean
 *     default: false
 *     description: |
 *       Optional boolean flag that can be `true` or `false`.
 *       Indicates whether we should attach the `Sample` association to the `Bid` object.
 *
 *   withBidsAssociation:
 *     in: query
 *     name: withBids
 *     type: boolean
 *     default: false
 *     description: |
 *       Optional boolean flag that can be `true` or `false`.
 *       Indicates whether we should attach the existing `Bids` a `SaleListing` has.
 *
 *   withInvoicesAssociation:
 *     in: query
 *     name: withInvoices
 *     type: boolean
 *     default: false
 *     description: |
 *       Optional boolean flag that can be `true` or `false`.
 *       Indicates whether we should attach the existing `SaleListingInvoice` a `SaleListing` has.
 *
 * responses:
 *   InvalidRequest:
 *     description: |
 *       Invalid parameters sent to the server.
 *     schema:
 *       $ref: '#/definitions/ResponseError'
 *     examples:
 *       application/json:
 *         errorId: a34f4558-1b88-47cd-8d63-ae4eaf038bd7
 *         errorCode: REQUEST_VALIDATION_ERROR
 *         errorMessage: Missing request "${type}"
 *
 *   AppNotFound:
 *     description: |
 *       Some unexpected issue occurred and crashed the app.
 *     schema:
 *       $ref: '#/definitions/ResponseError'
 *     examples:
 *       application/json:
 *         errorId: a34f4558-1b88-47cd-8d63-ae4eaf038bd7
 *         errorCode: INTERNAL_SERVER_ERROR
 *         errorMessage: Internal server error
 */
