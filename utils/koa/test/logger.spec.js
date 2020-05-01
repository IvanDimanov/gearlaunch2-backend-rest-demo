const sinon = require('sinon');
const logger = require('../logger');

describe('/koa/logger', () => {
  let stdoutMock;

  beforeEach(() => {
    stdoutMock = sinon.mock(process.stdout);
  });

  afterEach(() => {
    stdoutMock.verify();
    stdoutMock.restore();
  });

  it('should return a {Function}', () => {
    expect(logger).to.be.an.instanceof(Function);
  });

  it('should call `next()`', async () => {
    const next = sinon.spy();
    const ctx = {
      response: '',
      res: {
        once: () => {},
        removeListener: () => {},
      },
    };

    await logger(ctx, next);

    expect(next.calledOnce).to.equal(true);
  });

  it('should write messages', async () => {
    const next = sinon.spy();
    const ctx = {
      response: '',
      res: {
        once: () => {},
        removeListener: () => {},
      },
    };

    await logger(ctx, next);

    stdoutMock.expects('write').once();
  });

  it('should set `logger` property to context', async () => {
    const next = sinon.spy();
    const ctx = {
      response: '',
      res: {
        once: () => {},
        removeListener: () => {},
      },
    };

    await logger(ctx, next);

    expect(ctx.logger).to.be.a('object');
  });

  it('should set `logger.debug()` to context', async () => {
    const next = sinon.spy();
    const ctx = {
      response: '',
      res: {
        once: () => {},
        removeListener: () => {},
      },
    };

    await logger(ctx, next);

    expect(ctx.logger.debug).to.be.a('function');
  });

  it('should set `logger.info()` to context', async () => {
    const next = sinon.spy();
    const ctx = {
      response: '',
      res: {
        once: () => {},
        removeListener: () => {},
      },
    };

    await logger(ctx, next);

    expect(ctx.logger.info).to.be.a('function');
  });

  it('should set `logger.error()` to context', async () => {
    const next = sinon.spy();
    const ctx = {
      response: '',
      res: {
        once: () => {},
        removeListener: () => {},
      },
    };

    await logger(ctx, next);

    expect(ctx.logger.error).to.be.a('function');
  });

  describe('ctx.logger.error()', () => {
    it('should not throw with no arguments', async () => {
      const next = sinon.spy();
      const ctx = {
        response: '',
        res: {
          once: () => {},
          removeListener: () => {},
        },
      };

      await logger(ctx, next);

      expect(() => ctx.logger.error()).to.not.throw();
    });
  });
});
