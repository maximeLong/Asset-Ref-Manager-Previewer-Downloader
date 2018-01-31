<template>
<div id="prop-loader-gltf">

  <!-- propLoader should just emit the model url from a component-->
  <div id="prop-loader" v-show="!loaded">
    <div class="placeholder">
      <p>Drag glTF 2.0 file or folder here</p>
    </div>
  </div>

  <prop-viewer v-if="loaded"
    :fromServer="false"
    :droppedFileInfo="modelFileInfo"
    v-on:loadSuccess="emitSuccess"
    v-on:loadFailure="handleFailure"
  ></prop-viewer>

</div>
</template>
<script>

import DropController from '@/loaders/gltf/drop-controller'
import PropViewer from '../components/PropViewer'


export default {
  name: 'propLoaderGltf',
  components: {
    PropViewer: PropViewer
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
    const dropCtrl = new DropController(document.querySelector('#prop-loader'));
    dropCtrl.on('drop', ({rootFile, rootPath, fileMap}) => this.handleDrop(rootFile, rootPath, fileMap));
  },

  computed: {
    user: function()            { return this.$store.state.auth.user },
    currentLayout: function()   { return this.$store.getters['layouts/current'] },
  },
  methods: {

    handleDrop: function(rootFile, rootPath, fileMap) {
      let files;
      let rootName;
      const fileURL = typeof rootFile === 'string'
      ? rootFile
      : URL.createObjectURL(rootFile);
      const cleanup = () => {
        if (typeof rootFile === 'object') {
          URL.revokeObjectURL(fileURL);
        }
      };

      //TODO: run client side validation
      //validationCtrl.validate(fileURL, rootPath, fileMap);
      this.modelFileInfo = {
        fileURL: fileURL,
        rootPath: rootPath,
        fileMap: fileMap
      };
      this.loaded = true;

      //set file size
      var totalSize = 0;
      fileMap.forEach((file)=> {
        totalSize += file.size
        this.$store.commit('SET_MODEL_FILE_SIZE', totalSize);
      });


      // TODO: what does this do?
      //
      if (fileMap.size) {
        files = fileMap;
        rootName = rootFile.name.match(/([^\/]+)\.(gltf|glb)$/)[1];
      }
    },

    emitSuccess: function() {this.$emit('loaded')},
    handleFailure: function() {console.log('failure loaded')}

  }

}
</script>

<style lang="sass">
@import src/styles/main

#prop-loader-gltf

  #prop-loader
    +flexbox
    +align-items(center)
    height: 250px
    background-color: $border_color_light
    .placeholder
      +systemType(small)
      width: 100%
      text-align: center


</style>
