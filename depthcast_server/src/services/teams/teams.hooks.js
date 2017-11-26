const { authenticate } = require('feathers-authentication').hooks;

// const addCreatorToUserArray = function() {
//   return function(hook) {
//
//     const creatorId = hook.result.creator;
//     const teamId = hook.result._id;
//
//     return hook.app.service('teams').patch(teamId, {
//       $push: { users: creatorId }
//     }).then(res => {
//       return hook;
//     });
//   }
// }

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
    all: [],
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
