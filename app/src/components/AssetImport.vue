<template>
<div id="asset-import">

  <content-box :title="'Create Asset'">

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
      <div class="cancel-button" @click="handleClickAway">Cancel</div>
      <!-- <div class="error-log" v-if="errors.length">
        <div>There {{errors.length > 1 ? 'are errors' : 'is an error' }} with:</div>
        <span class="error" v-for="error in errors">{{error}}, </span>
      </div> -->
    </div>

  </content-box>

</div>
</template>
<script>
import ContentBox from '../components/ContentBox'
import AssetLoaderGltf from '../components/AssetLoaderGltf'

import { mapState } from 'vuex'
import { mapActions } from 'vuex'

import { mixin as clickaway } from 'vue-clickaway'
import _ from 'lodash'


export default {
  name: 'assetImport',
  components: {
    ContentBox: ContentBox,
    AssetLoaderGltf: AssetLoaderGltf
  },
  mixins: [ clickaway ],
  data: function() {
    return {
      loaded: false,
      snapTaken: false
    }
  },
  destroyed: function() {
    this.$store.commit('SET_FORM_ASSETNAME', '')
  },

  computed: {
    user: function()            { return this.$store.state.auth.user },
    currentScene: function()   { return this.$store.getters['scenes/current'] },
    assetIsOk: function()  {
      if (this.loaded && this.formAssetName.length && this.snapTaken) { return true } else { return false }
    },
    modelVertices: function() {
      return this.modelGeometryInfo.render.vertices
    },
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
    },
    ...mapState([
      'formAssetName',
      'modelGeometryInfo',
      'modelFileSize',
      'modelName',
      'modelFile'
    ])
  },
  methods: {
    //-- button methods
    //
    handleClickAway: function(e) {
      //TODO: better clickaway handler - have to catch button presses on form bcuz bugs
      if (_.includes(e.target.classList, 'button')) { return } else {
        this.$store.commit('SET_ASSET_IMPORT', false);
      }
    },
    updateFormAssetName: function(e) { this.$store.commit('SET_FORM_ASSETNAME', e.target.value); },
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
        name: this.formAssetName,
        creator: this.user._id,
        modelSize: this.modelFileSize,
        performanceInfo: {
          geometries: this.modelGeometryInfo.memory.geometries,
          textures:   this.modelGeometryInfo.memory.textures,
          drawCalls:  this.modelGeometryInfo.render.calls,
          triangles:  this.modelGeometryInfo.render.faces,
          vertices:   this.modelGeometryInfo.render.vertices
        }
      }

      // Instantiate a FormData() object + add information to it
      const formData = new FormData();
      formData.append('file', this.modelFile);
      formData.append('modelInfo', JSON.stringify(modelInfo));
      formData.append('currentScene', this.currentScene._id)

      // have to do RESTful thing here so that files can be handled
      fetch(process.env.SERVER_ADDRESS + '/model', {
        method: 'POST',
        body: formData
      })
      .then(assetResponse => {
        console.log(assetResponse)
        this.$store.commit('SET_ASSET_IMPORT', false);
        //TODO: we need to do a lookup on assets in scene at this point
      })
      .catch(error => { console.log(error) })

    },
    ...mapActions('assets', {
      createAsset: 'create'
    })
  }

}
</script>

<style lang="sass">
@import src/styles/main

#asset-import
  position: absolute
  top: 0
  bottom: 0
  left: 0
  right: 0
  width: 100%
  height: 100%
  +flexbox
  +justify-content(center)
  +align-items(center)
  &::before
    content: ''
    position: absolute
    width: 100%
    height: 100%
    background-color: $side_panel_color
    opacity: .8

  .content-box
    width: 80%
    max-width: 700px

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
