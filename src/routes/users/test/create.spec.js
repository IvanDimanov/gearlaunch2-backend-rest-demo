const sinon = require('sinon');

const {HttpError} = require('../../../../utils/koa');
const {koaRouterRunner} = require('../../../../utils/testing');
const router = require('../create');

const apiMethod = 'POST';
const apiPath = '/api/accounts/v1/users';


describe(apiPath, () => {
  let layer;
  let emit;
  let ctx;
  let requestedUser;
  let createdUser;


  beforeEach(() => {
    layer = ((router || {}).stack || []).find(({path, methods}) => path === apiPath && methods.includes(apiMethod));
    emit = sinon.spy();

    const getDateWrap = (data) => ({
      ...data,
      get: () => ({...data}),
    });

    const country = {
      code: 11,
      name: 'test',
      continent_name: 'test',
    };

    requestedUser = {
      full_name: 'test',
      country_code: 20,
    };

    createdUser = {
      id: 1,
      created_at: '2020-01-01T00:00:00.000Z',
      ...requestedUser,
    };

    const countryFindOne = sinon.stub().returns(Promise.resolve(country));
    const usersCreate = sinon.stub().returns(Promise.resolve(getDateWrap(createdUser)));


    ctx = {
      app: {emit},
      request: {
        body: requestedUser,
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
          sequelize: {
            transaction: () => ({
              commit: () => {},
              rollback: () => {},
            }),
          },
          countries: {
            findOne: countryFindOne,
          },
          users: {
            create: usersCreate,
          },
        },
      },
    };
  });


  context('invalid requests', () => {
    it('should throw 404 with COUNTRY_NOT_FOUND when `country_code` prop is not in the DB', async () => {
      ctx.database.models.countries.findOne = sinon.stub().returns(Promise.resolve());

      let thrownError;

      try {
        await koaRouterRunner(layer.stack, ctx);
      } catch (error) {
        thrownError = error;
      }

      expect(thrownError).to.be.an.instanceof(HttpError);
      expect(thrownError.status).to.equal(404);
      expect(thrownError.code).to.equal('COUNTRY_NOT_FOUND');
    });


    it('should throw when saving in the DB throws', async () => {
      ctx.database.models.users.create = sinon.stub().throws('Error');

      let thrownError;

      try {
        await koaRouterRunner(layer.stack, ctx);
      } catch (error) {
        thrownError = error;
      }

      expect(thrownError).to.be.an.instanceof(Error);
    });
  });


  context('valid requests', () => {
    it('should work as expected with test data', async () => {
      await koaRouterRunner(layer.stack, ctx);

      expect(ctx.body).to.deep.equal(createdUser);
    });
  });
});
