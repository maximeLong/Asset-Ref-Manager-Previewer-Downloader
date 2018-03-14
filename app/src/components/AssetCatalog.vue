<template>
<div id="asset-catalog">

  <div class="catalog-options">
    <div class="group">
      <div class="option active">Scene Assets</div>
      <div class="option">My Assets</div>
      <div class="option">Sketchfab</div>
      <div class="option">Depthcast Curated</div>
    </div>
    <div class="group">
      <div class="option import" @click="openImport">Import from file</div>
    </div>
  </div>


  <div class="catalog-assets">

    <div class="assets-options">
      <div class="option add">Add Assets</div>
      <div class="devider"></div>
      <div class="option remove">
        <div class="title" @click="removing = true">Remove Assets</div>
        <div v-if="removing" class="submit" @click="submitRemoving"></div>
      </div>
    </div>

    <div class="assets-wrap-container">
      <transition name="fade">
        <div class="asset asset-standin" v-if="assetStandin">
          <div class="asset-image-container">
            <dot-loader :color="'#4e4e4e'" :size="'30px'"></dot-loader>
          </div>
        </div>
      </transition>
      <div class="asset" v-for="asset in assets" @click="openAssetInfo(asset)">
          <div class="asset-image-container">
            <div class="asset-image" :style="{ 'background-image': 'url(' + asset.assetThumbnailImage + ')' }"></div>
          </div>
        <div class="asset-title">{{asset.assetName}}</div>
      </div>
    </div>
  </div>

</div>
</template>

<script>
import ContentBox from './ContentBox'
import DotLoader from 'vue-spinner/src/DotLoader.vue'

export default {
  name: 'assetCatalog',
  components: {
    ContentBox,
    DotLoader
  },
  data: function() {
    return {
      removing: false
    }
  },
  mounted: function() {
    this.findCurrentSceneAssets()
  },
  watch: {
    currentScene: function (newVal, oldVal) {
      this.findCurrentSceneAssets()
    }
  },

  computed: {
    currentScene: function()    { return this.$store.getters['firebaseStore/currentScene'] },
    assets: function()          { return this.$store.state.firebaseStore.assetsInCurrentScene },
    assetStandin: function()    { return this.$store.state.assetStandin },
  },

  methods: {
    //-- modal opens
    openImport: function() { this.$store.commit('SET_ASSET_IMPORT_MODAL_IS_OPEN', true) },

    openAssetInfo: function(selectedAsset) {
      this.$store.dispatch('firebaseStore/getAsset', selectedAsset.assetId)
      .then( response => {
        this.$store.commit('SET_ASSET_INFO_MODAL_IS_OPEN', true);
      });
    },

    findCurrentSceneAssets: function() {
      this.$store.dispatch('firebaseStore/getAssetsByScene', this.currentScene._id)
    }
  }

}
</script>

<style scoped lang="sass">
@import src/styles/main

#asset-catalog
  height: 100%
  width: 100%
  +flexbox
  +flex-direction(row)
  .catalog-options
    +flex(0 0 200px)
    +flexbox
    +flex-direction(column)
    +justify-content(space-between)
    height: 100%
    border-right: 1px solid $border_color_light
    .option
      +flexbox
      +align-items(center)
      height: 50px
      +clickable
      +systemType(small)
      padding: 0 30px
      border-top: 1px solid $border_color_light
      &:first-of-type
        border-top: none
      &.import
        background-color: $action_color
        color: white
      &.active
        color: $active_color


  .catalog-assets
    height: 100%
    width: 100%
    .assets-options
      height: 51px
      width: 100%
      padding: 0 30px
      border-bottom: 1px solid $border_color_light
      +flexbox
      +align-items(center)
      +flex-direction(row)
      .option
        +systemType(small)
        border: 2px solid $border_color_light
        padding: 7px 15px
        +clickable
        .title
        .submit
      .devider
        margin: 0 20px
        height: 5px
        width: 5px
        border-radius: 100%
        background-color: $border_color_light


    .assets-wrap-container
      padding: 30px
      height: calc(100% - 51px)
      +flex(1)
      overflow-y: scroll

      +flexbox
      +align-content(flex-start)
      -webkit-flex-wrap: wrap
      flex-wrap: wrap
      .asset
        margin: 0 15px 30px 0
        +clickable
        .asset-image-container
          height: 100px
          width: 150px
          background: $asset_background
          border-radius: 30px
          margin-bottom: 5px
          overflow: hidden
          .asset-image
            background-size: cover
            background-repeat: no-repeat
            height: 100%
            width: 100%
            background-position: 50% 50%
            +transition(.35s ease all)
            &:hover
              +transition(.35s ease all)
              +scale(1.15)
        .asset-title
          +userType(small)
          padding-left: 5px
          max-width: 150px

      .asset-standin
        .asset-image-container
          +flexbox
          +align-items(center)
          +justify-content(center)

</style>
