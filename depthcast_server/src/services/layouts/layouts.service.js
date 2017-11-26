// Initializes the `layouts` service on path `/layouts`
const createService = require('feathers-mongoose');
const createModel = require('../../models/layouts.model');
const hooks = require('./layouts.hooks');
const filters = require('./layouts.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'layouts',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/layouts', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('layouts');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
