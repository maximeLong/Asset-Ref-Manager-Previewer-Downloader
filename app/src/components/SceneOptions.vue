<template>
<div id="scene-options">

  <content-box :title="'Scene Options'" v-on-clickaway="handleClickAway">

    <!-- change name form -->
    <div class="name form">
      <div class="form-title">Name</div>
      <div class="current-name" v-if="!changeNameFormIsOpen">{{currentScene.name}}</div>
      <div class="edit button" v-if="!changeNameFormIsOpen" @click="editTitle">Edit</div>
      <input :value="formSceneName" v-if="changeNameFormIsOpen" @input="updateFormSceneName">
    </div>

    <!-- members form -->
    <div class="invite form">
      <div class="form-title">Members</div>

      <div class="openInviteForm button" @click="inviteFormIsOpen = true" v-if="!inviteFormIsOpen">+</div>
      <input :value="formInviteEmail" v-if="inviteFormIsOpen"
        @input="updateFormInviteEmail"
        @keyup.enter="addToInvites" placeholder="email address">

      <div class="invites button"
        v-for="(invite, index) in localInvites"
        @click="removeInvite(index)">{{invite[0]}}<div class="tooltip">{{invite}}</div>
      </div>

      <div class="invites existing button" v-for="invite in currentScene.invites"
        >{{invite[0]}}<div class="tooltip">{{invite}}</div>
      </div>

      <div class="members" v-for="user in currentScene.users"
         :style="{ 'background-image' : 'url(' + user.profileImage.big + ')'}">
         <div class="tooltip">{{user.email}}</div>
      </div>

    </div>
    <div class="edit-buttons">
      <div class="save-button button" :class="{ 'not-active' : !formHasChanged }" @click="saveChanges">Save Changes</div>
      <div class="cancel-button" @click="handleClickAway">Cancel</div>
    </div>

  </content-box>

</div>
</template>
<script>
import ContentBox from '../components/ContentBox'
import { mapState } from 'vuex'
import { mapActions } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'
import _ from 'lodash'


export default {
  name: 'sceneOptions',
  components: { ContentBox },
  mixins: [ clickaway ],
  data: function() {
    return {
      changeNameFormIsOpen: false,
      localInvites: [],
      inviteFormIsOpen: false
    }
  },
  mounted: function() {
    this.$store.commit('SET_FORM_SCENENAME', this.currentScene.name)
  },
  destroyed: function() {
    this.$store.commit('SET_FORM_SCENENAME', '')
  },

  computed: {
    user: function()            { return this.$store.state.auth.user },
    userIsLoggedIn: function()  { return this.user ? true : false },
    currentScene: function()   { return this.$store.getters['scenes/current'] },
    formHasChanged: function()  {
      if (this.formSceneName !== this.currentScene.name || this.localInvites.length) {
        return true
      } else { return false }
    },
    ...mapState([
      'formSceneName',
      'formInviteEmail'
    ])
  },
  methods: {
    //-- button methods
    //
    handleClickAway: function(e) {
      //TODO: better clickaway handler - have to catch button presses on form bcuz bugs
      if (_.includes(e.target.classList, 'button')) { return } else {
        this.$store.commit('SET_SCENE_OPTIONS', false);
      }
    },
    editTitle: function() {
      this.changeNameFormIsOpen = true;
      this.$store.commit('SET_FORM_SCENENAME', this.currentScene.name);
    },
    saveChanges: function() {
      if (this.formHasChanged) {
        this.tryPatchScene()
      }
    },

    //-- update form info
    //
    updateFormSceneName: function(e) { this.$store.commit('SET_FORM_SCENENAME', e.target.value) },
    updateFormInviteEmail: function(e) { this.$store.commit('SET_FORM_INVITEEMAIL', e.target.value) },
    addToInvites: function(){
      this.localInvites.push(this.formInviteEmail)
      this.$store.commit('SET_FORM_INVITEEMAIL', '')
    },
    removeInvite: function(inviteIndex){
      this.localInvites.splice(inviteIndex, 1)
    },

    // -- patch scene
    //
    tryPatchScene: function() {
      var mergedInvites = _.concat(this.currentScene.invites, this.localInvites);
      this.patchScene([this.currentScene._id, {
        name: this.formSceneName,
        invites: mergedInvites
      }, {} ])
      .then(response => {
        console.log('success');
        this.$store.commit('SET_SCENE_OPTIONS', false);
      })
      .catch(error => { console.log(error) })

    },
    ...mapActions('scenes', {
      patchScene: 'patch'
    })
  }

}
</script>

<style scoped lang="sass">
@import src/styles/main

#scene-options
  position: absolute
  top: 0
  bottom: 0
  left: 0
  right: 0
  width: 100%
  height: 100%
  +flexbox
  +justify-content(center)
  +align-items(center)
  &::before
    content: ''
    position: absolute
    width: 100%
    height: 100%
    background-color: $side_panel_color
    opacity: .8

  .content-box
    width: 80%
    max-width: 700px

    .form
      padding: 20px 0
      border-bottom: 1px solid $border_color_light
      +flexbox
      +align-items(center)
      &:last-of-type
        border-bottom: none
        padding-bottom: 0px
      &:first-of-type
        padding-top: 0px
      &.name
        +flexbox
        +align-items(center)


      .form-title
        +flex(0 0 100px)
        +systemType(small)
      input
        font-weight: bold
        border-radius: 100px
        padding-left: 20px
      .edit
        +systemType(small)
        +clickable
        color: $action_color
        padding-left: 10px

      //invite members
      .openInviteForm,.invites,.members
        +flex(0 0 45px)
        +flexbox
        +align-items(center)
        +justify-content(center)
        border: 2px solid $border_color_light
        color: $action_color
        border-radius: 100px
        font-weight: bold
        width: 45px
        height: 45px
        +clickable
      .members
        background-size: contain
        background-position: 50% 50%
        background-repeat: no-repeat
        border: 2px solid white
      .invites
        border: 2px dashed $border_color_mid
      .invites,.members
        position: relative
        margin-left: 5px
        &.existing
          color: $text_color
          font-weight: normal
        &:hover > .tooltip
          display: block
        .tooltip
          display: none
          position: absolute
          background-color: $ink_black
          color: white
          padding: 10px 20px
          top: -55px
          left: -50%

    //buttons
    .edit-buttons
      +flexbox
      +align-items(center)
      margin-top: 20px
      .cancel-button
        +button(false, true, $action_color, inherit)
        padding: 13px 30px
        margin-left: 10px
      .save-button
        +button(false, false, $action_color, inherit)
        padding: 13px 30px
        &.not-active
          opacity: .3
          cursor: default

</style>
