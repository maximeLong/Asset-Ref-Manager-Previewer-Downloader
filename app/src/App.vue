asset<template>
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
        <scene-options v-if="sceneOptions"></scene-options>
        <asset-import v-if="assetImport"></asset-import>
        <asset-info v-if="assetInfo"></asset-info>

      </div>

    </div>

  </div>
</template>

<script>

import AppHeader from './components/AppHeader'
import SceneHeader from './components/SceneHeader'
import SceneOptions from './components/SceneOptions'

import AssetImport from './components/AssetImport'
import AssetInfo from './components/AssetInfo'

import OptionsPanel from './components/OptionsPanel'
import SidePanel from './components/SidePanel'

import { mapState } from 'vuex'
import _ from 'lodash'

export default {
  name: 'app',
  components: {
    AppHeader,
    SceneHeader,
    SceneOptions,
    AssetImport,
    AssetInfo,
    OptionsPanel,
    SidePanel
  },
  data: function() {
    return {
    }
  },
  mounted () {
    //basically mirrors sign-in action without passing an argument
    this.$store.dispatch('auth/authenticate')
    .then(success => {
      this.$store.dispatch('signInLoad')
      .then(success => {
        //check what the entry route is and if user isn't trying to access an endpoint - send to loading route
        if (this.$store.state.route.name !== 'Scene') {
          this.$router.push({ name: 'SceneLoading' })
        }
      })
    })
    .catch(error => {
      console.log(error)
    })
  },
  methods: {
  },
  computed: {

    sceneIsOpen: function() {
      if (this.$store.getters['scenes/current'] == null || this.route.name != 'Scene') { return false } else {
        return true
      }
    },
    ...mapState([
      'activePanel',
      'userPanel',
      'route',
      'sceneOptions',
      'assetImport',
      'assetInfo'
    ])
  }
}
</script>

<style lang="sass">
@import src/styles/main

#app
  +userType(average)


</style>
