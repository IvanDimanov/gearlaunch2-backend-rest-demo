const sinon = require('sinon');

const {koaRouterRunner} = require('../../../../utils/testing');
const router = require('../findAndCountAll');

const apiMethod = 'GET';
const apiPath = '/api/accounts/v1/countries';


describe(apiPath, () => {
  let layer;
  let emit;
  let ctx;
  let country;


  beforeEach(() => {
    layer = ((router || {}).stack || []).find(({path, methods}) => path === apiPath && methods.includes(apiMethod));
    emit = sinon.spy();

    country = {
      code: 20,
      name: 'test',
      continent_name: 'test',
    };

    const countriesFindAndCountAll = sinon.stub().returns(Promise.resolve({
      count: 1,
      rows: [country],
    }));


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
          countries: {
            findAndCountAll: countriesFindAndCountAll,
          },
        },
      },
    };
  });


  it('should work as expected with test data', async () => {
    await koaRouterRunner(layer.stack, ctx);

    expect(ctx.body).to.deep.equal({
      count: 1,
      rows: [country],
    });
  });
});
