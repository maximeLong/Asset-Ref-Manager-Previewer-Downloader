<template>
  <div id="options-panel-user-info">

    <div class="form-title">User Settings</div>
    <div @click="tryLogOut" class="submit-button">Log out</div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapActions } from 'vuex'

export default {
  data: function(){
    return {

    }
  },

  computed: {
    userIsLoggedIn: function()  { return this.user ? true : false },
    user: function()            { return this.$store.state.auth.user },
    ...mapState([
      'userPanel',
    ])
  },

  methods: {
    tryLogOut: function() {
      this.$store.dispatch('logOutUser')
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
