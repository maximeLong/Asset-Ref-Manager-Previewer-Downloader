<template>
<div id="asset-catalog">
  <content-box :title="'Asset Catalog'">

    <div class="catalog-container">
      <div class="asset-container">
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

      <div class="upload-container">
        <div class="devider"></div>
        <div class="open-import" @click="openImport">Import from file</div>
      </div>

    </div>


  </content-box>
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
