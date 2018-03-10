<template>
<div id="asset-catalog">

  <div class="catalog-options">
    <div class="option">Scene Assets</div>
    <div class="option">My Assets</div>
    <div class="option locked">
      <div class="open-import" @click="openImport">Import from file</div>
    </div>
  </div>


  <div class="catalog-assets">
    <div class="assets-wrap-container">
      <div class="asset" v-for="asset in assets" @click="openAssetInfo(asset)">
          <div class="asset-image-container">
            <div class="asset-image" :style="{ 'background-image': 'url(data:image/jpg;base64,' + asset.thumbnailImage + ')' }"></div>
          </div>
        <div class="asset-title">{{asset.name}}</div>
      </div>

      <transition name="fade">
        <div class="asset asset-standin" v-if="assetStandin">
          <div class="asset-image-container">
            <dot-loader :color="'#4e4e4e'" :size="'30px'"></dot-loader>
          </div>
        </div>
      </transition>
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
    return {}
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
    user: function()            { return this.$store.state.auth.user },
    currentScene: function()    { return this.$store.getters['scenes/current'] },
    assets: function()          { return this.$store.getters['assets/list'] },
    assetStandin: function()    { return this.$store.state.assetStandin },
  },

  methods: {
    //-- modal opens
    openImport: function() { this.$store.commit('SET_ASSET_IMPORT_MODAL_IS_OPEN', true) },
    openAssetInfo: function(selectedAsset) {
      //TODO: this costs a server request, but also the information is hot (if likes or scene adds happen)
      this.$store.dispatch('assets/get', selectedAsset._id)
      .then( response => {
        this.$store.commit('SET_ASSET_INFO_MODAL_IS_OPEN', true);
      });
    },

    //-- generate asset lists
    baseAssetFind: function(params) {
      this.$store.dispatch('assets/find', params)
        .then(success => { console.log('asset list updated', success) })
        .catch(error =>  { console.log('scene error', error) })
    },
    findCurrentSceneAssets: function() {
      let params = {query: {"scenes": { "$in" : [this.$store.getters['scenes/current']._id]} }};
      this.baseAssetFind(params);
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
    height: 100%
    border-right: 1px solid $border_color_light
    position: relative
    .option
      +clickable
      +systemType(small)
      padding: 15px 30px
      border-bottom: 1px solid $border_color_light
      &.locked
        padding: 0
        width: 100%
        position: absolute
        bottom: 0
      .open-import
        +button(false,false, $action_color)
        border-radius: 0


  .catalog-assets
    padding: 30px
    height: 100%
    +flex(1)
    overflow-y: scroll

    .assets-wrap-container
      +flexbox
      -webkit-flex-wrap: wrap
      flex-wrap: wrap
      .asset
        margin: 0 20px 20px 0
        +clickable
        .asset-image-container
          height: 100px
          width: 150px
          border: 1px solid $border_color_light
          background: $asset_background
          border-radius: 3px
          margin-bottom: 5px
          .asset-image
            background-size: cover
            background-repeat: no-repeat
            height: 100%
            width: 100%
            background-position: 50% 50%
      .asset-standin
        .asset-image-container
          +flexbox
          +align-items(center)
          +justify-content(center)

</style>
