<template>
  <div id="app">

    <!-- side panel -->
    <div id="side-panel">
      <side-panel></side-panel>
    </div>

    <div id="main-panel">

      <div id="header-panel">
        <app-header></app-header>
        <options-panel v-if="userPanel.open"></options-panel>
      </div>

      <div id="app-content">
        <!-- views -->
        <router-view></router-view>

        <!-- full screen modals -->
        <scene-options-modal v-if="sceneOptionsModalIsOpen"></scene-options-modal>
        <asset-import-modal v-if="assetImportModal.isOpen"></asset-import-modal>
        <asset-info-modal v-if="assetInfoModalIsOpen"></asset-info-modal>

      </div>

    </div>

  </div>
</template>

<script>

import AppHeader from './components/AppHeader'
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
    ...mapState('ux', [
      'activePanel',
      'userPanel',
      'sceneOptionsModalIsOpen',
      'assetImportModal',
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
