<template>
  <div id="options-panel-create-account">

      <div class="form-title">Create Account</div>
      <div class="form-subtitle">Email:</div>
        <input :value="formEmail" @input="updateFormEmail" placeholder="email">
      <div class="form-subtitle">Password:</div>
        <input :value="formPassword" @input="updateFormPassword" placeholder="password">
      <button @click="tryCreateAccount(formEmail, formPassword)" class="submit-button">Create Account</button>

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

    tryCreateAccount: function(email, password) {
      this.$store.dispatch('createUser', {email: email, password: password})
    }
  }

}
</script>

<style scoped lang="sass">
@import src/styles/main

#options-panel-create-account
  .submit-button
    +button(false, false, $action_color)

</style>
