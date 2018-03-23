<template>
<div id="asset-loader-gltf">

  <!-- sketchfab drop and directions -->
  <div id="sketchfab-container" v-if="panelType == 'sketchfab' && !loaded">
    <div id="directions">
      <div class="subtitle">1. Go to Sketchfab.com</div>
      <div class="button" @click="goToModel">Link to Sketchfab Model</div>
      <div class="subtitle">2. Download gLTF Model</div>
      <div class="text">Click the <i class="material-icons">file_download</i> icon below the model,
      and select the Autoconverted format (gLTF)</div>
      <div class="subtitle">3. unzip and drop contents</div>
      <div class="text">Unzip the package and drop the contents on this window to the right</div>
    </div>
    <div id="asset-loader">
      <div class="placeholder">
        <p>Drop un-zipped model contents</p>
      </div>
    </div>
  </div>

  <!-- normal file drop -->
  <div id="asset-loader" v-show="panelType == 'file' && !loaded">
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
import { mapState, mapGetters } from 'vuex'
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
    ...mapState('ux',       ['assetImportModal']),
    ...mapGetters('scenes', ['currentScene']),

    panelType: function()      { return this.assetImportModal.panelType },
    relatedAsset: function()   { return this.assetImportModal.relatedAsset }
  },
  methods: {

    handleDropConversion: function(file) {
      this.glbUrl = URL.createObjectURL(file);
      this.loaded = true;
      this.$store.commit('ux/SET_MODEL_FILE_SIZE', file.size);
      this.$store.commit('ux/SET_MODEL_FILE', file);
    },

    goToModel: function() {
      window.open(this.relatedAsset.original.viewerUrl, '_blank')
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

  #sketchfab-container
    +flexbox
    +flex-direction(row)
    #asset-loader
      +flex(1)

    #directions
      +flex(1)
      padding-right: 15px
      .subtitle
        +systemType(small)
        color: $active_color
        margin-bottom: 5px
      .button
        +button(false, false)
        padding: 10px 0
        margin-bottom: 20px
      .text
        +userType(small)
        margin-bottom: 20px
      i
        font-size: 18px

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
