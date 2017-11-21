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
    scenes:     [{ type: Schema.Types.ObjectId, ref: 'scenes'}],
    assets:     [{ type: Schema.Types.ObjectId, ref: 'assets'}],

    invites:    [{ type: String }],

    createdAt:  { type: Date, 'default': Date.now },
    updatedAt:  { type: Date, 'default': Date.now }

  }, {
    timestamps: true
  });

  return mongooseClient.model('teams', teams);
};
