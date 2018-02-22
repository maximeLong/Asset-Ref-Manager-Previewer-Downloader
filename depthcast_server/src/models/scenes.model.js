// scenes-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const scenes = new Schema({

    name:       { type: String, required: [true, 'scenes must have title'], unique: true },
    creator:    { type: Schema.Types.ObjectId, ref: 'users', required: [true, 'scenes must have creator']},

    users:      [{ type: Schema.Types.ObjectId, ref: 'users' }],
    admins:     [{ type: Schema.Types.ObjectId, ref: 'users' }],
    teams:      [{ type: Schema.Types.ObjectId, ref: 'teams' }],

    invites:    [{ type: String }],

    createdAt:  { type: Date, 'default': Date.now },
    updatedAt:  { type: Date, 'default': Date.now }

  }, {
    timestamps: true
  });

  //-- empty array validators
  //
  scenes.path('users').validate(function(value) {
    return value.length;
  }, "scenes need at least one user");
  scenes.path('admins').validate(function(value) {
    return value.length;
  }, "scenes need at least one admin, which should be the creator");

  return mongooseClient.model('scenes', scenes);
};
