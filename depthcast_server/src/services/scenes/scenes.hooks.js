const { authenticate } = require('feathers-authentication').hooks;
const { fastJoin, populate } = require('feathers-hooks-common');

//TODO: investigate using a fastJoin here instead
const populatedSceneSchema = {
  include: [{
    service: 'users',
    nameAs: 'users',
    parentField: 'users',
    childField: '_id',
    asArray: true
  },
  {
    service: 'assets',
    nameAs: 'assets',
    parentField: 'assets',
    childField: '_id',
    asArray: true
  }]
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
    all: [populate({ schema: populatedSceneSchema })],
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
