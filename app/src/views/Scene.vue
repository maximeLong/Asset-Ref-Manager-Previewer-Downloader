<template>
<div id="scene">

    <!-- modules -->
    <div class="scene-modules">
      <content-box :title="'Scene Modules'">
        <div class="buttons" slot="buttons">
          <div class="button active">scene performance</div>
          <div class="button">notes</div>
          <div class="button">control panel</div>
        </div>

        <div class="default-message" v-if="!sceneModules.length">no modules plugged in yet!</div>
        <div class="module-canvas" v-else>

        </div>
      </content-box>
    </div>

    <!-- palette information -->
    <!-- <asset-catalog></asset-catalog> -->

</div>

</template>

<script>
import ContentBox from '../components/ContentBox'
import AssetCatalog from '../components/AssetCatalog'

export default {
  name: 'scene',
  components: {
    ContentBox,
    AssetCatalog
  },
  data: function() {
    return {
      sceneModules: [],
      activeModule: {}
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

<style scoped lang="sass">
@import src/styles/main

#scene
  padding: 50px 30px 30px 30px
  .scene-assets
    margin-top: 40px

</style>
