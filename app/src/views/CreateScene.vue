<template>
  <div id="create-scene">

    <content-box :title="'Create Scene'">
        <div class="name form">
          <div class="form-title">Name</div>
          <input :value="formSceneName"
            @input="updateFormSceneName"
            placeholder="scene name">
        </div>
        <div class="invite form">
          <div class="form-title">Collaborators</div>

          <div class="openInviteForm" @click="inviteFormIsOpen = true" v-if="!inviteFormIsOpen">+</div>
          <input :value="formInviteEmail" v-if="inviteFormIsOpen"
            @input="updateFormInviteEmail"
            @keyup.enter="addToInvites" placeholder="email address">

          <div class="invites"
            v-for="(invite, index) in localInvites"
            @click="removeInvite(index)">
              {{invite[0]}}
              <div class="tooltip">{{invite}}</div>
          </div>
        </div>

    </content-box>
    <button @click="tryCreateScene">Create Scene</button>

  </div>
</template>

<script>
import ContentBox from '../components/ContentBox'
import { mapState } from 'vuex'

export default {
  name: 'createScene',
  data: function(){
    return {
      localInvites: [],
      inviteFormIsOpen: false
    }
  },
  components: {
    ContentBox
  },
  computed: {
    ...mapState('users',  ['user']),
    ...mapState('scenes', ['populatedScenes']),
    ...mapState('ux',     ['formSceneName','formInviteEmail'])
  },
  methods: {
    tryCreateScene: function() {
      var sceneData = {
        creator: this.user.uid,
        name: this.formSceneName,
        invites: this.localInvites
      }
      this.$store.dispatch('scenes/createScene', sceneData)
        .then(response => {
          this.$router.push({ name: 'Scene', params: { scene_id: this.populatedScenes[this.populatedScenes.length-1]._id }})
        })
        .catch(error => {
          console.log(error)
        })
    },

    updateFormSceneName: function(e) { this.$store.commit('ux/SET_FORM_SCENENAME', e.target.value) },
    updateFormInviteEmail: function(e) { this.$store.commit('ux/SET_FORM_INVITEEMAIL', e.target.value) },
    addToInvites: function(){
      this.localInvites.push(this.formInviteEmail)
      this.$store.commit('ux/SET_FORM_INVITEEMAIL', '')
    },
    removeInvite: function(inviteIndex){
      this.localInvites.splice(inviteIndex, 1)
    }
  }

}
</script>

<style scoped lang="sass">
@import src/styles/main

#create-scene
  height: 100%
  +flexbox
  +justify-content(center)
  +align-items(center)
  +flex-direction(column)
  .content-box
    width: 80%
    max-width: 700px
    border-bottom-left-radius: 0
    border-bottom-right-radius: 0
  button
    +button(false,false)
    width: 80%
    max-width: 700px
    border-top-left-radius: 0
    border-top-right-radius: 0
    padding: 20px 0

  .form
    padding: 30px 0
    border-bottom: 1px solid $border_color_light
    +flexbox
    +align-items(center)
    &:last-of-type
      border-bottom: none
      padding-bottom: 0px
    &:first-of-type
      padding-top: 0px

    .form-title
      +flex(0 0 150px)
    input
      font-weight: bold
      border-radius: 100px
      padding-left: 20px
    .openInviteForm,.invites
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
    .invites
      position: relative
      border: 2px dashed $border_color_mid
      margin-left: 5px
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


</style>
