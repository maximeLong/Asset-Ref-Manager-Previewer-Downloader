const { authenticate } = require('feathers-authentication').hooks;
const commonHooks = require('feathers-hooks-common');
const { restrictToOwner } = require('feathers-authentication-hooks');
const { hashPassword } = require('feathers-authentication-local').hooks;
const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: '_id',
    ownerField: '_id'
  })
];

const crypto = require('crypto');
const setGravitar = function() {
  return function(hook) {

    const hash = crypto.createHash('md5').update(hook.data.email).digest('hex');
    const userId = hook.result._id;
    return hook.app.service('users').patch(userId, {
      profileImage: {
        big: 'http://www.gravatar.com/avatar/' + hash + '.jpg?s=' + 150 + '&d=retro',
        small: 'http://www.gravatar.com/avatar/' + hash + '.jpg?s=' + 50 + '&d=retro'
      }
    }).then(res => {
      return hook;
    });

  }
}

module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ ...restrict ],
    create: [ hashPassword() ],
    update: [ ...restrict, hashPassword() ],
    patch: [ ...restrict, hashPassword() ],
    remove: [ ...restrict ]
  },

  after: {
    all: [
      commonHooks.when(
        hook => hook.params.provider,
        commonHooks.discard('password')
      )
    ],
    find: [],
    get: [],
    create: [setGravitar()],
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
