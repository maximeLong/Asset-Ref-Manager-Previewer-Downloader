// Initializes the `variants` service on path `/variants`
const createService = require('feathers-mongoose');
const createModel = require('../../models/variants.model');
const hooks = require('./variants.hooks');
const filters = require('./variants.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'variants',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/variants', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('variants');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
