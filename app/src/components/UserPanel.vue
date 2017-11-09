<template>
  <div id="user-panel">

    <div class="sign-in-panel" v-if="userPanel.panelType == 'signIn'">
      <div class="form-title">Sign In</div>
      <div class="form-subtitle">Email:</div>
        <input :value="formEmail" @input="updateFormEmail" placeholder="email">
      <div class="form-subtitle">Password:</div>
        <input :value="formPassword" @input="updateFormPassword" placeholder="password">
      <div @click="trySignIn(formEmail, formPassword)" class="button-solid">Sign In</div>
    </div>
    <div class="create-account-panel" v-if="userPanel.panelType == 'createAccount'">
      <div class="form-title">Create Account</div>
      <div class="form-subtitle">Email:</div>
        <input :value="formEmail" @input="updateFormEmail" placeholder="email">
      <div class="form-subtitle">Password:</div>
        <input :value="formPassword" @input="updateFormPassword" placeholder="password">
      <div class="form-subtitle">Team Name:</div>
        <input :value="formTeamName" @input="updateFormTeamName" placeholder="team name">
      <div @click="tryCreateAccount(formEmail, formPassword)" class="button-solid">Create Account</div>
    </div>

    <div class="user-info-panel" v-if="userPanel.panelType == 'userInfo'">
      <div class="form-title">User Settings</div>
      <div @click="logOut" class="button-solid">Log out</div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapActions } from 'vuex'
import server from '@/server'

export default {
  name: 'userPanel',
  data: function(){
    return {

    }
  },
  computed: {
    userIsLoggedIn: function()  { return this.user ? true : false },
    ...mapState([
      'user',
      'userPanel',
      'formEmail',
      'formPassword',
      'formTeamName'
    ])
  },
  methods: {
    openCreatePanel: function() {},
    openSignInPanel: function() {},
    updateFormEmail: function(e) {
      this.$store.commit('SET_FORM_EMAIL', e.target.value)
    },
    updateFormPassword: function(e) {
      this.$store.commit('SET_FORM_PASSWORD', e.target.value)
    },
    updateFormTeamName: function(e) {
      this.$store.commit('SET_FORM_TEAMNAME', e.target.value)
    },


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
    logOut: function() {
      this.logout()
      .then(res => {
        console.log('you were logged off')
      })
      .catch(error => {
        console.log(err)
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
$margin_amount: 55px

#user-panel
  width: 400px
  height: auto
  position: fixed
  right: $margin_amount
  padding: 30px
  background-color: $header_color
  border: 1px solid $border_color
  border-top: none
  +headerType(small)

  .form-title
    +headerType(normal)
    padding-bottom: 10px
  .form-subtitle
    font-weight: bold
    padding-bottom: 5px
  input
    padding: 10px
    width: 100%
    margin-bottom: 15px
    &:last-of-type
      margin-bottom: 20px

</style>
