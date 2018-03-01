<template>
  <div id="app">

    <!-- side panel -->
    <div id="side-panel">
      <side-panel></side-panel>
    </div>

    <div id="main-panel">

      <div id="header-panel">
        <app-header></app-header>
        <scene-header v-if="sceneIsOpen"></scene-header>
        <options-panel v-if="userPanel.open"></options-panel>
      </div>

      <div id="app-content" :class="{ openScene : sceneIsOpen }">
        <!-- views -->
        <router-view></router-view>

        <!-- full screen modals -->
        <scene-options-modal v-if="sceneOptionsModalIsOpen"></scene-options-modal>
        <asset-import-modal v-if="assetImportModalIsOpen"></asset-import-modal>
        <asset-info-modal v-if="assetInfoModalIsOpen"></asset-info-modal>

      </div>

    </div>

  </div>
</template>

<script>

import AppHeader from './components/AppHeader'
import SceneHeader from './components/SceneHeader'
import SceneOptionsModal from './components/SceneOptionsModal'
import AssetImportModal from './components/AssetImportModal'
import AssetInfoModal from './components/AssetInfoModal'
import OptionsPanel from './components/OptionsPanel'
import SidePanel from './components/SidePanel'

import { mapState } from 'vuex'
import _ from 'lodash'

export default {
  name: 'app',
  components: {
    AppHeader,
    SceneHeader,
    SceneOptionsModal,
    AssetImportModal,
    AssetInfoModal,
    OptionsPanel,
    SidePanel
  },
  data: function() {
    return {}
  },
  methods: {},
  computed: {
    sceneIsOpen: function() {
      if (this.$store.getters['firebaseStore/currentScene'] == null || this.route.name != 'Scene') {
        return false
      } else { return true }
    },
    ...mapState([
      'activePanel',
      'userPanel',
      'route',
      'sceneOptionsModalIsOpen',
      'assetImportModalIsOpen',
      'assetInfoModalIsOpen'
    ])
  }
}
</script>

<style lang="sass">
@import src/styles/main

#app
  +userType(average)


</style>
