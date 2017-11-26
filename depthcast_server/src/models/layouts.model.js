// layouts-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const layouts = new Schema({
    name:       { type: String, required: [true, 'layouts must have title'], unique: true },
    creator:    { type: Schema.Types.ObjectId, ref: 'users', required: [true, 'layouts must have creator']},

    users:      [{ type: Schema.Types.ObjectId, ref: 'users' }],
    admins:     [{ type: Schema.Types.ObjectId, ref: 'users' }],
    teams:      [{ type: Schema.Types.ObjectId, ref: 'teams' }],

    assets:     [{ type: Schema.Types.ObjectId, ref: 'assets'}],
    invites:    [{ type: String }],

    createdAt:  { type: Date, 'default': Date.now },
    updatedAt:  { type: Date, 'default': Date.now }

  }, {
    timestamps: true
  });

  //-- empty array validators
  //
  layouts.path('users').validate(function(value) {
    return value.length;
  }, "layouts need at least one user");
  layouts.path('admins').validate(function(value) {
    return value.length;
  }, "layouts need at least one admin, which should be the creator");

  return mongooseClient.model('layouts', layouts);
};
