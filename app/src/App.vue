<template>
  <div id="app">

    <!-- header -->
    <div id="header-panel">
      <app-header></app-header>
      <user-panel v-if="userPanel.open"></user-panel>
    </div>

    <div id="main-panel">
      <div id="side-panel">
        <side-panel></side-panel>
      </div>

      <div id="app-content">

        <!-- router hack -->
        <div v-if="activePanel == 'dmxBoard'">
          <dmx-board></dmx-board>
        </div>
        <div v-if="activePanel == 'cameraFX'">
          <camera-fx></camera-fx>
        </div>

        <div v-if="activePanel == 'teamView'">
          <team-view></team-view>
        </div>

        <div v-if="activePanel == 'sceneView'">
          <scene-view></scene-view>
        </div>

      </div>
      <!-- end app content -->
    </div>

  </div>
</template>

<script>

import DmxBoard from './components/DmxBoard'
import CameraFx from './components/CameraFx'
import TeamView from './components/TeamView'
import SceneView from './components/SceneView'

import AppHeader from './components/AppHeader'
import UserPanel from './components/UserPanel'

import SidePanel from './components/SidePanel'

export default {
  name: 'app',
  components: {
    DmxBoard,
    CameraFx,
    TeamView,
    SceneView,

    AppHeader,
    UserPanel,
    SidePanel
  },
  data: function() {
    return {
    }
  },
  methods: {
  },
  computed: {
    activePanel: function() { return this.$store.state.activePanel },
    userPanel: function() { return this.$store.state.userPanel }
  }
}
</script>

<style lang="sass">
@import src/styles/main

#app
  +consoleType(normal)
  color: $ink_black

  .page-header
    margin-bottom: 30px
    h2
      +clickable
      font-size: 15px
      margin-top: -5px
      color: $action_color


</style>
