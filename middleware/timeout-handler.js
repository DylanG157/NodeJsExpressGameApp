import timeout from 'connect-timeout';

const haltOnTimedout = (req, res, next) => {
  if (!req.timedout) {
    next();
  }
};

const timeout120 = timeout(120000);

export { haltOnTimedout, timeout120 };