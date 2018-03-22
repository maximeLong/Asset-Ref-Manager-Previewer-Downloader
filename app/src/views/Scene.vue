<template>
<div id="scene">

  <scene-header></scene-header>

  <div class="scene-main">
    <div id="scene-modules">
      <div class="module"
        v-for="module in modules"
        :class="{ active : activeModule == module.name, inactive : module.inactive }"
        @click="handleModuleClick(module)">{{module.name}}</div>
    </div>

    <!-- catalog -->
    <div id="scene-active-module">
      <asset-catalog-module v-if="activeModule == 'Asset Catalog'"></asset-catalog-module>
    </div>
  </div>

</div>
</template>

<script>
import ContentBox from '../components/ContentBox'
import AssetCatalogModule from '../components/AssetCatalogModule'
import SceneHeader from '../components/SceneHeader'


export default {
  name: 'scene',
  components: {
    ContentBox,
    AssetCatalogModule,
    SceneHeader
  },
  data: function() {
    return {
      modules: [
        { name: 'Asset Catalog', inactive: false },
        { name: 'Interactive Stream', inactive: false },
        { name: 'Notes', inactive: true },
        { name: 'Performance Monitor', inactive: true },
        { name: 'Director Panel', inactive: true }
      ],
      activeModule: 'Asset Catalog'
    }
  },
  mounted: function() {
    this.getSceneData()
  },
  computed: {
    user: function()              { return this.$store.state.users.user },
    currentSceneIndex: function() { return this.$store.state.scenes.currentSceneIndex },
    scenes: function()            { return this.$store.state.scenes.populatedScenes },
    currentScene: function()      { return this.$store.getters['scenes/currentScene'] }
  },
  methods: {

    handleModuleClick: function(module) {
      if (!module.inactive) {
        this.activeModule = module.name;
      }
    },

    getSceneData: function() {
      //get users in scene
      this.$store.dispatch('scenes/getUsersByScene', this.$route.params.scene_id)
      //change the currentSceneIndex > updates currentScene getter
      var sceneIndex = _.findIndex(this.scenes, {_id: this.$route.params.scene_id} );
      if (sceneIndex !== -1) {
        this.$store.commit('scenes/SET_CURRENT_SCENE_INDEX', sceneIndex);
      }
    }
  },
  watch: {
    //imitate mounted() on scene change
    $route (to, from) {
      if (to.name == 'Scene') {
        this.getSceneData()
      }
    }
  }

}
</script>

<style lang="sass">
@import src/styles/main

#scene
  height: 100%

  .scene-main
    padding: 0 30px 30px 30px
    height: calc(100% - 100px)

    #scene-modules
      +flexbox
      +align-items(center)
      +justify-content(space-between)
      height: 60px
      margin-top: -30px
      background-color: white
      border: 1px solid $border_color_light
      padding: 0 30px
      +systemType(small)
      .module
        +clickable
        padding: 12px 0px
        &.active
          position: relative
          color: $active_color
          &::before
            content: ''
            position: absolute
            height: 8px
            background-color: $active_color_light
            top: 43px
            width: 100%
        &.inactive
          color: $border_color_light
          cursor: default
          position: relative
          &::before
            content: ''
            opacity: 0
            +transition(.35s ease all)
          &:hover
            &::before
              opacity: 1
              +transition(.35s ease all)
              content: 'coming soon!'
              position: absolute
              color: white
              background-color: $side_panel_color
              top: 40px
              text-align: center
              padding: 10px 0px
              width: 120px


    #scene-active-module
      background-color: $content_box_background
      box-shadow: 2px 2px 10px rgba(103, 103, 103, 0.3)
      margin-top: 30px
      height: calc(100% - 90px)

</style>
