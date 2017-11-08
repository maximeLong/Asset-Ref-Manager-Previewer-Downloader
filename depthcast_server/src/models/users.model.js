// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const users = new mongooseClient.Schema({

    email:      { type: String, unique: true, required: [true, 'email must exist'] },
    googleId:   { type: String },
    password:   { type: String },
       
    role:       { type: String, 'default': 'visitor' },
    createdAt:  { type: Date, 'default': Date.now },
    updatedAt:  { type: Date, 'default': Date.now }

  }, {
    timestamps: true
  });

  return mongooseClient.model('users', users);
};
