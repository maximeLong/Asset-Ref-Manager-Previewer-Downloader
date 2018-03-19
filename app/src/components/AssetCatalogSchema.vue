<template>
<div id="asset-catalog-schema">

  <!-- options -->
  <div class="assets-options">

    <!-- multi select -->
    <div class="multiselect" :class="{ active : multiSelectModeIsOn }" v-if="multiSelectEnabled">
      <div class="title">Scene tools:</div>
      <i class="material-icons" @click="toggleMultiSelectMode">{{multiSelectData.icon}}</i>
      <transition name="faderight">
        <div v-if="multiSelectModeIsOn" @click="handleMultiSelectClick" class="action-button">{{multiSelectData.text}} ({{multiSelectedAssets.length}})</div>
      </transition><transition name="faderight">
        <div v-if="multiSelectModeIsOn" @click="toggleMultiSelectMode" class="cancel-button">cancel</div>
      </transition>
    </div>

    <!-- search-->
    <div class="search" :class="{ active : searchIsActive }" v-if="searchEnabled">
      <i class="material-icons" @click="toggleSearch">search</i>
      <transition name="faderight">
        <input v-if="searchIsActive" v-model="searchInput" ref="search">
      </transition><transition name="faderight">
        <div v-if="searchIsActive" @click="handleSearchClick" class="action-button">Search</div>
      </transition><transition name="faderight">
        <div v-if="searchIsActive" @click="toggleSearch" class="cancel-button">cancel</div>
      </transition>
    </div>

    <!-- custom options -->
    <div class="custom-button" v-if="customButtonEnabled">
      <i class="material-icons" @click="handleCustomClick">{{customButtonData.icon}}</i>
    </div>
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
      :class="{ active : multiSelectedAssets.includes(asset) }">
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
  name: 'assetCatalogSchema',
  components: {
    DotLoader
  },
  props: {
    schemaAssets: Array,
    assetIsUploading: Boolean,
    normalClick: Function,
    //optional settings
    multiSelectEnabled: Boolean,
    multiSelectData: Object, //includes icon, text, click()
    customButtonEnabled: Boolean,
    customButtonData: Object, //includes icon, click()
    searchEnabled: Boolean,
    searchClick: Function,
  },
  data: function() {
    return {
      multiSelectModeIsOn: false,
      multiSelectedAssets: [],
      searchInput: '',
      searchIsActive: false
    }
  },

  computed: {},
  methods: {

    handleAssetClick: function(asset) {
      if (this.multiSelectModeIsOn) { //handle multiSelected mode
        if (this.multiSelectedAssets.includes(asset)) {
          this.multiSelectedAssets.splice(this.multiSelectedAssets.indexOf(asset), 1)
        } else {
          this.multiSelectedAssets.push(asset)
        }
      }
      else { //handle normal mode
        this.normalClick(asset)
      }
    },

    handleCustomClick: function() {
      //turn off everything before click handles
      this.searchInput = '';
      this.searchIsActive = false;
      this.multiSelectModeIsOn = false;
      this.multiSelectedAssets = [];
      this.customButtonData.click(true)
    },

    handleMultiSelectClick: function() {
      this.multiSelectData.click(this.multiSelectedAssets)
    },
    toggleMultiSelectMode: function() {
      if (this.multiSelectModeIsOn) {
        this.multiSelectModeIsOn = false;
        this.multiSelectedAssets = [];
      } else {
        this.multiSelectModeIsOn = true;
      }
    },

    handleSearchClick: function() {
      this.searchClick(this.searchInput)
    },
    toggleSearch: function() {
      if (this.searchIsActive) {
        this.searchInput = '';
        this.searchIsActive = false;
      } else {
        this.searchIsActive = true;
        this.$nextTick(() => this.$refs.search.focus())
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
    +systemType(small)
    +flexbox
    +align-items(center)
    +flex-direction(row)

    .multiselect,.search
      margin-right: 15px
      padding-right: 12px
      border-right: 2px solid $border_color_light

      +flexbox
      +align-items(center)
      +flex-direction(row)
      +align-items(center)
      .title
        margin-right: 8px
      i
        +clickable
        +transition(.35s ease all)
        &:hover
          color: $action_color
          +transition(.35s ease all)
      &.active
        i
          color: $action_color
      .action-button
        +clickable
        background-color: $action_color
        color: white
        margin-left: 10px
        padding: 7px 15px
      .cancel-button
        +clickable
        padding: 5px 15px
        border: 2px solid $action_color
        color: $action_color
        margin-left: 10px
    .search
      input
        border: none
        padding: 5px
        border-radius: 0
        font-size: 15px
        line-height: 15px
        outline: 0
        outline: none
        margin-left: 5px
        border-bottom: 2px solid $border_color_mid
        +transition(.35s ease all)
        &:focus
          +transition(.35s ease all)
          border: none
          border-bottom: 2px solid $action_color
    .custom-button
      i
        +clickable
        +transition(.35s ease all)
        &:hover
          color: $action_color
          +transition(.35s ease all)

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
