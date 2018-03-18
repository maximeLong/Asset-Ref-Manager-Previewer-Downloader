<template>
<div id="asset-catalog-module">

  <!-- menu -->
  <div class="catalog-options">
    <div class="group">
      <div class="option" @click="assetList = 'scene'" :class="{active : assetList == 'scene'}">Scene Assets</div>
      <div class="option" @click="getUserAssets" :class="{active : assetList == 'user'}">My Assets</div>
      <div class="option">Sketchfab</div>
      <div class="option">Depthcast Curated</div>
    </div>
    <div class="group">
      <div class="option import" @click="openAssetImportModal">Import from file</div>
    </div>
  </div>

  <!-- catalog views -->
  <asset-catalog-schema v-if="assetList == 'scene'"
    :schemaAssets="sceneAssets"
    :assetIsUploading="assetStandin"
    :multiSelectIcon="'delete'"
    :multiSelectClick="removeAssetsFromScene"
    :normalClick="openSceneAsset"
  ></asset-catalog-schema>

  <asset-catalog-schema v-if="assetList == 'user'"
    :schemaAssets="userAssets"
    :assetIsUploading="assetStandin"
    :multiSelectIcon="'add_box'"
    :multiSelectClick="addAssetsToScene"
    :normalClick="openUserAsset"
  ></asset-catalog-schema>


    <!-- <div class="assets-options" v-if="assetList == 'scene'">
      <div class="option" :class="{ active : removing }">
        <i class="material-icons" @click="handleRemovalToggle">delete</i>
        <transition name="faderight">
          <div v-if="removing" @click="removeAssets" class="action-button">Remove {{removalCollection.length}} selected Assets</div>
        </transition>
        <transition name="faderight">
          <div v-if="removing" @click="handleRemovalToggle" class="cancel-button">cancel</div>
        </transition>
      </div>
    </div>
    <div class="assets-options" v-if="assetList == 'user'">
      <div class="option" :class="{ active : adding }">
        <i class="material-icons" @click="handleAddingToggle">add_box</i>
        <transition name="faderight">
          <div v-if="adding" @click="addAssets" class="action-button">Add {{addingCollection.length}} Assets to scene</div>
        </transition>
        <transition name="faderight">
          <div v-if="adding" @click="handleAddingToggle" class="cancel-button">cancel</div>
        </transition>
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

      <div class="asset" v-for="asset in sceneAssets"
        v-if="assetList == 'scene'"
        @click="handleAssetClick(asset, asset.assetId)"
        :class="{ active : removalCollection.includes(asset._id) }">
          <div class="asset-image-container">
            <div class="asset-image" :style="{ 'background-image': 'url(' + asset.assetThumbnailImage + ')' }"></div>
          </div>
        <div class="asset-title">{{asset.assetName}}</div>
      </div>

      <div class="asset" v-for="asset in userAssets"
        v-if="assetList == 'user'"
        @click="handleAssetClick(asset, asset._id)"
        :class="{ active : addingCollection.includes(asset._id) }">
          <div class="asset-image-container">
            <div class="asset-image" :style="{ 'background-image': 'url(' + asset.thumbnailImage + ')' }"></div>
          </div>
        <div class="asset-title">{{asset.name}}</div>
      </div>
    </div>
  </div>  -->

</div>
</template>

<script>
import AssetCatalogSchema from './AssetCatalogSchema'

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
  watch: { currentScene: function() {this.getSceneAssets()} },

  computed: {
    user: function()           { return this.$store.state.firebaseStore.user },
    currentScene: function()   { return this.$store.getters['firebaseStore/currentScene'] },
    assetStandin: function()   { return this.$store.state.assetStandin },

    sceneAssets: function() {
      return this.$store.state.firebaseStore.assetsInCurrentScene
    },
    userAssets: function() {
      return this.$store.state.firebaseStore.assetsByCurrentUser
    },
  },

  methods: {
    openAssetImportModal: function() { this.$store.commit('SET_ASSET_IMPORT_MODAL_IS_OPEN', true) },

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
    openSceneAsset: function(asset) {
      this.$store.dispatch('firebaseStore/getAsset', asset.Id)
      .then( response => {
        this.$store.commit('SET_ASSET_INFO_MODAL_IS_OPEN', true);
      });
    },
    openUserAsset: function(asset) {
      this.$store.dispatch('firebaseStore/getAsset', asset.Id)
      .then( response => {
        this.$store.commit('SET_ASSET_INFO_MODAL_IS_OPEN', true);
      });
    },

    //handle the multiselect actions
    removeAssetsFromScene: function(multiSelectedAssets) {
      this.$store.dispatch('firebaseStore/removeAssetsByScene', this.multiSelectedAssets)
      .then( response => { console.log('successfully removed') });
    },
    addAssetsToScene: function(multiSelectedAssets) {
      return
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
