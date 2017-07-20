// Native modules
const fs = require('fs');

// Third party modules
const logger = require('winston');

function registerRoutes(pApp) {
  logger.info('Add Routers...');
  fs.readdirSync(__dirname).forEach((file) => {
    if (file.match(/\.js$/) && !file.match(/^(index|error)\.js$/)) {
      logger.debug(` * ${file}`);

      try {
        logger.silly(`Loading file: ${file}`);

        const router = require(`./${file}`); // eslint-disable-line global-require, import/no-dynamic-require
        if (typeof router === 'function') {
          router(pApp);
        } else {
          logger.warn('Router was not a function!');
        }
      } catch (pError) {
        logger.warn(pError);
      }
    }
  });
}

function registerErrorRoute(app) {
  require('./error')(app); // eslint-disable-line global-require, import/no-dynamic-require
}

module.exports = {
  registerRoutes,
  registerErrorRoute
};
