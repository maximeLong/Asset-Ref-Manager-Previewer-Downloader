// assets-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const assets = new Schema({

    name:       { type: String, required: [true, 'asset must have title'] },
    creator:    { type: Schema.Types.ObjectId, ref: 'users', required: [true, 'asset must have creator']},

    //TODO: decided to hold relationship here because assets seem fairly atomic in that they can..
    //      ..be held in scenes or users (through creator or likes)..
    //      ..but that means that asset model could hold broken links to users/scenes that do not exist
    scenes:     [{ type: Schema.Types.ObjectId, ref: 'scenes' }],
    likes:      [{ type: Schema.Types.ObjectId, ref: 'users'}],
    views:      { type: Number, 'default': 0 },

    //model information
    modelURL:       { type: String },
    modelSize:      { type: Number },
    performanceInfo: {
      geometries: { type: Number },
      textures:   { type: Number },
      drawCalls:  { type: Number },
      triangles:  { type: Number },
      vertices:   { type: Number }
    },

    //store images directly in model with DataURL(data:image/jpg;base64,<string>)
    //--> convert back in Unity using System.Convert.FromBase64String
    thumbnailImage: { type: Buffer },

    createdAt:  { type: Date, 'default': Date.now },
    updatedAt:  { type: Date, 'default': Date.now }
  }, {
    timestamps: true
  });

  return mongooseClient.model('assets', assets);
};
