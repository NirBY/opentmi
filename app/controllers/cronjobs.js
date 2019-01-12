/**
  CronJobs Controller
*/

// native modules

// 3rd party modules
const Promise = require('bluebird');
const _ = require('lodash');
const mongoose = require('mongoose');
const {cronPlugin} = require('mongoose-cron');


// own modules
const {Collection, Model, setHandler} = require('../models/cronjob');
const DefaultController = require('./');
const logger = require('../tools/logger');


class CronJobsController extends DefaultController {
  constructor() {
    super(Collection);
    setHandler(this._handler.bind(this));
    Model.on('mongoose-cron:error', this._onError.bind(this));
    this._cron = Model.createCron().start();
    logger.info('Cron started');
  }
  _handler(doc) {
    const prefix = `Cronjob '${doc.name}':`;
    logger.info(`${prefix} started`);
    const {type} = doc.type;
    const defaultHandler = this._handleViewPipeline;
    const handlers = {
      'view': defaultHandler
      // @todo support for more different types..
    };
    const handler = _.get(handlers, type, defaultHandler);
    return handler.bind(this)(doc);
  }
  _handleViewPipeline(doc) {
    const {col, pipeline, view} = doc.toJSON();

    if (_.find(mongoose.modelNames(), view) >= 0 ) {
      const msg = `${prefix} Cannot overwrite default collections!`;
      logger.warn(msg);
      return Promise.reject(msg);
    }

    if (!col) {
      const msg = `${prefix} coll is missing`;
      logger.warn(msg);
      return Promise.reject(msg);
    }

    let pending = Promise.resolve();
    const startTime = new Date();
    if (view && pipeline) {
      pending = Model.db.dropCollection(view)
          // no worries even collection drop fails - probably it did not exists..
          // @todo check first before removing
          .catch(() => {})
          .then(() => Promise.try(() => JSON.parse(pipeline)))
          .then(jsonPipeline => Model.db.createCollection(view, { viewOn: col, pipeline: jsonPipeline }))
    }
    return pending
        .then(() => {
          const duration = new Date() - startTime;
          logger.info(`${prefix} took ${duration/1000} seconds`);
        })
        .catch((error) => {
          logger.error(`${prefix} fails: ${error}`);
        });
  }
  _onError(err, doc) {
    logger.error(`Cronjob '${doc.name}' error: ${err}`)
    console.log(error);
  }
}

module.exports = CronJobsController;
