<template>
  <div id="side-panel-content">

    <div id="logo">
      <div class="icon"></div>
    </div>

    <!-- main scenes bar, add scene -->
    <div class="sidebar-title">
      <div>My Scenes</div>
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

    <!-- team scenes bar, add team -->
    <!-- <div class="sidebar-title">Team Scenes</div>
    <div class="sidebar-subtitle" v-if="currentTeam">{{currentTeam.name}}</div>
    <div class="scenes team">
      <div class="scenes-list">
        <div class="scene-item" v-for="team in teams">{{team.name}}</div>
      </div>
    </div> -->


  </div>
</template>

<script>

export default {
  name: 'sidePanel',
  data: function(){
    return {}
  },
  computed: {
    scenes: function(){ return this.$store.state.firebaseStore.populatedScenes },
    currentScene: function() { return this.$store.getters['firebaseStore/currentScene'] },

    teams: function(){ return this.$store.getters['teams/list']},
    currentTeam: function() { return this.$store.state.currentTeam },
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
    +flexbox
    +align-items(center)
    +justify-content(center)
    width: 60px
    height: $header_panel_height
    margin-bottom: 20px
    background-color: white
    +clickable
    .icon
      height: 30px
      width: 30px
      border: 2px solid $action_color
      border-radius: 100px

  .sidebar-title, .sidebar-subtitle
    +systemType(big)
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
    +userType(average)
    color: white
    &.teams
      margin-bottom: 0

    .scenes-list
      .scene-item
        padding: 3px 15px
        +clickable
        &:hover
          background-color: $side_panel_hover
          +transition(.25s ease-in-out all)
        &.active
          color: $action_color



</style>
