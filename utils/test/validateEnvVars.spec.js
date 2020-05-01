const {validateEnvVars} = require('../validateEnvVars');

describe('/utils/validateEnvVars()', () => {
  beforeEach(() => {
    process.env = {
      NODE_ENV: 'test',
      PORT: 8000,
      DB_NAME: 'test',
      DB_DIALECT: 'postgres',
      DB_URL:
        'postgres://postgres:postgres@localhost:5432/gearlaunch',
      DB_CONNECTION_POOL_MAX: 5,
      DB_CONNECTION_POOL_MIN: 1,
      DB_CONNECTION_POOL_IDLE: 1,
      DB_CONNECTION_POOL_ACQUIRE: 1,
      DB_CONNECTION_POOL_EVICT: 1,
      ALLOW_CORS: true,
      SWAGGER_HOST: 'localhost:3000',
    };
  });

  it('should resolve with error on invalid "DB_URL" in `process.env`', () => {
    process.env.DB_URL = '';

    const {error} = validateEnvVars();

    expect(typeof error).to.equal('object');
    expect(Array.isArray(error.details)).to.equal(true);

    const matchedError = error.details.find(({message}) =>
      message.includes('DB_URL')
    );
    expect(typeof matchedError).to.equal('object');
  });

  it('should save only validated ENV VARs in `process.env`', () => {
    process.env.DANGEROUS_UNKNOWN_VAR = 'test';

    const {error} = validateEnvVars();

    expect(error).to.equal(undefined);
    expect(process.env.DANGEROUS_UNKNOWN_VAR).to.equal(undefined);
  });

  it('should resolve with no errors on valid `process.env`', () => {
    const {error} = validateEnvVars();

    expect(error).to.equal(undefined);
  });
});
