<template>
<div id="scene">

  <scene-header></scene-header>

  <div class="scene-main">
    <div id="scene-modules">
      <div class="module"
        v-for="module in modules"
        :class="{ active : activeModule == module.name }"
        @click="activeModule = module.name">{{module.name}}</div>
    </div>

    <!-- catalog -->
    <div id="scene-active-module">
      <asset-catalog v-if="activeModule == 'Asset Catalog'"></asset-catalog>
    </div>
  </div>

</div>
</template>

<script>
import ContentBox from '../components/ContentBox'
import AssetCatalog from '../components/AssetCatalog'
import SceneHeader from '../components/SceneHeader'


export default {
  name: 'scene',
  components: {
    ContentBox,
    AssetCatalog,
    SceneHeader
  },
  data: function() {
    return {
      modules: [
        { name: 'Asset Catalog' },
        { name: 'Notes' },
        { name: 'Interactive Stream' },
        { name: 'Performance Monitor' },
        { name: 'Director Panel' }
      ],
      activeModule: 'Asset Catalog'
    }
  },
  mounted: function() {
    this.getSceneData()
  },
  computed: {
    user: function()              { return this.$store.state.firebaseStore.user },
    currentSceneIndex: function() { return this.$store.state.firebaseStore.currentSceneIndex },
    scenes: function()            { return this.$store.state.firebaseStore.populatedScenes },
    currentScene: function()      { return this.$store.getters['firebaseStore/currentScene'] }
  },
  methods: {
    getSceneData: function() {

      //get users in scene
      this.$store.dispatch('firebaseStore/getUsersByScene', this.$route.params.scene_id)

      //change the currentSceneIndex > updates currentScene getter
      var sceneIndex = _.findIndex(this.scenes, {_id: this.$route.params.scene_id} );
      if (sceneIndex !== -1) {
        this.$store.commit('firebaseStore/SET_CURRENT_SCENE_INDEX', sceneIndex);
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
            background-color: $active_color
            top: 43px
            width: 100%

    #scene-active-module
      background-color: $content_box_background
      box-shadow: 2px 2px 10px rgba(103, 103, 103, 0.3)
      margin-top: 30px
      height: calc(100% - 90px)

</style>
