<template>
<div id="asset-loader-gltf">

  <!-- assetLoader should just emit the model url from a component-->
  <div id="asset-loader" v-show="!loaded">
    <div class="placeholder">
      <p>Drag glTF 2.0 file or folder here</p>
    </div>
  </div>

  <asset-viewer v-if="loaded"
    :assetIsBinary="true"
    :binaryUrl="glbUrl"
    :showSnapButton="true"
    :showWireframeButton="true"
    v-on:loadSuccess="emitSuccess"
    v-on:snapTaken="emitSnap"
    v-on:loadFailure="handleFailure"
  ></asset-viewer>

</div>
</template>
<script>

import converter from '@/loaders/gltf/gltfToGlb'
import AssetViewer from '../components/AssetViewer'

export default {
  name: 'assetLoaderGltf',
  components: {
    AssetViewer: AssetViewer
  },

  data: function() {
    return {
      loaded: false,
      glbUrl: '',
    }
  },
  mounted: function() {
    // check that file is supported and webgl can be turned on
    if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
      console.error('The File APIs are not fully supported in this browser.');
    }

    // convert gltf to glb
    converter(document.querySelector('#asset-loader'))
    .then((file)=> {
      this.handleDropConversion(file)
    });
  },

  computed: {
    user: function()           { return this.$store.state.auth.user },
    currentScene: function()   { return this.$store.getters['scenes/current'] },
  },
  methods: {

    handleDropConversion: function(file) {
      this.glbUrl = URL.createObjectURL(file);
      this.loaded = true;
      this.$store.commit('SET_MODEL_FILE_SIZE', file.size);
      this.$store.commit('SET_MODEL_FILE', file);
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
