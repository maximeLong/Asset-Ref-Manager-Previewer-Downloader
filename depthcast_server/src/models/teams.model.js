// teams-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;

  const teams = new Schema({

    name:       { type: String, required: [true, 'team must have title'], unique: true },
    creator:    { type: Schema.Types.ObjectId, ref: 'users', required: [true, 'team must have creator']},

    users:      [{ type: Schema.Types.ObjectId, ref: 'users' }],
    admins:     [{ type: Schema.Types.ObjectId, ref: 'users' }],

    invites:    [{ type: String }],

    createdAt:  { type: Date, 'default': Date.now },
    updatedAt:  { type: Date, 'default': Date.now }

  }, {
    timestamps: true
  });

  //-- empty array validators
  //
  teams.path('users').validate(function(value) {
    return value.length;
  }, "users need at least one user");
  teams.path('admins').validate(function(value) {
    return value.length;
  }, "users need at least one admin, which should be the creator");

  //-- unique validator, should also validate that email is real
  // teams.path('invites').validate(function(value) {
  //   return value.length;
  // }, "invite has already been sent to user");

  return mongooseClient.model('teams', teams);
};
