<template>
<div id="asset-info">

  <content-box :title="activeAsset.name" v-on-clickaway="handleClickAway">

    <div class="asset-preview">
      <div class="asset-image" v-if="!loaded"
        :style="{ 'background-image': 'url(data:image/jpg;base64,' + activeAsset.thumbnailImage.small + ')' }">
      </div>
      <asset-viewer v-else
        :fromServer="true"
        :showSnapButton="false"
        :showWireframeButton="true"
        :serverUrl="fileURL"
        v-on:loadSuccess="emitSuccess"
        v-on:loadFailure="handleFailure"
      ></asset-viewer>

      <transition name="fade">
        <div class="button" v-if="!loaded" @click="loaded = true">preview 3D model</div>
      </transition>
    </div>

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
      </div>

      <div class="performance-information">
        <div class="performance-chart"></div>
        <div class="performance-number">
          <div class="shorthand">{{performanceShorthand}}</div>
          <div class="count">{{activeAsset.performanceInfo.vertices}} verts</div>
        </div>
      </div>

    </div>
  </content-box>

</div>
</template>

<script>
import ContentBox from '../components/ContentBox'
import AssetViewer from '../components/AssetViewer'
import { mapState } from 'vuex'
import { mapActions } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'
import _ from 'lodash'
import moment from 'moment'


export default {
  name: 'assetInfo',
  components: {
    ContentBox: ContentBox,
    AssetViewer: AssetViewer
  },
  mixins: [ clickaway ],
  data: function() {
    return {
      loaded: false,
      relatedInfo: {}
    }
  },
  created: function() {
    this.relatedInfo = {
      "file size": this.modelSizeFormatted,
      "draw calls": this.activeAsset.performanceInfo.drawCalls,
      "last updated": moment(this.activeAsset.updatedAt).fromNow()
    }
  },

  computed: {
    user: function()            { return this.$store.state.auth.user },
    activeAsset: function()      { return this.$store.getters['assets/current'] },
    fileURL: function()         { return this.activeAsset.modelURL },
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
      if (this.activeAsset.performanceInfo.vertices <= 20000) {
        return 'small'
      }
      if (this.activeAsset.performanceInfo.vertices >= 20001 && this.activeAsset.performanceInfo.vertices <= 100000) {
        return 'average'
      } else {
        return 'big'
      }
    }
  },
  methods: {
    //-- button methods
    //
    handleClickAway: function(e) {
      //TODO: better clickaway handler - have to catch button presses on form bcuz bugs
      if (_.includes(e.target.classList, 'button')) { return } else {
        this.$store.commit('SET_ASSET_INFO', false);
      }
    },

    // -- use these if you need them
    //
    emitSuccess: function()   { console.log('success loading model') },
    handleFailure: function() { console.log('failure loaded' )}

  }

}
</script>

<style lang="sass">
@import src/styles/main

#asset-info
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

    .asset-preview
      position: relative
      height: 250px
      width: 100%
      background: radial-gradient(#f1e4d1 0%, #737373 100%)
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
        color: $border_color_mid
        .title
          border-bottom: 1px solid $border_color_mid
          padding-bottom: 7px
          margin-bottom: 12px
        .info
          +flexbox
          .keys
            margin-right: 30px
          .key,.value
            padding-bottom: 4px


      .performance-information
        position: relative
        +flex(0 0 175px)
        height: 175px
        margin-left: 30px
        .performance-chart
          height: 100%
          width: 100%
          position: absolute
          border: 20px solid $border_color_light
          border-radius: 100%

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
