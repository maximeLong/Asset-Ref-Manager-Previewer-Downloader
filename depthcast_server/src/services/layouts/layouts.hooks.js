const { authenticate } = require('feathers-authentication').hooks;
const { fastJoin, populate } = require('feathers-hooks-common');

const layoutUserSchema = {
  include: {
    service: 'users',
    nameAs: 'users',
    parentField: 'users',
    childField: '_id',
    asArray: true
  }
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [populate({ schema: layoutUserSchema })],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
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
