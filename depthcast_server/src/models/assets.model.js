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

    //url produced by middleware route /model
    modelURL:       { type: String },

    modelSize:      { type: Number },
    performanceInfo: {
      geometries: { type: Number },
      textures:   { type: Number },
      drawCalls:  { type: Number },
      triangles:  { type: Number },
      vertices:   { type: Number }
    },

    //store images directly in model with arrayBuffer > convert back on client using utf8 conversion
    thumbnailImage: {
      big:    { type: Buffer },
      small:  { type: Buffer }
    },

    createdAt:  { type: Date, 'default': Date.now },
    updatedAt:  { type: Date, 'default': Date.now }

  }, {
    timestamps: true
  });

  return mongooseClient.model('assets', assets);
};
