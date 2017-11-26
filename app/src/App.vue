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

        <!-- router hack -->
        <router-view></router-view>

      </div>
      <!-- end app content -->
    </div>

  </div>
</template>

<script>

import AppHeader from './components/AppHeader'
import OptionsPanel from './components/OptionsPanel'
import SidePanel from './components/SidePanel'

export default {
  name: 'app',
  components: {
    AppHeader,
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
      this.$store.dispatch('signInLoad');
    })
    .catch(error => {
      console.log(error)
    })
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
  +userType(average)


</style>
