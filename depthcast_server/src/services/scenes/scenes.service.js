// Initializes the `scenes` service on path `/scenes`
const createService = require('feathers-mongoose');
const createModel = require('../../models/scenes.model');
const hooks = require('./scenes.hooks');
const filters = require('./scenes.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'scenes',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/scenes', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('scenes');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
