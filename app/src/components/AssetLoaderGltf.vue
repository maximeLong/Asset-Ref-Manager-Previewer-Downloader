<template>
<div id="asset-loader-gltf">

  <!-- assetLoader should just emit the model url from a component-->
  <div id="asset-loader" v-show="!loaded">
    <div class="placeholder">
      <p>Drag glTF 2.0 file or folder here</p>
    </div>
  </div>

  <asset-viewer v-if="loaded"
    :fromServer="false"
    :showSnapButton="true"
    :showWireframeButton="true"
    :droppedFileInfo="modelFileInfo"
    v-on:loadSuccess="emitSuccess"
    v-on:snapTaken="emitSnap"
    v-on:loadFailure="handleFailure"
  ></asset-viewer>

</div>
</template>
<script>

import DropController from '@/loaders/gltf/drop-controller'
import AssetViewer from '../components/AssetViewer'


export default {
  name: 'assetLoaderGltf',
  components: {
    AssetViewer: AssetViewer
  },

  data: function() {
    return {
      loaded: false,

      errors: [],

      //drop info
      modelFileInfo: {
        rootFile: "",
        rootPath: "",
        fileMap: ""
      },


    }
  },
  mounted: function() {
    //check that file is supported and webgl can be turned on
    if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
      console.error('The File APIs are not fully supported in this browser.');
    }
    //handle file dropping
    const dropCtrl = new DropController(document.querySelector('#asset-loader'));
    dropCtrl.on('drop', ({rootFile, rootPath, fileMap}) => this.handleDrop(rootFile, rootPath, fileMap));
  },

  computed: {
    user: function()            { return this.$store.state.auth.user },
    currentScene: function()   { return this.$store.getters['scenes/current'] },
  },
  methods: {

    handleDrop: function(rootFile, rootPath, fileMap) {
      const fileURL = typeof rootFile === 'string' ? rootFile : URL.createObjectURL(rootFile);

      //TODO: run client side validation
      //TODO: convert gltf to glb somewhere around here after validation

      //validationCtrl.validate(fileURL, rootPath, fileMap);
      //convert gltf to glb at this point
      this.modelFileInfo = {
        fileURL: fileURL,
        rootPath: rootPath,
        fileMap: fileMap
      };
      this.loaded = true;

      //set file size
      var totalSize = 0;
      fileMap.forEach((file, path)=> {

        totalSize += file.size
        this.$store.commit('SET_MODEL_FILE_SIZE', totalSize);
        this.$store.commit('SET_MODEL_FILE', file);

        //TODO: only works on glb right now --> need to make sure glb happens by converting to gltf above
        // var reader = new FileReader();
        // reader.addEventListener("loadend", ()=> {
        //   this.$store.commit('SET_MODEL_FILE_BUFFER', reader.result);
        // });
        // reader.readAsArrayBuffer(file);

      });

    },

    // -- emit events up to whatever component is using the loader
    // -- TODO: this is kind of silly and could handled by a mutation watcher (like toasts) on whatever cares to listen
    //
    emitSuccess: function() {this.$emit('loaded')},
    emitSnap:    function() {this.$emit('snapTaken')},
    handleFailure: function() {console.log('failure loaded')}

  }

}
</script>

<style lang="sass">
@import src/styles/main

#asset-loader-gltf

  #asset-loader
    +flexbox
    +align-items(center)
    height: 250px
    background-color: $border_color_light
    .placeholder
      +systemType(small)
      width: 100%
      text-align: center


</style>
