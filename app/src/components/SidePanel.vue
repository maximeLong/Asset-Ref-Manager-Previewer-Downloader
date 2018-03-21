<template>
  <div id="side-panel-content">

    <div id="logo">
      <div class="icon">Depthcast</div>
    </div>

    <!-- main scenes bar, add scene -->
    <div class="sidebar-title">
      <div>Scenes</div>
      <router-link to="/createscene">+</router-link>
    </div>
    <div class="scenes">
      <div class="scenes-list">
        <div class="scene-item"
          v-for="scene in scenes"
          @click="goToScene(scene._id)"
          :class="{ active : checkActive(scene) }">
          {{scene.name}}</div>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'sidePanel',
  data: function(){
    return {}
  },
  computed: {
    scenes: function(){ return this.$store.state.scenes.populatedScenes },
    currentScene: function() { return this.$store.getters['scenes/currentScene'] },
  },
  methods: {
    goToScene: function(id) {
      this.$router.push({ name: 'Scene', params: { scene_id: id }})
    },
    checkActive: function(sceneIndex) {
      if (this.currentScene != null) {
        if (this.currentScene.name == sceneIndex.name) { return true } else { return false }
      } else { return false }
    }
  }

}
</script>

<style scoped lang="sass">
@import src/styles/main
#side-panel-content
  height: 100%
  width: 100%

  #logo
    width: 100%
    height: $header_panel_height
    margin-bottom: 20px
    background-color: #424242
    padding: 12px 15px
    +clickable
    .icon
      +systemType(small)
      letter-spacing: 4px
      font-weight: normal
      font-size: 13px
      +flexbox
      +align-items(center)
      +justify-content(center)
      color: white
      width: 100%
      height: 100%
      border: 1px solid white

  .sidebar-title, .sidebar-subtitle
    +systemType(average)
    color: white
    padding: 0 15px
    +flexbox
    +align-items(center)
    +justify-content(space-between)
  .sidebar-subtitle
    +systemType(average)
    color: white

  .scenes
    border-top: 1px solid $border_color_mid
    padding-top: 10px
    margin: 10px 0 50px 0
    +userType(small)
    color: white
    &.teams
      margin-bottom: 0

    .scenes-list
      .scene-item
        padding: 7px 15px
        +clickable
        &:hover
          background-color: $side_panel_hover
          +transition(.25s ease-in-out all)
        &.active
          color: $active_color_light



</style>
