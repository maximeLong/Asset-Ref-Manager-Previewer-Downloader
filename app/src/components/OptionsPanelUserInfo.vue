<template>
  <div id="options-panel-user-info">

    <div class="form-title">User Settings</div>
    <div @click="tryLogOut" class="submit-button">Log out</div>

  </div>
</template>

<script>

export default {
  data: function(){
    return {}
  },
  methods: {
    tryLogOut: function() {
      this.$store.dispatch('users/signOut')
    },
  }

}
</script>

<style scoped lang="sass">
@import src/styles/main

#options-panel-user-info
  .submit-button
    +button(false,false,$action_color)

</style>
