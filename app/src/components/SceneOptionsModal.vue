<template>
<div id="scene-options-modal">

  <modal :title="'Scene Options'" :onClickaway="handleClickaway">

    <!-- change name form -->
    <div class="name form">
      <div class="form-title">Name</div>
      <div class="current-name" v-if="!changeNameFormIsOpen">{{currentScene.name}}</div>
      <div class="edit button" v-if="!changeNameFormIsOpen" @click="editTitle">Edit</div>
      <input :value="formSceneName" v-if="changeNameFormIsOpen" @input="updateFormSceneName">
    </div>

    <!-- members form -->
    <div class="invite form">
      <div class="form-title">Invites</div>
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
    </div>

    <!-- Danger Zone -->
    <div class="delete form">
      <div class="form-title">Danger Zone</div>
      <div class="delete button" @click="tryDeleteScene">Delete Scene</div>
    </div>

    <div class="edit-buttons">
      <div class="save-button button" :class="{ 'not-active' : !formHasChanged }" @click="saveChanges">Save Changes</div>
      <div class="cancel-button" @click="handleClickaway">Cancel</div>
    </div>

  </modal>

</div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import Modal from '../components/Modal'
import _ from 'lodash'


export default {
  name: 'sceneOptionsModal',
  components: { Modal },
  data: function() {
    return {
      changeNameFormIsOpen: false,
      localInvites: [],
      inviteFormIsOpen: false
    }
  },
  mounted: function() {
    this.$store.commit('ux/SET_FORM_SCENENAME', this.currentScene.name)
  },
  destroyed: function() {
    this.$store.commit('ux/SET_FORM_SCENENAME', '')
  },

  computed: {
    ...mapState('users',    ['user']),
    ...mapState('scenes',   ['populatedScenes']),
    ...mapState('ux',       ['formSceneName','formInviteEmail']),
    ...mapGetters('scenes', ['currentScene']),

    formHasChanged: function()  {
      if (this.formSceneName !== this.currentScene.name || this.localInvites.length) {
        return true
      } else { return false }
    }
  },
  methods: {
    //-- button methods
    handleClickaway: function() {
      this.$store.commit('ux/SET_SCENE_OPTIONS_MODAL_IS_OPEN', false);
    },
    editTitle: function() {
      this.changeNameFormIsOpen = true;
      this.$store.commit('ux/SET_FORM_SCENENAME', this.currentScene.name);
    },
    saveChanges: function() {
      if (this.formHasChanged) {
        this.tryPatchScene()
      }
    },

    //-- update form info
    //
    updateFormSceneName: function(e) { this.$store.commit('ux/SET_FORM_SCENENAME', e.target.value) },
    updateFormInviteEmail: function(e) { this.$store.commit('ux/SET_FORM_INVITEEMAIL', e.target.value) },
    addToInvites: function(){
      this.localInvites.push(this.formInviteEmail)
      this.$store.commit('ux/SET_FORM_INVITEEMAIL', '')
    },
    removeInvite: function(inviteIndex){
      this.localInvites.splice(inviteIndex, 1)
    },

    // -- patch scene
    tryPatchScene: function() {
      var mergedInvites = _.concat(this.currentScene.invites, this.localInvites);
      var patchedData = {
        name: this.formSceneName,
        invites: mergedInvites
      }
      this.$store.dispatch('scenes/patchSceneInfo', {sceneId: this.currentScene._id, patchedData: patchedData})
        .then(response => {
          this.handleClickaway()
        })
        .catch(error => { console.log(error) })
    },

    tryDeleteScene: function() {
      this.$store.dispatch('scenes/deleteScene', this.currentScene._id)
        .then(response => {

          //BUG: this throws errors because modal is listening to deleted info
          this.handleClickaway()
          if (this.populatedScenes.length) {
            this.$router.push({ name: 'Scene', params: { scene_id: this.populatedScenes[0]._id }})
          } else {
            this.$router.push({ name: 'NoScene' })
          }

        })
        .catch(error => { console.log(error) })
    }
  }

}
</script>

<style scoped lang="sass">
@import src/styles/main

#scene-options-modal
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
      +flex(0 0 120px)
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

    .delete
      +button(false, false, $danger_color, inherit)
      padding: 13px 30px

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
