<template>
<div id="asset-info">

  <content-box :title="activeAsset.name">

    <div class="asset-preview"

    <!-- view asset -->
    <asset-viewer v-if="loaded"
      :fromServer="true"
      :showSnapButton="false"
      :showWireframeButton="true"
      :serverUrl="fileURL"
      v-on:loadSuccess="emitSuccess"
      v-on:loadFailure="handleFailure"
    ></asset-viewer>

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


export default {
  name: 'assetInfo',
  components: {
    ContentBox: ContentBox,
    AssetViewer: AssetViewer
  },
  mixins: [ clickaway ],
  data: function() {
    return {
      loaded: false
    }
  },
  mounted: function() {

    this.loaded = true;

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

    // --
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







</style>
