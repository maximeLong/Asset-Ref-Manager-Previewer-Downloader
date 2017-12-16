<template>

  <div id="layout-header">
    <div class="header-left">
      <div class="header-left-top">
        <div class="title">{{currentLayout.name}}</div>
        <div class="options" @click="openLayoutOptions"><div v-for="n in 3"></div></div>
      </div>
      <div class="layout-type">Virtual Set, Tracked Vive, SLAM Technology</div>
    </div>

    <div class="header-right">
      <div class="members">
        <div class="member" v-for="user in currentLayout.users"
             :style="{ 'background-image' : 'url(' + user.profileImage.big + ')'}">
             <div class="tooltip">{{user.email}}</div>
        </div>
      </div>
      <div class="invites">
        <div class="invite" v-for="invite in currentLayout.invites">
          {{invite[0]}}
          <div class="tooltip">{{invite}}</div>
        </div>
      </div>
      <div class="add-member" @click="openLayoutOptions">
        +
      </div>
    </div>
  </div>

</template>

<script>

export default {
  name: 'layoutHeader',
  computed: {
    user: function()            { return this.$store.state.auth.user },
    userIsLoggedIn: function()  { return this.user ? true : false },
    currentLayout: function()   { return this.$store.getters['layouts/current'] },
  },
  methods: {
    openLayoutOptions: function() {
      this.$store.commit('SET_LAYOUT_OPTIONS', true)
    }
  }

}
</script>

<style scoped lang="sass">
@import src/styles/main

#layout-header
  background-color: white
  border-bottom: 1px solid $border_color_light
  padding: 0 30px
  padding: 0 30px
  height: 90px
  +flexbox
  +align-items(center)
  +justify-content(space-between)
  .header-left
    .header-left-top
      +flexbox
      +align-items(center)
    .title
      +userType(big)
    .options
      padding: 0 20px
      +clickable
      div
        margin-bottom: 3px
        height: 4px
        width: 4px
        background-color: $action_color
        border-radius: 20px
        &:last-of-type
          margin: 0
    .layout-type
      +systemType(small)
      padding-top: 5px

  .header-right
    +flexbox
    +align-items(center)
    .invites,.members
      +flexbox
      +align-items(center)
    .invite,.member,.add-member
      border-radius: 100px
      border: 2px solid $border_color_light
      width: 40px
      height: 40px
      position: relative
      margin-left: 5px
      +flexbox
      +align-items(center)
      +justify-content(center)
      +clickable
      &:hover > .tooltip
        display: block
      .tooltip
        display: none
        position: absolute
        background-color: $ink_black
        +userType(small)
        color: white
        padding: 10px 20px
        bottom: -55px
        right: 0
        z-index: 99
    .invite
      border: 2px dashed $border_color_mid
    .member
      background-size: contain
      background-position: 50% 50%
      background-repeat: no-repeat
    .add-member
      color: $action-color

</style>
