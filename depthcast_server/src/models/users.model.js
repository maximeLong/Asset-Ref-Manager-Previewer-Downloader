// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const users = new Schema({

    email:      { type: String, unique: true, required: [true, 'email must exist'] },
    googleId:   { type: String },
    password:   { type: String, required: [true, 'users must have password'], minlength : [1, 'password cannot be empty'] },

    teams:      [{ type: Schema.Types.ObjectId, ref: 'teams' }],

    profileImage: {
      big: { type: String },
      small: { type: String }
    },

    createdAt:  { type: Date, 'default': Date.now },
    updatedAt:  { type: Date, 'default': Date.now }

  }, {
    timestamps: true
  });

  return mongooseClient.model('users', users);
};
