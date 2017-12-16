<template>
  <div id="side-panel-content">

    <div id="logo">
      <div class="icon"></div>
    </div>

    <!-- main layouts bar, add layout -->
    <div class="sidebar-title">
      <div>My Layouts</div>
      <router-link to="/createlayout">+</router-link>
    </div>
    <div class="layouts">
      <div class="layouts-list">
        <div class="layout-item"
          v-for="layout in layouts"
          @click="goToLayout(layout._id)"
          :class="{ active : checkActive(layout) }">
          {{layout.name}}</div>
      </div>
    </div>

    <!-- team layouts bar, add team -->
    <!-- <div class="sidebar-title">Team Layouts</div>
    <div class="sidebar-subtitle" v-if="currentTeam">{{currentTeam.name}}</div>
    <div class="layouts team">
      <div class="layouts-list">
        <div class="layout-item" v-for="team in teams">{{team.name}}</div>
      </div>
    </div> -->


  </div>
</template>

<script>

export default {
  name: 'sidePanel',
  data: function(){
    return {
    }
  },
  computed: {
    teams: function(){ return this.$store.getters['teams/list']},
    layouts: function(){ return this.$store.getters['layouts/list'] },
    currentTeam: function() { return this.$store.state.currentTeam },
    currentLayout: function() { return this.$store.getters['layouts/current'] }
  },
  methods: {
    goToLayout: function(id) {
      this.$router.push({ name: 'Layout', params: { layout_id: id }})
    },
    checkActive: function(layoutIndex) {
      if (this.currentLayout != null) {
        if (this.currentLayout.name == layoutIndex.name) { return true } else { return false }
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

  .layouts
    border-top: 1px solid $border_color_mid
    padding-top: 10px
    margin: 10px 0 50px 0
    +userType(average)
    color: white
    &.teams
      margin-bottom: 0

    .layouts-list
      .layout-item
        padding: 3px 15px
        +clickable
        &:hover
          background-color: $side_panel_hover
          +transition(.25s ease-in-out all)
        &.active
          color: $action_color



</style>
