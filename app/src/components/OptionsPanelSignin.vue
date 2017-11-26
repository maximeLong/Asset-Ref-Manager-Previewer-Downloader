<template>
  <div id="options-panel-signin">

    <div class="form-title">Sign In</div>
    <div class="form-subtitle">Email:</div>
      <input :value="formEmail" @input="updateFormEmail" placeholder="email">
    <div class="form-subtitle">Password:</div>
      <input :value="formPassword" @input="updateFormPassword" placeholder="password">
    <button @click="trySignIn(formEmail, formPassword)" class="submit-button">Sign In</button>

  </div>
</template>

<script>
import { mapState } from 'vuex'

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
      this.$store.dispatch('signInUser', {email: email, password: password})
    }

  }

}
</script>

<style scoped lang="sass">
@import src/styles/main

#options-panel-signin
  .submit-button
    +button(false, false, $action_color)

</style>
