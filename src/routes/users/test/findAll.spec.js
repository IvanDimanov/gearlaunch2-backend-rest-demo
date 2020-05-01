const sinon = require('sinon');

const {koaRouterRunner} = require('../../../../utils/testing');
const router = require('../findAll');

const apiMethod = 'GET';
const apiPath = '/api/accounts/v1/users';


describe(apiPath, () => {
  let layer;
  let emit;
  let ctx;
  let user;


  beforeEach(() => {
    layer = ((router || {}).stack || []).find(({path, methods}) => path === apiPath && methods.includes(apiMethod));
    emit = sinon.spy();

    user = {
      id: 1,
      full_name: 'test',
      country_code: 20,
      created_at: '2020-01-01T00:00:00.000Z',
    };

    const usersFindAll = sinon.stub().returns(Promise.resolve([user]));


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
          users: {
            findAll: usersFindAll,
          },
        },
      },
    };
  });


  it('should work as expected with test data', async () => {
    await koaRouterRunner(layer.stack, ctx);

    expect(ctx.body).to.deep.equal([user]);
  });
});
