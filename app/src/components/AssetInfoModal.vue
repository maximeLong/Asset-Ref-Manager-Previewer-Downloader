<template>
<div id="asset-info-modal">

  <modal :title="activeAsset.name" :onClickaway="handleClickaway">

    <div class="asset-preview">
      <div class="asset-image" v-if="!loaded"
        :style="{ 'background-image': 'url(' + activeAsset.thumbnailImage + ')' }">
      </div>
      <asset-viewer v-else
        :assetIsBinary="true"
        :binaryUrl="fileURL"
        :showSnapButton="false"
        :showWireframeButton="true"
        v-on:loadSuccess="emitSuccess"
        v-on:loadFailure="handleFailure"
      ></asset-viewer>

      <transition name="fade">
        <div class="button" v-if="!loaded" @click="loaded = true">preview 3D model</div>
      </transition>
    </div>

    <!-- asset info -->
    <div class="asset-information">
      <div class="related-information">
        <div class="title">Model Information</div>
        <div class="info">
          <div class="keys">
            <div class="key" v-for="(value, key) in relatedInfo">{{key}}</div>
          </div>
          <div class="values">
            <div class="key" v-for="(value, key) in relatedInfo">{{value}}</div>
          </div>
        </div>

        <!-- owner info -->
        <div class="remove-btn" v-if="userIsCreator" @click="deleteAsset">Delete Asset Completely</div>

      </div>
      <div class="performance-information">
        <div class="performance-chart"></div>
        <div class="performance-number">
          <div class="shorthand">{{performanceShorthand}}</div>
          <div class="count">{{(performance.vertices/1000).toFixed(2)}}k verts</div>
        </div>
      </div>
    </div>

  </modal>

</div>
</template>

<script>
import Modal from '../components/Modal'
import AssetViewer from '../components/AssetViewer'
import { mapState } from 'vuex'
import { mapActions } from 'vuex'
import _ from 'lodash'
import moment from 'moment'
const ProgressBar = require('progressbar.js')


export default {
  name: 'assetInfoModal',
  components: {
    Modal: Modal,
    AssetViewer: AssetViewer
  },
  data: function() {
    return {
      loaded: false
    }
  },
  mounted: function() {
    var bar = new ProgressBar.Circle('.performance-chart', {
      strokeWidth: 12,
      easing: 'easeInOut',
      duration: 1400,
      color: '#e4bb86',
      trailColor: '#e6e7e8',
      trailWidth: 3,
      svgStyle: null
    });
    bar.animate(this.performanceBar);
  },
  computed: {
    user: function()          { return this.$store.state.firebaseStore.user },
    userIsCreator: function() { return this.user.uid == this.activeAsset.creator ? true : false },
    activeAsset: function()   { return this.$store.state.firebaseStore.currentAsset },
    performance: function()   { return this.$store.state.firebaseStore.currentAsset.performanceInfo },
    fileURL: function()       { return this.activeAsset.assetUrl },
    modelSizeFormatted: function() {
      const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      let l = 0, n = parseInt(this.activeAsset.modelSize, 10) || 0;
      while(n >= 1024){
        n = n/1024;
        l++;
      }
      return(n.toFixed(n >= 10 || l < 1 ? 0 : 1) + ' ' + units[l]);
    },
    performanceShorthand: function() {
      if (this.performance.vertices <= 20000) { return 'light'}
      if (this.performance.vertices >= 20001 && this.performance.vertices <= 100000) { return 'average' }
      else { return 'heavy' }
    },
    performanceBar: function() {
      if ( (this.performance.vertices / 100000) <= .1 ) { return .1 }
      if ( (this.performance.vertices / 100000) >= .95 ) { return .95 }
      else return ( (this.performance.vertices / 100000) )
    },
    relatedInfo: function() {
      return {
        "file size":  this.modelSizeFormatted,
        "materials": this.performance.drawCalls
      }
    },
  },
  methods: {
    //-- button methods
    handleClickaway: function() {
      this.$store.commit('SET_ASSET_INFO_MODAL_IS_OPEN', false);
    },
    deleteAsset: function() {
      this.$store.dispatch('firebaseStore/deleteAsset', this.activeAsset._id)
        .then((success)=> {
          this.$store.commit('SET_ASSET_INFO_MODAL_IS_OPEN', false);
          console.log('successfully deleted')
        })
    },

    // -- use these if you need them
    emitSuccess: function()   { console.log('success loading model') },
    handleFailure: function() { console.log('failure loaded' )}
  }

}
</script>

<style lang="sass">
@import src/styles/main

#asset-info-modal

  .content-box
    .content-header
      h2
        +userType(big)
        font-weight: normal
        text-transform: none

  .asset-preview
    position: relative
    height: 250px
    width: 100%
    //background: $asset_background
    .asset-image
      background-size: cover
      background-repeat: no-repeat
      height: 100%
      width: 100%
      background-position: 50% 50%
    .button
      +button(false, false, $action_color, fit-content)
      position: absolute
      bottom: 20px
      left: 20px
      padding: 13px 15px
  .asset-information
    padding-top: 20px
    +flexbox
    +systemType(small)

    .related-information
      +flex(1)
      .title
        border-bottom: 3px solid $border_color_light
        padding-bottom: 10px
        margin-bottom: 15px
      .info
        +flexbox
        .keys
          margin-right: 30px
        .key,.value
          padding-bottom: 7px

      .remove-btn
        margin-top: 20px
        +button(false, false, $danger_color, 250px)


    .performance-information
      position: relative
      +flex(0 0 175px)
      height: 175px
      margin-left: 30px
      .performance-chart
        height: 100%
        width: 100%
        position: absolute

      .performance-number
        height: 100%
        width: 100%
        position: absolute
        +flexbox
        +align-items(center)
        +justify-content(center)
        +flex-direction(column)
        .shorthand
          +systemType(big)
        .count
          +systemType(normal)
          padding-top: 10px


</style>
