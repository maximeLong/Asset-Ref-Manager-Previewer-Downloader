<template>
<div id="asset-catalog-schema">

  <!-- options -->
  <div class="assets-options">

    <!-- multi select -->
    <div class="multiselect" :class="{ active : multiSelectModeIsOn }">
      <i class="material-icons" @click="toggleMultiSelectMode">{{multiSelectIcon}}</i>
      <transition-group name="faderight">
        <div key="a" v-if="multiSelectModeIsOn" @click="handleMultiSelectClick" class="action-button">Handle {{multiSelectedAssets.length}} Assets</div>
        <div key="c" v-if="multiSelectModeIsOn" @click="toggleMultiSelectMode" class="cancel-button">cancel</div>
      </transition-group>
    </div>

    <!-- search TODO: goes here -->
    <!-- <div class="search"></div> -->

    <!-- custom options -->
    <slot name="options"></slot>
  </div>


  <!-- schema list -->
  <div class="assets-wrap-container">

    <!-- loading container, if necessary -->
    <transition name="fade">
      <div class="asset asset-standin" v-if="assetIsUploading">
        <div class="asset-image-container">
          <dot-loader :color="'#4e4e4e'" :size="'30px'"></dot-loader>
        </div>
      </div>
    </transition>

    <!-- list proper -->
    <div class="asset" v-for="asset in schemaAssets"
      @click="handleAssetClick(asset)"
      :class="{ active : multiSelectedAssets.includes(asset.Id) }">
        <div class="asset-image-container">
          <div class="asset-image" :style="{ 'background-image': 'url(' + asset.thumb + ')' }"></div>
        </div>
      <div class="asset-title">{{asset.name}}</div>
    </div>

  </div>

</div>
</template>

<script>
import DotLoader from 'vue-spinner/src/DotLoader.vue'

export default {
  name: 'assetCatalog',
  components: {
    DotLoader
  },
  props: {
    schemaAssets: Array,
    assetIsUploading: Boolean,
    multiSelectIcon: String,
    multiSelectClick: Function,
    normalClick: Function
  },
  data: function() {
    return {
      multiSelectModeIsOn: false,
      multiSelectedAssets: []
    }
  },

  computed: {},

  methods: {

    handleAssetClick: function(asset) {
      if (this.multiSelectMode) { //handle multiSelected mode
        if (this.multiSelectedAssets.includes(asset.Id)) {
          this.multiSelectedAssets.splice(this.multiSelectedAssets.indexOf(asset.Id), 1)
        } else {
          this.multiSelectedAssets.push(asset.Id)
        }
      }
      else { //handle normal mode
        this.normalClick(asset)
      }
    },

    handleMultiSelectClick: function() {
      this.multiSelectClick(this.multiSelectedAssets)
    },

    toggleMultiSelectMode: function() {
      if (this.multiSelectModeIsOn) {
        this.multiSelectModeIsOn = false;
        this.multiSelectedAssets = [];
      } else {
        this.multiSelectModeIsOn = true;
      }
    }

  }

}
</script>

<style scoped lang="sass">
@import src/styles/main

#asset-catalog-schema
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

    .multiselect
      +systemType(small)
      margin-right: 20px
      +clickable
      +flexbox
      +align-items(center)
      +transition(.35s ease all)
      &:hover
        color: $action_color
        +transition(.35s ease all)
      &.active
        color: $action_color
        +transition(.35s ease all)
      .action-button
        background-color: $action_color
        color: white
        margin-left: 10px
        padding: 7px 15px
      .cancel-button
        padding: 5px 15px
        border: 2px solid $action_color
        color: $action_color
        margin-left: 10px



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
      &.active
        .asset-image-container
          border: 3px solid $action_color
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
