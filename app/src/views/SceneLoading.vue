<template>
  <div id="scene-loading">
    <div class="loading-helper">
      <div>loading</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'sceneLoading',
  data: function(){
    return {

    }
  },
  computed: {
    user: function()            { return this.$store.state.auth.user },
    userIsLoggedIn: function()  { return this.user ? true : false },
  },
  methods: {

  }

}
</script>

<style scoped lang="sass">
@import src/styles/main

#scene-loading
  height: 100%
  +flexbox
  +justify-content(center)
  +align-items(center)
  .loading-helper
    background-color: $border_color_light
    width: 500px
    height: 250px
    border-radius: 2px
    +flexbox
    +justify-content(center)
    +align-items(center)
    +flex-direction(column)
    div
      margin: 10px 0

</style>
