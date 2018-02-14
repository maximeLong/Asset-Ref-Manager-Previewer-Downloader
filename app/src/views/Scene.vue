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
    <asset-catalog></asset-catalog>

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
  computed: {
    user: function()            { return this.$store.state.auth.user },
    userIsLoggedIn: function()  { return this.user ? true : false },
    currentScene: function()    { return this.$store.state.currentScene },
  },
  methods: {
    fetchData: function() {
      //mirror of beforeEnter on router
      this.$store.dispatch('scenes/get', [this.$route.params.scene_id])
      .then(success => {
        console.log('scene success', success)
      })
      .catch(error => { console.log('scene error', error) })
    }
  },
  watch: {
    '$route': 'fetchData'
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
