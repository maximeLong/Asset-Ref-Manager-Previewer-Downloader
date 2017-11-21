<template>
  <div id="options-panel" v-on-clickaway="closePanel">

    <!-- sign in panel -->
    <options-panel-signin
      v-if="userPanel.panelType == 'signIn'">
    </options-panel-signin>

    <!-- team pannel -->
    <options-panel-team
      v-if="userPanel.panelType == 'team'">
    </options-panel-team>

    <!-- create account -->
    <options-panel-create-account
      v-if="userPanel.panelType == 'createAccount'">
    </options-panel-create-account>

    <!-- signed in user info -->
    <options-panel-user-info
      v-if="userPanel.panelType == 'userInfo'">
    </options-panel-user-info>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'

import OptionsPanelCreateAccount from './OptionsPanelCreateAccount'
import OptionsPanelSignin from './OptionsPanelSignin'
import OptionsPanelTeam from './OptionsPanelTeam'
import OptionsPanelUserInfo from './OptionsPanelUserInfo'

export default {
  components: {
    OptionsPanelCreateAccount,
    OptionsPanelSignin,
    OptionsPanelTeam,
    OptionsPanelUserInfo
  },
  mixins: [ clickaway ],
  computed: {
    ...mapState([
      'userPanel'
    ])
  },

  methods: {
    closePanel: function(e) {
      var whiteList = [
        'create-account',
        'create-account-text',
        'sign-in',
        'right-section',
        'sign-in-text',
        'team-account',
        'team-name'
      ]
      if (whiteList.includes(e.target.className)) {
        return
      } else {
        this.$store.commit('SET_USER_PANEL', {open: false})
      }
    }
  }

}
</script>

<style lang="sass">
@import src/styles/main
$margin_amount: 55px

#options-panel
  width: 400px
  height: auto
  position: fixed
  right: $margin_amount
  padding: 30px
  background-color: $header_color
  border: 1px solid $border_color
  border-top: none
  +userType(small)

  .form-title
    +userType(average)
    padding-bottom: 10px
  .form-subtitle
    font-weight: bold
    padding-bottom: 5px
  .seperator
    margin: 20px 0
    border-bottom: 1px solid $border_color
  .back-arrow
    +clickable
    margin-bottom: 10px
    color: $action_color
  input
    padding: 10px
    width: 100%
    margin-bottom: 15px
    border: 1px solid $border_color
    border-radius: 3px
    &:last-of-type
      margin-bottom: 20px

</style>
