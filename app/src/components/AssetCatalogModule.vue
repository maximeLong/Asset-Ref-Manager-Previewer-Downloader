<template>
<div id="asset-catalog-module">

  <!-- menu -->
  <div class="catalog-options">
    <div class="group">
      <div class="option" @click="assetList = 'scene'" :class="{active : assetList == 'scene'}">Scene Assets</div>
      <div class="option" @click="getUserAssets" :class="{active : assetList == 'user'}">My Assets</div>
      <div class="option" @click="getSketchfabAssets" :class="{active : assetList == 'sketchfab'}">Sketchfab</div>
    </div>
    <div class="group">
      <div class="option import" @click="openAssetImportModal">Import from file</div>
    </div>
  </div>

  <!-- catalog views, provide key to force component to non-reuse -->
  <transition name="fade" mode="out-in">
    <asset-catalog-schema v-if="assetList == 'scene'" key="scene"
      :schemaAssets="sceneAssets"
      :assetIsUploading="assetStandin"
      :multiSelectEnabled="isSceneAdmin"
      :multiSelectData="{
        icon: 'delete',
        text: 'Remove Assets from Scene',
        click: removeAssetsFromScene
      }"
      :normalClick="openDepthcastAsset"
    ></asset-catalog-schema>

    <asset-catalog-schema v-if="assetList == 'user'" key="user"
      :schemaAssets="userAssets"
      :assetIsUploading="assetStandin"
      :multiSelectEnabled="isSceneAdmin"
      :multiSelectData="{
        icon: 'add_box',
        text: 'Add Your Assets to Scene',
        click: addAssetsToScene
      }"
      :normalClick="openDepthcastAsset"
    ></asset-catalog-schema>

    <asset-catalog-schema v-if="assetList == 'sketchfab'" key="sketchfab"
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
import AssetCatalogSchema from './AssetCatalogSchema'
import _ from 'lodash'

export default {
  name: 'assetCatalogModule',
  components: {
    AssetCatalogSchema
  },
  data: function() {
    return {
      assetList: 'scene'
    }
  },

  //get sceneAssets on module mount, and on scene change (since module will stay active)
  mounted: function() {this.getSceneAssets()},
  watch: {
    currentScene: function() {
      this.assetList = 'scene'
      this.getSceneAssets()
    }
  },

  computed: {
    user: function()           { return this.$store.state.firebaseStore.user },
    currentScene: function()   { return this.$store.getters['firebaseStore/currentScene'] },
    assetStandin: function()   { return this.$store.state.assetStandin },
    isSceneAdmin: function() { return this.currentScene.admin ? true : false },

    sceneAssets: function() {
      return this.$store.state.firebaseStore.assetsInCurrentScene.map((link)=> {
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
      return this.$store.state.firebaseStore.assetsByCurrentUser.map((asset)=> {
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
      return this.$store.state.firebaseStore.sketchfabAssets.map((asset)=> {
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
      this.$store.commit('SET_ASSET_IMPORT_MODAL', {isOpen: true, panelType: 'file'})
    },

    //get asset collections
    getSceneAssets: function() {
      this.$store.dispatch('firebaseStore/getAssetsByScene', this.currentScene._id)
    },
    getUserAssets: function() {
      if (!this.userAssets.length) {
        this.$store.dispatch('firebaseStore/getAssetsByUser', this.user.uid)
        .then( (success)=> { this.assetList = 'user' })
      } else { this.assetList = 'user' }
    },

    //handle asset open actions
    openDepthcastAsset: function(asset) {
      this.$store.dispatch('firebaseStore/getAsset', asset.assetId)
      .then( response => {
        this.$store.commit('SET_ASSET_INFO_MODAL_IS_OPEN', true);
      });
    },

    //handle the multiselect actions
    removeAssetsFromScene: function(multiSelectedAssets) {
      this.$store.dispatch('firebaseStore/removeAssetsByScene', multiSelectedAssets)
      .then( response => { console.log('successfully removed') });
    },
    addAssetsToScene: function(multiSelectedAssets) {
      this.$store.dispatch('firebaseStore/addAssetsToScene', multiSelectedAssets)
      .then( response => {
        this.assetList = 'scene'
        console.log('successfully added')
      });
    },

    //sketchfab
    getSketchfabAssets: function(manualOverride) {
      if (!this.sketchfabAssets.length || manualOverride == true) {
        this.$store.dispatch('firebaseStore/getSketchfabAssets', null)
        .then( (success)=> { this.assetList = 'sketchfab' })
      } else { this.assetList = 'sketchfab' }
    },
    searchSketchfab: function(search) {
      this.$store.dispatch('firebaseStore/getSketchfabAssets', search)
      .then( (success)=> { console.log('search success') })
    },
    openSketchfabAsset: function(asset) {
      this.$store.commit('SET_ASSET_IMPORT_MODAL', {isOpen: true, panelType: 'sketchfab', relatedAsset: asset})
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
