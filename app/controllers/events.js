/**
  Events Controller
*/

// native modules

// 3rd party modules
const Promise = require('bluebird');
const _ = require('lodash');

// own modules
// const eventBus = require('../tools/eventBus');
const DefaultController = require('./');
const {Utilization} = require('../tools/utilization');
const {MsgIds} = require('../models/event');
const ResourceModel = require('../models/resource');
const logger = require('../tools/logger');


class EventsController extends DefaultController {
  constructor() {
    super('Event');
  }

  static redirectRef(req, res) {
    const iteratee = (path) => {
      const ref = _.get(req.Event, `ref.${path}`);
      if (ref) {
        res.redirect(`/api/v0/${path}s/${ref}`);
        return true;
      }
      return false;
    };
    const found = _.find(['resource', 'result', 'testcase'], iteratee);
    if (!found) {
      res.status(404).json({message: 'reference object not found'});
    }
  }
  statistics(req, res) {
    const find = {
      'ref.resource': req.Resource._id,
      msgid: {
        $in: [
          MsgIds.ALLOCATED,
          MsgIds.RELEASED,
          MsgIds.FLASHED,
          MsgIds.ENTER_MAINTENANCE,
          MsgIds.EXIT_MAINTENANCE
        ]
      },
      'priority.facility': 'resource'
    };
    const utilization = new Utilization();
    this.Model
      .find(find)
      .select('cre.time msgid priority.level')
      .sort({'cre.time': 1})
      .cursor()
      .on('data', utilization.push.bind(utilization))
      .on('error', (error) => {
        logger.error(`Statistics failure: ${error}`);
        res
          .status(500)
          .json({message: `${error}`, error: error});
      })
      .on('end', () => res.json(utilization.summary));
  }
  utilization(req, res) {
    const find = {
      'ref.resource': req.Resource._id,
      msgid: {$in: [MsgIds.ALLOCATED, MsgIds.RELEASED]},
      'priority.level': 'info',
      'priority.facility': 'resource'
    };
    const utilization = new Utilization();
    this.Model
      .find(find)
      .select('cre.time msgid priority.level')
      .sort({'cre.time': 1})
      .cursor()
      .on('data', utilization.push.bind(utilization))
      .on('error', (error) => {
        logger.error(`Utilization failure: ${error}`);
        res
          .status(500)
          .json({message: `${error}`, error: error});
      })
      .on('end', () => {
        utilization.calculate()
          .then(res.json.bind(res))
          .catch((error) => {
            res.status(404).json({message: error.message, error: error});
          });
      });
  }
  resolveResource(req, res, next) {
    const find = {$or: []};
    if (DefaultController.isObjectId(req.params.Resource)) {
      find.$or.push({_id: req.params.Resource});
    }
    find.$or.push({'hw.sn': req.params.Resource});
    this.logger.debug(`find resource by ${JSON.stringify(find)} (model: Resource)`);
    const {Model} = ResourceModel;
    return Model.findOne(find)
      .then((data) => {
        if (!data) {
          const error = new Error(`Document with id/hw.sn ${req.params.Resource} not found`);
          error.statusCode = 404;
          throw error;
        }
        _.set(req, 'Resource', data);
        next();
      })
      .catch((error) => {
        const status = error.statusCode || 500;
        this.logger.error(error);
        res.status(status).json({message: `${error}`});
      });
  }
  resourceEvents(req, res) {
    const filter = {'ref.resource': req.Resource._id};
    const query = _.defaults(filter, req.query);

    return Promise.fromCallback(cb => this.Model.leanQuery(query, cb))
      .then((events) => { res.json(events); })
      .catch((error) => {
        logger.error(`resourceEvents failure: ${error}`);
        res
          .status(500)
          .json({message: error.message, error: error});
      });
  }
  /*
  // @todo these could be moved to own plugin
  linkEvents() {
    // when new result appears
    eventBus.on('result.new', this._resultNew.bind(this));
    eventBus.on('resource.new', this._resourceNew.bind(this));
    eventBus.on('resource.updated', this._resourceUpdated.bind(this));
  }
  _resultNew(bus, result) {
    const interestedVerdicts = ['inconclusive'];
    if (interestedVerdicts.indexOf(_.get(result, 'exec.verdict.final'))) {
      logger.debug('Got inconclusive test result');
      const event = {
        ref: {
          result: result._id,
        },
        priority: {
          level: 'warning',
          facility: 'testcase'
        },
        msg: _.get(result, 'exec.note')
      };
      this._create(event)
        .catch(logger.error);
    }
  }
  _resourceNew(bus, resource) {
    // @todo
    // this.create()
  }
  _resourceUpdated(bus, resource) {
    // @todo
    // this.create()
  }
  */
}

module.exports = EventsController;
