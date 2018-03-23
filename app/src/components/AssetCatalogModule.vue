<template>
<div id="asset-catalog-module">

  <!-- menu -->
  <div class="catalog-options">
    <div class="group">
      <div class="option" @click="getSceneAssets" :class="{active : currentAssetCatalog == 'scene'}">Scene Assets</div>
      <div class="option" @click="getUserAssets" :class="{active : currentAssetCatalog == 'user'}">My Assets</div>
      <div class="option" @click="getSketchfabAssets" :class="{active : currentAssetCatalog == 'sketchfab'}">Sketchfab</div>
    </div>
    <div class="group">
      <div class="option import" @click="openAssetImportModal">Import from file</div>
    </div>
  </div>

  <!-- catalog views, provide key to force component to non-reuse -->
  <transition name="fade" mode="out-in">
    <asset-catalog-schema v-if="currentAssetCatalog == 'scene'" key="scene"
      :schemaAssets="sceneAssets"
      :assetIsUploading="assetStandin.isOn"
      :assetUploadProgress="assetStandin.progress"
      :multiSelectEnabled="isSceneAdmin"
      :multiSelectData="{
        icon: 'delete',
        text: 'Remove Assets from Scene',
        click: removeAssetsFromScene
      }"
      :normalClick="openDepthcastAsset"
    ></asset-catalog-schema>

    <asset-catalog-schema v-if="currentAssetCatalog == 'user'" key="user"
      :schemaAssets="userAssets"
      :assetIsUploading="assetStandin.isOn"
      :assetUploadProgress="assetStandin.progress"
      :multiSelectEnabled="isSceneAdmin"
      :multiSelectData="{
        icon: 'add_box',
        text: 'Add Your Assets to Scene',
        click: addAssetsToScene
      }"
      :normalClick="openDepthcastAsset"
    ></asset-catalog-schema>

    <asset-catalog-schema v-if="currentAssetCatalog == 'sketchfab'" key="sketchfab"
      :schemaAssets="sketchfabAssets"
      :multiSelectEnabled="false"
      :searchEnabled="true"
      :customButtonEnabled="true"
      :customButtonData="{
        icon: 'stars',
        click: getSketchfabAssets
      }"
      :searchClick="searchSketchfab"
      :normalClick="openSketchfabAsset"
    ></asset-catalog-schema>
  </transition>


</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import AssetCatalogSchema from './AssetCatalogSchema'

export default {
  name: 'assetCatalogModule',
  components: {
    AssetCatalogSchema
  },
  data: function() {
    return {}
  },

  //get sceneAssets on module mount, and on scene change (since module will stay active)
  mounted: function() {this.getSceneAssets()},
  watch: {
    currentScene: function() {
      this.getSceneAssets()
    }
  },

  computed: {
    ...mapState('users',    ['user']),
    ...mapState('ux',       ['assetStandin', 'currentAssetCatalog']),
    ...mapGetters('scenes', ['currentScene']),

    isSceneAdmin: function() { return this.currentScene.admin ? true : false },
    sceneAssets: function() {
      return this.$store.state.assets.assetsInCurrentScene.map((link)=> {
        return {
          name: link.assetName,
          thumb: link.assetThumbnailImage,
          assetId: link.assetId,
          uid: link._id, //uid is link id
          original: link
        }
      })
    },
    userAssets: function() {
      return this.$store.state.assets.assetsByCurrentUser.map((asset)=> {
        return {
          name: asset.name,
          thumb: asset.thumbnailImage,
          assetId: asset._id,
          uid: asset._id, //uid is asset id
          original: asset
        }
      })
    },
    sketchfabAssets: function() {
      return this.$store.state.apis.sketchfabAssets.map((asset)=> {
        return {
          name: asset.name,
          thumb: this.parseSketchfabThumb(asset), //avoids undefined error
          assetId: undefined,
          uid: asset.uid, //uid is sketchfab uid
          original: asset
        }
      })
    }

  },

  methods: {
    openAssetImportModal: function() {
      this.$store.commit('ux/SET_ASSET_IMPORT_MODAL', {isOpen: true, panelType: 'file'})
    },

    //get asset collections
    getSceneAssets: function() {
      this.$store.commit('ux/SET_CURRENT_ASSET_CATALOG', 'scene')
      this.$store.dispatch('assets/getAssetsByScene', this.currentScene._id)
    },
    getUserAssets: function() {
      this.$store.commit('ux/SET_CURRENT_ASSET_CATALOG', 'user')
      if (!this.userAssets.length) {
        this.$store.dispatch('assets/getAssetsByUser', this.user.uid)
      }
    },

    //handle asset open actions
    openDepthcastAsset: function(asset) {
      this.$store.dispatch('assets/getAsset', asset.assetId)
      .then( response => {
        this.$store.commit('ux/SET_ASSET_INFO_MODAL_IS_OPEN', true);
      });
    },

    //handle the multiselect actions
    removeAssetsFromScene: function(multiSelectedAssets) {
      this.$store.dispatch('assets/removeAssetsByScene', multiSelectedAssets)
      .then( response => { console.log('successfully removed') });
    },
    addAssetsToScene: function(multiSelectedAssets) {
      this.$store.dispatch('assets/addAssetsToScene', multiSelectedAssets)
      .then( response => {
        this.$store.commit('ux/SET_CURRENT_ASSET_CATALOG', 'scene')
        console.log('successfully added')
      });
    },

    //sketchfab
    getSketchfabAssets: function(manualOverride) {
      this.$store.commit('ux/SET_CURRENT_ASSET_CATALOG', 'sketchfab')
      if (!this.sketchfabAssets.length || manualOverride == true) {
        this.$store.dispatch('apis/getSketchfabAssets', null)
      }
    },
    searchSketchfab: function(search) {
      this.$store.dispatch('apis/getSketchfabAssets', search)
      .then( (success)=> { console.log('search success') })
    },
    openSketchfabAsset: function(asset) {
      this.$store.commit('ux/SET_ASSET_IMPORT_MODAL', {isOpen: true, panelType: 'sketchfab', relatedAsset: asset})
    },
    parseSketchfabThumb: function(asset) {
      try { return asset.thumbnails.images[2].url }
      catch(e) { return asset.thumbnails.images[0].url }
    }

  }

}
</script>

<style scoped lang="sass">
@import src/styles/main

#asset-catalog-module
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

</style>
