const crypto = require("crypto");

// Import the Google Cloud client library + reference key
const Storage = require('@google-cloud/storage');
const projectId = 'depthcast-188705';
const bucketName = 'depthcast-models';

const storage = new Storage({
  projectId: projectId,
  keyFilename: './GCS.json' //TODO: make sure that this isn't in VCS -- but needs to be manually added to dist folder
});
const bucket = storage.bucket(bucketName);

//helper function
const getPublicUrl = function(filename) {
  return 'https://storage.googleapis.com/' + bucketName + '/' + filename;
}


module.exports = function(app) {

  return function(req, res, next) {

    if(!req.file) {
      return next();
    }
    const assetData = JSON.parse(req.body.modelInfo);
    const assetScene = req.body.currentScene;

    //convert model thumbnail DataURL strings to buffers
    assetData.thumbnailImage = new Buffer(assetData.thumbnailImage.split(",")[1], 'base64');

    //set file and start stream to gcs
    const hash = crypto.randomBytes(8).toString("hex");
    req.file.originalname = assetData.name + '-' + hash + '.glb';

    const gcsname = req.file.originalname;
    const file = bucket.file(gcsname);

    const stream = file.createWriteStream({
      metadata: {
        contentType: 'model/gltf-binary' //default is: req.file.mimetype -- which defaults to octet/stream
      }
    });

    stream.on('error', (err) => {
      return next(new Error(err))
    });

    stream.on('finish', () => {

      req.file.cloudStorageObject = gcsname;
      req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);

      //make file public readable (until auth is built)
      file.makePublic()
        .then(() =>   { console.log(gcsname + ' file made public') })
        .catch(err => { return next(new Error(err)) });

      //create asset with modelData and public URL
      assetData.modelURL = getPublicUrl(gcsname);
      app.service('assets').create(assetData)
        .then((asset) =>  {
          return res.status(200).json({message: asset, code: 200 });
        })
        .catch(err => {
          return next(new Error(err));
        })
    });

    stream.end(req.file.buffer);

  }
}
