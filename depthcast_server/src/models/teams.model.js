// teams-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const teams = new Schema({

    title:  { type: String, unique: true, required: [true, 'team must have title'] },
    users:  [{ type: Schema.Types.ObjectId, ref: 'users' }],

    createdAt:  { type: Date, 'default': Date.now },
    updatedAt:  { type: Date, 'default': Date.now }

  }, {
    timestamps: true
  });

  return mongooseClient.model('teams', teams);
};
