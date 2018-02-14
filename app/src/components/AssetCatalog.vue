ASSET<template>
<div id="asset-catalog">
  <content-box :title="'Asset Catalog'">

    <div class="catalog-container">
      <div class="asset-container">
        <div class="asset" v-for="asset in assets" @click="openAssetInfo(asset)">
            <div class="asset-image-container">
              <div class="asset-image" :style="{ 'background-image': 'url(' + asset.image + ')' }"></div>
            </div>
          <div class="asset-title">{{asset.name}}</div>
        </div>

      </div>

      <div class="upload-container">
        <input v-model="assetSearch" placeholder="search public assets, WIP">
        <div class="devider"></div>
        <div class="open-import" @click="openImport">Import from file</div>
      </div>

    </div>


  </content-box>
</div>

</template>

<script>
import ContentBox from './ContentBox'

export default {
  name: 'assetCatalog',
  components: {
    ContentBox,
  },
  data: function() {
    return {
      assetSearch: ''
    }
  },
  computed: {
    user: function()            { return this.$store.state.auth.user },
    currentScene: function()   { return this.$store.getters['scenes/current'] },
    assets: function()           { return this.currentScene.assets }
  },
  methods: {
    openImport: function() { this.$store.commit('SET_ASSET_IMPORT', true) },
    openAssetInfo: function(selectedAsset) {

      this.$store.dispatch('assets/get', selectedAsset._id)
      .then( response => {
        this.$store.commit('SET_ASSET_INFO', true);
      });
    }
  }

}
</script>

<style scoped lang="sass">
@import src/styles/main

#asset-catalog
  margin-top: 40px
  .catalog-container
    +flexbox
    .asset-container
      +flex(2)
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
          background: radial-gradient(#f1e4d1 0%, #737373 100%)
          border-radius: 5px
          margin-bottom: 5px
          .asset-image
            background-size: contain
            background-position: 50% 50%
            background-repeat: no-repeat
            height: 100%
            width: 100%


    .upload-container
      +flex(.5)
      input
        border-radius: 100px
        padding: 12px 15px
      .devider
        margin: 20px 0
        height: 2px
        background-color: $border_color_light
      .open-import
        +button(false,true)

</style>
