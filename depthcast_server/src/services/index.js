const users = require('./users/users.service.js');
const teams = require('./teams/teams.service.js');
const layouts = require('./layouts/layouts.service.js');
const variants = require('./variants/variants.service.js');
const assets = require('./assets/assets.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(users);
  app.configure(teams);
  app.configure(layouts);
  app.configure(variants);
  app.configure(assets);
};
