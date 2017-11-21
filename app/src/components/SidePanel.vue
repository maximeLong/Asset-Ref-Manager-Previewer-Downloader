<template>
  <div id="side-panel-content">

    <div id="logo">
      <div class="icon"></div>
    </div>

    <!-- main layouts bar, add layout -->
    <div class="sidebar-title">My Layouts</div>
    <div class="layouts">
      <div class="layouts-list">
        <div class="layout-item" v-for="n in 4">layout {{n}}</div>
      </div>
    </div>

    <!-- team layouts bar, add team -->
    <div class="sidebar-title">Team Layouts</div>
    <div class="sidebar-subtitle">Team Name</div>
    <div class="layouts team">
      <div class="layouts-list">
        <div class="layout-item" v-for="n in 4">layout {{n}}</div>
      </div>
    </div>

    <!-- <div class="option other"
      @click="setPanel('teamView')"
      :class="{ active: activePanel == 'teamView' }"></div>
    <div class="option move"
      @click="setPanel('sceneView')"
      :class="{ active: activePanel == 'sceneView' }"></div>

    <div class="option fx"
      @click="setPanel('cameraFX')"
      :class="{ active: activePanel == 'cameraFX' }"></div>
    <div class="option dmx"
      @click="setPanel('dmxBoard')"
      :class="{ active: activePanel == 'dmxBoard' }"></div> -->

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
    activePanel: function() {
      return this.$store.state.activePanel;
    }
  },
  methods: {
    setPanel: function(value){
      this.$store.commit('SET_ACTIVE_PANEL', value);
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
    padding: 0 0 0 15px
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



</style>
