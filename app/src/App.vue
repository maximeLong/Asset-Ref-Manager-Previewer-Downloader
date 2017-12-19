<template>
  <div id="app">

    <!-- side panel -->
    <div id="side-panel">
      <side-panel></side-panel>
    </div>

    <div id="main-panel">

      <div id="header-panel">
        <app-header></app-header>
        <layout-header v-if="layoutIsOpen"></layout-header>
        <options-panel v-if="userPanel.open"></options-panel>
      </div>

      <div id="app-content" :class="{ openLayout : layoutIsOpen }">
        <!-- views -->
        <router-view></router-view>

        <!-- full screen modals -->
        <layout-options v-if="layoutOptions"></layout-options>
        <prop-import></prop-import>

      </div>

    </div>

  </div>
</template>

<script>

import AppHeader from './components/AppHeader'
import LayoutHeader from './components/LayoutHeader'
import LayoutOptions from './components/LayoutOptions'

import PropImport from './components/PropImport'

import OptionsPanel from './components/OptionsPanel'
import SidePanel from './components/SidePanel'

import { mapState } from 'vuex'
import _ from 'lodash'

export default {
  name: 'app',
  components: {
    AppHeader,
    LayoutHeader,
    LayoutOptions,
    PropImport,
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
        if (this.$store.state.route.name !== 'Layout') {
          this.$router.push({ name: 'LayoutLoading' })
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

    layoutIsOpen: function() {
      if (this.$store.getters['layouts/current'] == null || this.route.name != 'Layout') { return false } else {
        return true
      }
    },
    ...mapState([
      'activePanel',
      'userPanel',
      'route',
      'layoutOptions',
      'propImport'
    ])
  }
}
</script>

<style lang="sass">
@import src/styles/main

#app
  +userType(average)


</style>
