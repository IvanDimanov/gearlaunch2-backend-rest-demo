const sinon = require('sinon');

const {HttpError} = require('../../../../utils/koa');
const {koaRouterRunner} = require('../../../../utils/testing');
const router = require('../findOne');

const apiMethod = 'GET';
const apiPath = '/api/accounts/v1/users/:id';


describe(apiPath, () => {
  let layer;
  let emit;
  let ctx;
  let user;


  beforeEach(() => {
    layer = ((router || {}).stack || []).find(({path, methods}) => path === apiPath && methods.includes(apiMethod));
    emit = sinon.spy();

    const getDateWrap = (data) => ({
      ...data,
      get: () => ({...data}),
    });

    user = {
      id: 1,
      full_name: 'test',
      country_code: 20,
      created_at: '2020-01-01T00:00:00.000Z',
    };

    const usersFindOne = sinon.stub().returns(Promise.resolve(getDateWrap(user)));


    ctx = {
      app: {emit},
      request: {
        query: {
          select: {},
        },
      },
      params: {
        id: 1,
      },
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
            findOne: usersFindOne,
          },
        },
      },
    };
  });


  context('invalid requests', () => {
    it('should throw 404 with USER_NOT_FOUND `country_code` prop is not in the DB', async () => {
      ctx.database.models.users.findOne = sinon.stub().returns(Promise.resolve());

      let thrownError;

      try {
        await koaRouterRunner(layer.stack, ctx);
      } catch (error) {
        thrownError = error;
      }

      expect(thrownError).to.be.an.instanceof(HttpError);
      expect(thrownError.status).to.equal(404);
      expect(thrownError.code).to.equal('USER_NOT_FOUND');
    });
  });


  context('valid requests', () => {
    it('should work as expected with test data', async () => {
      await koaRouterRunner(layer.stack, ctx);

      expect(ctx.body).to.deep.equal(user);
    });
  });
});
