<template>
  <div id="landing">
    <div class="landing-helper">
      <div>Log in, or create a new account!</div>
      <div>This will be a full fledged landing page soon.</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'landing',
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

#landing
  height: 100%
  +flexbox
  +justify-content(center)
  +align-items(center)
  .landing-helper
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
