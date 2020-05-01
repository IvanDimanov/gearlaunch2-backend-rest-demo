const sinon = require('sinon');

const {koaRouterRunner} = require('../../../../utils/testing');
const router = require('../ping');

const apiMethod = 'GET';
const apiPath = '/api/accounts/v1/status/ping';

describe(apiPath, () => {
  let layer;
  let emit;
  let ctx;

  beforeEach(() => {
    layer = ((router || {}).stack || []).find(({path, methods}) => path === apiPath && methods.includes(apiMethod));
    emit = sinon.spy();

    const query = sinon.stub().throws('error');

    ctx = {
      app: {emit},
      request: {},
      params: {},
      logger: {
        log: () => {},
        debug: () => {},
        info: () => {},
        warn: () => {},
        warning: () => {},
        danger: () => {},
        error: () => {},
      },
      state: {},
      database: {
        models: {
          sequelize: {
            authenticate: query,
            QueryTypes: {},
          },
        },
      },
    };
  });

  it('should not emit app error when user is not logged in', async () => {
    ctx.state = {};

    await koaRouterRunner(layer.stack, ctx);

    expect(emit.calledOnceWith('error')).to.equal(false);
  });

  it('should return a JSON with props "name" and "serverTime"', async () => {
    ctx.database.models.sequelize.authenticate = sinon.stub().returns(undefined);

    await koaRouterRunner(layer.stack, ctx);

    expect(typeof ctx.body).to.equal('object');
    expect(typeof ctx.body.name).to.equal('string');
    expect(typeof ctx.body.serverTime).to.equal('string');
    expect(ctx.body.isDbConnected).to.equal(true);
  });
});
