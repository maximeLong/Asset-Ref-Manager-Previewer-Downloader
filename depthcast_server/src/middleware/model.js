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

    if(!req.file) { return next(); }
    const assetData = JSON.parse(req.body.modelInfo);
    const assetScene = req.body.currentScene;


    //get file and start stream to gcs
    const gcsname = req.file.originalname;
    const file = bucket.file(gcsname);
    const stream = file.createWriteStream({
      metadata: {
        contentType: 'model/gltf-binary' //default is: req.file.mimetype -- which defaults to octet/stream
      }
    });

    stream.on('error', (err) => {
      console.log(err);
    });

    stream.on('finish', () => {

      req.file.cloudStorageObject = gcsname;
      req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);

      //make file public readable (until auth is built)
      file.makePublic()
        .then(() => { console.log(gcsname + ' file made public') })
        .catch(err => { console.error('ERROR:', err); });

      //create asset with modelData and public URL
      assetData.modelURL = getPublicUrl(gcsname);
      app.service('assets').create(assetData)
        .then((asset) =>  {

          //add asset to current scene automatically
          app.service('scenes').patch(assetScene, {$push: { assets: asset._id }} )
            .then(()=> { console.log('scene successfully patched') })
            .catch(err => console.log(err))

          //return asset to client
          res.json(asset);
        })
        .catch(err => {
          console.log(err);
        })
    });

    stream.end(req.file.buffer);

  }
}
