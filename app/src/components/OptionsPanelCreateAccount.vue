<template>
  <div id="options-panel-create-account">

      <div class="form-title">Create Account</div>
      <div class="form-subtitle">Email:</div>
        <input :value="formEmail" @input="updateFormEmail" placeholder="email">
      <div class="form-subtitle">Password:</div>
        <input :value="formPassword" @input="updateFormPassword" placeholder="password">
      <div @click="tryCreateAccount(formEmail, formPassword)" class="button-solid">Create Account</div>

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
        console.log(response)
        this.$store.commit('SET_USER_PANEL', {open: false})
      })
      .catch(error => {
        console.log(error)
      })
    },
    tryCreateAccount: function(email, password) {

      this.createUser({email, password})
        .then(response =>
          this.trySignIn(email, password)
        )
        .catch(error => {
          console.log(error)
        })
    },

    ...mapActions('users', {
      createUser: 'create'
    }),
    ...mapActions('auth', [
      'authenticate',
      'logout'
    ])
  }

}
</script>

<style scoped lang="sass">
@import src/styles/main

#options-panel-create-account


</style>
