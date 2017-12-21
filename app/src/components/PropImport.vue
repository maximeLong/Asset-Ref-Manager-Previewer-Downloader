<template>
<div id="prop-import">

  <content-box :title="'Create Prop'">

    <!-- import file -->
    <prop-loader-fbx></prop-loader-fbx>

    <!-- screenshot prop -->
    <div class="screenshot form" v-if="imported">

    </div>

    <!-- name and info form -->
    <div class="info form" v-if="imported">
      <div class="form-title">Prop Name</div>
      <input :value="formPropName" @input="updateFormPropName" placeholder="prop name">
    </div>

    <!-- save buttons -->
    <div class="edit-buttons">
      <div class="save-button button" :class="{ 'not-active' : !propIsOk }" @click="uploadProp">Upload Prop</div>
      <div class="cancel-button" @click="handleClickAway">Cancel</div>
      <!-- <div class="error-log" v-if="errors.length">
        <div>There {{errors.length > 1 ? 'are errors' : 'is an error' }} with:</div>
        <span class="error" v-for="error in errors">{{error}}, </span>
      </div> -->
    </div>

  </content-box>

</div>
</template>
<script>
import ContentBox from '../components/ContentBox'
import propLoaderFbx from '../components/propLoaderFbx'
import { mapState } from 'vuex'
import { mapActions } from 'vuex'

import { mixin as clickaway } from 'vue-clickaway'
import _ from 'lodash'


export default {
  name: 'propImport',
  components: {
    ContentBox: ContentBox,
    propLoaderFbx: propLoaderFbx
  },
  mixins: [ clickaway ],
  data: function() {
    return {
      imported: false
    }
  },
  destroyed: function() {
    this.$store.commit('SET_FORM_PROPNAME', '')
  },

  computed: {
    user: function()            { return this.$store.state.auth.user },
    currentLayout: function()   { return this.$store.getters['layouts/current'] },
    propIsOk: function()  {
      if (this.imported && this.formPropName.length) { return true } else { return false }
    },
    ...mapState([
      'formPropName'
    ])
  },
  methods: {
    //-- button methods
    //
    handleClickAway: function(e) {
      //TODO: better clickaway handler - have to catch button presses on form bcuz bugs
      if (_.includes(e.target.classList, 'button')) { return } else {
        this.$store.commit('SET_PROP_IMPORT', false);
      }
    },
    uploadProp: function() {
      if (this.propIsOk) {
        this.tryCreateProp()
      }
    },
    importProp: function() {
      this.imported = true;
    },

    //-- update form info
    //
    updateFormPropName: function(e) { this.$store.commit('SET_FORM_PROPNAME', e.target.value); },

    // -- patch layout
    //
    tryCreateProp: function() {

      this.createAsset({
        name: this.formPropName,
      })
      .then(response => {
        console.log('success');
      })
      .catch(error => { console.log(error) })

    },
    ...mapActions('assets', {
      createAsset: 'create'
    })
  }

}
</script>

<style lang="sass">
@import src/styles/main

#prop-import
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
      .form-title
        +flex(0 0 100px)
        +systemType(small)
      input
        font-weight: bold
        border-radius: 100px
        padding-left: 20px
        &.active
          border-color: $border_color_mid
          .import-prop
            color: $border_color_mid
      &.screenshot
        height: 200px


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
      .error-log
        margin-left: 10px
        +systemType(small)
        color: #f55151



</style>
