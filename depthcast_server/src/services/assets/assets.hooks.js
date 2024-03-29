const { authenticate } = require('feathers-authentication').hooks;
const { fastJoin, populate } = require('feathers-hooks-common');


module.exports = {
  before: {
    all:    [ authenticate('jwt') ],
    find:   [],
    get:    [],
    create: [],
    update: [],
    patch:  [],
    remove: []
  },

  after: {
    all:    [],
    find:   [],
    get:    [],
    create: [],
    update: [],
    patch:  [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
