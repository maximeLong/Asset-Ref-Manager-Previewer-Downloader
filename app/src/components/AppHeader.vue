<template>
  <div id="header-content">

    <div class="middle-section">
      <div class="team-account" v-if="userIsLoggedIn" @click="openTeamPanel">
        <div class="team-name">Your Teams</div>
      </div>
      <div class="create-account" v-if="!userIsLoggedIn" @click="openCreatePanel">
        <div class="create-account-text">Create Account</div>
      </div>
    </div>

    <div class="right-section">
      <div class="user-account" v-if="userIsLoggedIn" @click="openUserInfoPanel">
        <div class="account-image" :style="{ 'background-image' : 'url(' + user.profileImage.big + ')'}"></div>
        <div class="account-name">{{user.email}}</div>
      </div>
      <div class="sign-in" v-if="!userIsLoggedIn" @click="openSignInPanel">
        <div class="sign-in-text">Sign In</div>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'appHeader',
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
      this.$store.commit('SET_USER_PANEL', {open: true, panelType: 'createAccount'})
    },
    openTeamPanel: function() {
      this.$store.commit('SET_USER_PANEL', {open: true, panelType: 'team'})
    },
    openUserInfoPanel: function() {
      this.$store.commit('SET_USER_PANEL', {open: true, panelType: 'userInfo'})
    },
    openSignInPanel: function() {
      this.$store.commit('SET_USER_PANEL', {open: true, panelType: 'signIn'})
    }

  }

}
</script>

<style scoped lang="sass">
@import src/styles/main
$margin_amount: 55px

#header-content
  width: 100%
  height: 100%
  +flexbox
  +align-items(center)
  +flex-direction(row)
  +justify-content(space-between)
  background-color: $header_color
  border-bottom: 1px solid $border_color
  +userType(small)
  //font-weight: bold

  .logo
    +flexbox
    +align-items(center)
    +justify-content(center)
    width: 75px
    height: 100%
    margin-right: 40px
    border-right: 1px solid $border_color
    .icon
      width: 45px
      height: 45px
      background-size: contain
      background-position: 50% 50%
      background-repeat: no-repeat
      background-image: url('../assets/logo-icon.svg')

  .middle-section
    +flexbox
    +align-items(center)
    +justify-content(flex-end)
    height: 100%
    //border-left: 1px solid red
    +flex(1)

    .team-account,.create-account
      height: 100%
      padding: 0 20px
      border-left: 1px solid $border_color
      +clickable
      +flexbox
      +align-items(center)
      +justify-content(center)
    .create-account
      color: $action_color

  .right-section
    margin-right: $margin_amount
    height: 100%
    border-left: 1px solid $border_color
    +clickable
    .sign-in
      height: 100%
      width: 100%
      padding-left: 25px
      +flexbox
      +align-items(center)
      +justify-content(center)
      color: $action_color
    .user-account
      height: 100%
      width: 100%
      padding-left: 25px
      +flexbox
      +align-items(center)
      +justify-content(center)
      .account-image
        width: 45px
        height: 45px
        border: 1px solid $border_color
        border-radius: 100%
        margin-right: 10px
        background-size: contain
        background-position: 50% 50%
        background-repeat: no-repeat

</style>
