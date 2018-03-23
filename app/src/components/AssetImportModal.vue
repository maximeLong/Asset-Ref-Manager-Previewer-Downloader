<template>
<div id="asset-import-modal">

  <modal :title="'Import Asset'" :onClickaway="handleClickaway">

    <!-- import file -->
    <asset-loader-gltf v-on:loaded="receiveLoaded" v-on:snapTaken="snapTaken = true"></asset-loader-gltf>

    <!-- name and info form -->
    <div class="name form" v-if="loaded">
      <div class="form-title">Asset Name</div>
      <input :value="formAssetName" @input="updateFormAssetName">
    </div>

    <div class="info form" v-if="loaded">
      <div class="model-vertices">
        <div class="form-title">Vertex Count</div>
        <div class="vertex-info">
          <div class="vertex-bar" :class="barSize"></div>
          <div class="vertex-count">{{modelVertices}}</div>
        </div>
      </div>
      <div class="model-data">
        <div class="subtitles">
          <div class="form-title">File Type</div>
          <div class="form-title">File Size</div>
          <div class="form-title">Textures</div>
        </div>
        <div class="data-points">
          <div class="point">Gltf 2.0</div>
          <div class="point">{{modelSizeFormatted}}</div>
          <div class="point">yes</div>
        </div>
      </div>
    </div>

    <!-- save buttons -->
    <div class="edit-buttons">
      <div class="save-button button" :class="{ 'not-active' : !assetIsOk }" @click="uploadAsset">Upload Asset</div>
      <div class="cancel-button" @click="handleClickaway">Cancel</div>
    </div>

  </modal>

</div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import Modal from '../components/Modal'
import AssetLoaderGltf from '../components/AssetLoaderGltf'
import _ from 'lodash'


export default {
  name: 'assetImportModal',
  components: {
    Modal: Modal,
    AssetLoaderGltf: AssetLoaderGltf
  },
  data: function() {
    return {
      loaded: false,
      snapTaken: false
    }
  },
  destroyed: function() {
    //release model information from store
    this.$store.commit('ux/SET_FORM_ASSETNAME', '')
    this.$store.commit('ux/SET_MODEL_GEOMETRY_INFO', {})
    this.$store.commit('ux/SET_MODEL_FILE_SIZE', '')
    this.$store.commit('ux/SET_MODEL_SNAPSHOT', undefined)
    this.$store.commit('ux/SET_MODEL_FILE', undefined)
  },

  computed: {
    ...mapState('ux', [
      'formAssetName',
      'modelGeometryInfo',
      'modelFileSize',
      'modelName',
      'modelFile',
      'modelSnapshot'
    ]),
    ...mapState('users',    ['user']),
    ...mapGetters('scenes', ['currentScene']),

    assetIsOk: function()  {
      if (this.loaded && this.formAssetName.length && this.snapTaken) { return true } else { return false }
    },
    modelVertices: function() { return this.modelGeometryInfo.render.vertices },
    barSize: function() {
      if (this.modelVertices <= 20000) {
        return 'small'
      }
      if (this.modelVertices >= 20001 && this.modelVertices <= 100000) {
        return 'average'
      } else {
        return 'big'
      }
    },
    modelSizeFormatted: function() {
      const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      let l = 0, n = parseInt(this.modelFileSize, 10) || 0;
      while(n >= 1024){
          n = n/1024;
          l++;
      }
      return(n.toFixed(n >= 10 || l < 1 ? 0 : 1) + ' ' + units[l]);
    }
  },
  methods: {
    //-- button methods
    handleClickaway: function() {
      this.$store.commit('ux/SET_ASSET_IMPORT_MODAL', {isOpen: false});
    },
    updateFormAssetName: function(e) { this.$store.commit('ux/SET_FORM_ASSETNAME', e.target.value); },
    receiveLoaded: function() {
      this.loaded = true;
    },

    // -- patch scene
    //
    uploadAsset: function() {
      if (this.assetIsOk) { this.tryCreateAsset() }
    },

    tryCreateAsset: function() {
      const modelInfo = {
        name:           this.formAssetName,
        creator:        this.user.uid,
        creatorEmail:   this.user.email,
        modelSize:      this.modelFileSize,
        thumbnailImage: this.modelSnapshot,
        performanceInfo: {
          geometries: this.modelGeometryInfo.memory.geometries,
          textures:   this.modelGeometryInfo.memory.textures,
          drawCalls:  this.modelGeometryInfo.render.calls,
          triangles:  this.modelGeometryInfo.render.faces,
          vertices:   this.modelGeometryInfo.render.vertices
        }
      }

      //do a RESTful thing here so that files can be handled
      this.$store.dispatch('assets/createAsset', {assetData: modelInfo, assetFile: this.modelFile});

    }
  }

}
</script>

<style lang="sass">
@import src/styles/main

#asset-import-modal
  .form
    padding: 20px 0
    border-bottom: 1px solid $border_color_light
    +flexbox
    +align-items(center)
    &:last-of-type
      border-bottom: none
      padding-bottom: 0px
    &:first-of-type
      padding-top: 0px
    .form-title
      +flex(0 0 100px)
      +systemType(small)
    input
      font-weight: bold
      border-radius: 100px
      padding-left: 20px
      &.active
        border-color: $border_color_mid

    &.info
      +flexbox
      +align-items(center)
      +justify-content(space-between)
      .model-vertices
        +flex(1)
        +systemType(small)
        .vertex-info
          +flexbox
          +align-items(center)
          background-color: $border_color_light
          margin-top: 10px
          .vertex-bar
            height: 25px
            &.small
              width: 10%
              background-color: #73b2f3
            &.average
              width: 30%
              background-color: #54c36c
            &.big
              width: 70%
              background-color: #f55151

          .vertex-count
            padding-left: 10px
            color: $text_color
      .model-data
        +flex(1)
        +flexbox
        +align-items(center)
        +justify-content(center)
        .data-points
          margin-left: 15px
          +systemType(small)
          color: $text_color

  //buttons
  .edit-buttons
    +flexbox
    +align-items(center)
    margin-top: 20px
    .cancel-button
      +button(false, true, $action_color, inherit)
      padding: 13px 30px
      margin-left: 10px
    .save-button
      +button(false, false, $action_color, inherit)
      padding: 13px 30px
      &.not-active
        opacity: .3
        cursor: default
    .error-log
      margin-left: 10px
      +systemType(small)
      color: #f55151



</style>
