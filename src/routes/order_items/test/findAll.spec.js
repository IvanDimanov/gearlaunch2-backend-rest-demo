const sinon = require('sinon');

const {koaRouterRunner} = require('../../../../utils/testing');
const router = require('../findAll');

const apiMethod = 'GET';
const apiPath = '/api/products/v1/order_items';


describe(apiPath, () => {
  let layer;
  let emit;
  let ctx;
  let orderItem;


  beforeEach(() => {
    layer = ((router || {}).stack || []).find(({path, methods}) => path === apiPath && methods.includes(apiMethod));
    emit = sinon.spy();

    orderItem = {
      id: 11,
      quantity: 20,
    };

    const orderItemsFindAll = sinon.stub().returns(Promise.resolve([orderItem]));


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
          order_items: {
            findAll: orderItemsFindAll,
          },
        },
      },
    };
  });


  it('should work as expected with test data', async () => {
    await koaRouterRunner(layer.stack, ctx);

    expect(ctx.body).to.deep.equal([orderItem]);
  });
});
