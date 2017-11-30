<template>
  <div id="no-layout">
    <div class="no-layout-helper">
      <div>You haven't made a layout yet.</div>
      <router-link to="/createlayout">
        <div>Make one!</div>
      </router-link>
    </div>
  </div>
</template>

<script>

export default {
  name: 'noLayout',
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

#no-layout
  height: 100%
  +flexbox
  +justify-content(center)
  +align-items(center)
  .no-layout-helper
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
