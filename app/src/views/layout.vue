<template>
<div id="layout">


    <div class="layout-saves">
      <content-box :title="'Stage Modules'">
        stage modules
      </content-box>
    </div>

    <div class="layout-assets">
      <content-box :title="'Stage Props'">
        stage props stuff
      </content-box>
    </div>

</div>

</template>

<script>
import ContentBox from '../components/ContentBox'

export default {
  name: 'layout',
  components: {
    ContentBox,
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
