<template>
  <div id="options-panel-signin">

    <div class="form-title">Sign In</div>
    <div class="form-subtitle">Email:</div>
      <input :value="formEmail" @input="updateFormEmail" placeholder="email">
    <div class="form-subtitle">Password:</div>
      <input :value="formPassword" @input="updateFormPassword" placeholder="password">
    <div @click="trySignIn(formEmail, formPassword)" class="button-solid">Sign In</div>

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
      'formEmail',
      'formPassword'
    ])
  },

  methods: {
    updateFormEmail: function(e)    { this.$store.commit('SET_FORM_EMAIL', e.target.value) },
    updateFormPassword: function(e) { this.$store.commit('SET_FORM_PASSWORD', e.target.value) },

    trySignIn: function(email, password) {
      this.authenticate({strategy: 'local', email, password})
      .then(response => {
        //fill in teams from database
        this.findTeams({
          query: {

          }
        })

        //close user panel
        this.$store.commit('SET_USER_PANEL', {open: false})
      })
      .catch(error => {
        console.log(error)
      })
    },
    ...mapActions('auth', [
      'authenticate',
      'logout'
    ]),
    ...mapActions('teams', {
      findTeams: 'find'
    })
  }

}
</script>

<style scoped lang="sass">
@import src/styles/main

#options-panel-signin


</style>
