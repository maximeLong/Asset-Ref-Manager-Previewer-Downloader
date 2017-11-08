<template>
  <div id="user-panel">

    <div class="sign-in-panel" v-if="userPanel.panelType == 'signIn'">
      sign in
    </div>
    <div class="create-account-panel" v-if="userPanel.panelType == 'createAccount'">
      create account
    </div>

    <div class="user-info-panel" v-if="userPanel.panelType == 'userInfo'">
      log out, user settings
    </div>

  </div>
</template>

<script>

export default {
  name: 'userPanel',
  data: function(){
    return {

    }
  },
  computed: {
    user: function()            { return this.$store.state.auth.user },
    userIsLoggedIn: function()  { return this.user ? true : false },
    userPanel: function()       { return this.$store.state.userPanel }

  },
  methods: {
    openCreatePanel: function() {

    },
    openSignInPanel: function() {

    }

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


</style>
