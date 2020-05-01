const sinon = require('sinon');

const {koaRouterRunner} = require('../../../../utils/testing');
const router = require('../findAll');

const apiMethod = 'GET';
const apiPath = '/api/products/v1/products';


describe(apiPath, () => {
  let layer;
  let emit;
  let ctx;
  let product;


  beforeEach(() => {
    layer = ((router || {}).stack || []).find(({path, methods}) => path === apiPath && methods.includes(apiMethod));
    emit = sinon.spy();

    product = {
      name: 'test',
      price: 20,
      status: 'in_stock',
    };

    const productsFindAll = sinon.stub().returns(Promise.resolve([product]));


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
          products: {
            findAll: productsFindAll,
          },
        },
      },
    };
  });


  it('should work as expected with test data', async () => {
    await koaRouterRunner(layer.stack, ctx);

    expect(ctx.body).to.deep.equal([product]);
  });
});
