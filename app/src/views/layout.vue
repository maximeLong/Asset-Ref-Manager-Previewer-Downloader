<template>
<div id="layout">

    <!-- modules -->
    <div class="layout-modules">
      <content-box :title="'Stage Modules'">
        stage modules
      </content-box>
    </div>

    <!-- palette information -->
    <palette></palette>

</div>

</template>

<script>
import ContentBox from '../components/ContentBox'
import Palette from '../components/Palette'

export default {
  name: 'layout',
  components: {
    ContentBox,
    Palette
  },
  data: function() {
    return {}
  },
  computed: {
    user: function()            { return this.$store.state.auth.user },
    userIsLoggedIn: function()  { return this.user ? true : false },
    currentLayout: function()   { return this.$store.state.currentLayout },
  },
  methods: {
    fetchData: function() {
      //mirror of beforeEnter on router
      this.$store.dispatch('layouts/get', [this.$route.params.layout_id])
      .then(success => {
        console.log('layout success', success)
      })
      .catch(error => { console.log('layout error', error) })
    }
  },
  watch: {
    '$route': 'fetchData'
  }

}
</script>

<style scoped lang="sass">
@import src/styles/main

#layout
  padding: 50px 30px 30px 30px
  .layout-assets
    margin-top: 40px

</style>
