<template>
  <div id="app">

    <!-- header -->
    <div id="header-panel">
      <app-header></app-header>
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

      </div>
      <!-- end app content -->
    </div>

  </div>
</template>

<script>

import DmxBoard from './components/DmxBoard'
import CameraFx from './components/CameraFx'
import AppHeader from './components/AppHeader'
import SidePanel from './components/SidePanel'

export default {
  name: 'app',
  components: {
    DmxBoard,
    CameraFx,
    AppHeader,
    SidePanel
  },
  data: function() {
    return {
    }
  },
  methods: {
  },
  computed: {
    activePanel: function() {
      return this.$store.state.activePanel;
    }
  }
}
</script>

<style lang="sass">
@import src/styles/main

#app
  +consoleType(normal)
  color: $ink_black

  .content-box
    background-color: $content_box_background
    border-radius: 3px
    margin-bottom: 30px
    box-shadow: 2px 2px 10px rgba(103, 103, 103, 0.3)
    &:last-of-type
      margin-bottom: 0

    h2.content-header
      padding: 15px 30px
      border-bottom: 1px solid $border_color
    .content-content
      padding: 30px


</style>
