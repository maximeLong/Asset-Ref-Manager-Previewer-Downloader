<template>

  <div id="scene-header">
    <div class="header-left">
      <div class="header-left-top">
        <div class="title">{{currentScene.name}}</div>
        <div class="options" @click="openSceneOptions"><div v-for="n in 3"></div></div>
      </div>
      <div class="scene-type">Virtual Set, Vive Tracker</div>
    </div>

    <div class="header-right">
      <div class="members">

        <!-- if you are a member... -->
        <div class="member" v-if="userIsInScene"
          :style="{ 'background-image' : 'url(' + user.thumbnail_big + ')'}">
          <div class="tooltip">{{user.email}}</div>
        </div>
        <!-- else... -->
        <div class="member" v-for="user in userList">
          {{user.userEmail[0]}}
          <div class="tooltip">{{user.userEmail}}</div>
        </div>

      </div>
      <div class="invites">
        <div class="invite" v-for="invite in currentScene.invites">
          {{invite[0]}}
          <div class="tooltip">{{invite}}</div>
        </div>
      </div>
      <div class="add-member" @click="openSceneOptions">+</div>
    </div>
  </div>

</template>

<script>

export default {
  name: 'sceneHeader',
  computed: {
    user: function()            { return this.$store.state.users.user },
    currentScene: function()    { return this.$store.getters['scenes/currentScene'] },
    usersInCurrentScene: function() { return this.$store.state.scenes.usersInCurrentScene },
    usersMinusUser: function() {
      return this.usersInCurrentScene.filter((user)=> { return user.userId !== this.user.uid })
    },

    userIsInScene: function() {
      return _.some(this.usersInCurrentScene, {'userId': this.user.uid}) ? true : false
    },
    userList: function() {
      return this.userIsInScene ? this.usersMinusUser : this.usersInCurrentScene
    }

  },
  methods: {
    openSceneOptions: function() {
      this.$store.commit('ux/SET_SCENE_OPTIONS_MODAL_IS_OPEN', true)
    }
  }

}
</script>

<style scoped lang="sass">
@import src/styles/main

#scene-header
  background-color: white
  border-bottom: 1px solid $border_color_light
  padding: 30px 30px 60px 30px
  height: 130px
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
    .scene-type
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
      border: 3px solid $border_color_light
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
      font-size: 20px
      color: $action-color

</style>
