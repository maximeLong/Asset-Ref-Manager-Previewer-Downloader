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
    ...mapState('ux',[
      'userPanel',
      'formEmail',
      'formPassword'
    ])
  },

  methods: {
    updateFormEmail: function(e)    { this.$store.commit('ux/SET_FORM_EMAIL', e.target.value) },
    updateFormPassword: function(e) { this.$store.commit('ux/SET_FORM_PASSWORD', e.target.value) },

    tryCreateAccount: function(email, password) {
      this.$store.dispatch('users/createUser', {email: email, password: password})
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
