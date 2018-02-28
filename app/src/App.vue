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
  mounted () {

    //entrypoint --> check auth > get(scenes) > route to correct page
    this.$store.dispatch('firebaseStore/watchAuthChange')
      .then((user)=> {
        console.log('user already authed: ' + user.email)

        this.$store.dispatch('firebaseStore/getScenesByUser', user.uid)
          .then((scenes)=> {
            this.$router.push({ name: 'SceneLoading' })
          })
          .catch((error)=> {
            console.log('something went wrong with the initial scene lookup:', error)
            this.$router.push({ name: 'Landing' })
          })
      })
      //rejects if no user auth > go to landing
      .catch((error)=> {
        this.$router.push({ name: 'Landing' })
      })


    //basically mirrors sign-in action without passing an argument
    // this.$store.dispatch('auth/authenticate')
    // .then(success => {
    //   this.$store.dispatch('signInLoad')
    //   .then(success => {
    //     //check what the entry route is and if user isn't trying to access an endpoint - send to loading route
    //     if (this.$store.state.route.name !== 'Scene') {
    //       this.$router.push({ name: 'SceneLoading' })
    //     }
    //   })
    // })
    // .catch(error => {
    //   console.log(error)
    // })


  },
  methods: {},
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
