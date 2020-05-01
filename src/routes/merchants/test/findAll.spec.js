const sinon = require('sinon');

const {koaRouterRunner} = require('../../../../utils/testing');
const router = require('../findAll');

const apiMethod = 'GET';
const apiPath = '/api/accounts/v1/merchants';


describe(apiPath, () => {
  let layer;
  let emit;
  let ctx;
  let merchant;


  beforeEach(() => {
    layer = ((router || {}).stack || []).find(({path, methods}) => path === apiPath && methods.includes(apiMethod));
    emit = sinon.spy();

    merchant = {
      merchant_name: 'test',
      country_name: 20,
    };

    const merchantsFindAll = sinon.stub().returns(Promise.resolve([merchant]));


    ctx = {
      app: {emit},
      request: {
        query: {
          select: {},
        },
      },
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
          Sequelize: {
            Op: {},
          },
          merchants: {
            findAll: merchantsFindAll,
          },
        },
      },
    };
  });


  it('should work as expected with test data', async () => {
    await koaRouterRunner(layer.stack, ctx);

    expect(ctx.body).to.deep.equal([merchant]);
  });
});
