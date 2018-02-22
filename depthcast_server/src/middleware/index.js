//look for file named 'file' from multiPart request
const multer = require('multer');
const fileLimit = 50 * 1024 * 1024; //50MB
const upload = multer({
  storage: multer.MemoryStorage,
  limits: { fileSize: fileLimit }
}).single('file');

const model = require('./model')

module.exports = function () {
  const app = this;

  //TODO: authenticate this route using feathers-authentication (jwt)
  app.post('/model',
    //multer
    function(req, res, next) {
      upload(req, res, function(err) {
        if (err) {
          next(new Error(err))
        } else { next() }
      })
    },
    //main function
    model(app),
    //error catching
    function(err, req, res, next) {
      if (err) {
        console.log(err.message);
        res.status(500).json({message: err.message, code: 500});
      }
    }
  )
};
