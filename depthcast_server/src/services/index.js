const users = require('./users/users.service.js');
const teams = require('./teams/teams.service.js');
const scenes = require('./scenes/scenes.service.js');
const variants = require('./variants/variants.service.js');
const assets = require('./assets/assets.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(users);
  app.configure(teams);
  app.configure(scenes);
  app.configure(variants);
  app.configure(assets);
};
