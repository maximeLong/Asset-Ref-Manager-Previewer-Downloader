const model = require('./model')

//handle multipart/form requests
const multer = require('multer');
const upload = multer({
  storage: multer.MemoryStorage
});

module.exports = function () {
  const app = this;

  //TODO: authenticate this route using feathers-authentication (jwt)
  app.post('/model', upload.single('file'), model(app) )
};
