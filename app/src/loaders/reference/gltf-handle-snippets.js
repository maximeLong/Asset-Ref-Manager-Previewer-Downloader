// reference file for handling gltf drops
//TODO: -- after V2 of handling gltf/glb drop we can remove this file


// -- in AssetLoaderGltf.mounted()
//
const dropCtrl = new DropController(document.querySelector('#asset-loader'));
dropCtrl.on('drop', ({rootFile, rootPath, fileMap}) => this.handleGltfDrop(rootFile, rootPath, fileMap));

// -- in AssetLoaderGltf.methods
//
handleGltfDrop: function(rootFile, rootPath, fileMap) {
  const fileURL = typeof rootFile === 'string' ? rootFile : URL.createObjectURL(rootFile);
  this.modelFileInfo = {
    fileURL: fileURL,
    rootPath: rootPath,
    fileMap: fileMap
  };
  this.loaded = true;
  var totalSize = 0;
  fileMap.forEach((file, path)=> {
    totalSize += file.size
    this.$store.commit('SET_MODEL_FILE_SIZE', totalSize);
    this.$store.commit('SET_MODEL_FILE', file);
  });
}

// -- in AssetViewer.methods.prepLoad --> in initial if(!this.AssetIsBinary)
//
var url = this.gltfFileMap.fileURL;
var rootPath = this.gltfFileMap.rootPath;
var assetMap = this.gltfFileMap.fileMap;
const manager = new THREE.LoadingManager();
const baseURL = THREE.LoaderUtils.extractUrlBase(url);
const blobURLs = [];
manager.setURLModifier((url, path) => {
  const normalizedURL = rootPath + url
    .replace(baseURL, '')
    .replace(/^(\.?\/)/, '');
  if (assetMap.has(normalizedURL)) {
    const blob = assetMap.get(normalizedURL);
    const blobURL = URL.createObjectURL(blob);
    blobURLs.push(blobURL);
    return blobURL;
  }
  return (path || '') + url;
});
const loader = new THREE.GLTFLoader(manager);
loader.setCrossOrigin('anonymous');

this.load(url, loader)
.then(()=> {
  this.$store.commit('SET_MODEL_GEOMETRY_INFO', this.renderer.info);
  this.loaded = true;
  this.$emit('loadSuccess');
})
.catch((error) => {
  console.log(error);
  this.$emit('loadFailure');
  window.alert((error||{}).message || error);
});
