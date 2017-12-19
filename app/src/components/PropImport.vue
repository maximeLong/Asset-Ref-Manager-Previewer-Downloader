<template>
<div id="prop-import">

  <content-box :title="'Create Prop'">

    <!-- import file -->
    <!-- <div class="import form dragzone" v-if="!imported" :class="{ active : draggedOver }"
         ondrop="this.dropHandler" ondragover="this.dragOverHandler" ondragend="this.dragEndHandler">
      <div class="import-prop">Drag in model file to begin</div>
    </div> -->
    <vue-dropzone ref="myVueDropzone"
      id="dropzone" class="button import form"
      :options="dropzoneOptions"
      v-on:vdropzone-removed-file="checkRemovedFile"
      v-on:vdropzone-files-added="checkMultipleFiles"
      v-on:vdropzone-error="checkErrors">
    </vue-dropzone>

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
      <div class="error-log" v-if="errors.length">
        <div>There {{errors.length > 1 ? 'are errors' : 'is an error' }} with:</div>
        <span class="error" v-for="error in errors">{{error}}, </span>
      </div>
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
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.css'


export default {
  name: 'propImport',
  components: {
    ContentBox: ContentBox,
    vueDropzone: vue2Dropzone
  },
  mixins: [ clickaway ],
  data: function() {
    return {
      imported: false,
      draggedOver: false,

      //local file storage
      activeFBX: {},
      activeOBJ: {},
      activeMTL: {},
      textures: [],
      errors: [],

      //dropzone params
      dropzoneOptions: {
          thumbnailWidth: 100,
          thumbnailHeight: 100,
          clickable: false,
          addRemoveLinks: true,
          dictRemoveFile: "x",
          dictCancelUpload: "x",
          dictFileTooBig: "Files must be smaller than {{maxFilesize}}MB on free plan",
          acceptedFiles: ".mtl, .obj, .fbx, image/*",
          maxFilesize: 50,
          url: 'whocares',      //--this library needs a url because they are doing way too much
          accept: this.dropzoneValidate //--prevents library from sending server event (just never call done())
      }
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


    // -- drag file handler
    //
    dropzoneValidate: function(file, done) {
      var ext = file.name.split('.').pop().toLowerCase();

      //handle fbx
      if (ext == 'fbx') {
        if      (!_.isEmpty(this.activeFBX)) { done("there is already a .fbx file in prop"); }
        else if (!_.isEmpty(this.activeOBJ) || !_.isEmpty(this.activeMTL)) { done("there is already .obj info in prop"); }
        else {
          this.activeFBX = file;
          this.readFile(file, ext);
          console.log(this.activeFBX.name);
        }
      }

      //handle obj
      if (ext == 'obj') {
        if      (!_.isEmpty(this.activeOBJ)) { done("there is already an .obj file in prop"); }
        else if (!_.isEmpty(this.activeFBX)) { done("there is already .fbx info in prop"); }
        else {
          this.activeOBJ = file;
          this.readFile(file, ext);
        }
      }
      if (ext == 'mtl') {
        if      (!_.isEmpty(this.activeMTL)) { done("there is already a .mtl file in prop"); }
        else if (!_.isEmpty(this.activeFBX)) { done("there is already .fbx info in prop"); }
        else {
          this.activeMTL = file;
          this.readFile(file, ext);
        }
      }

      //handle images
      if (file.type == '') {

      }

    },
    checkRemovedFile: function(file, err) {
      if      (file.name == this.activeFBX.name) { this.activeFBX = {}; }
      else if (file.name == this.activeOBJ.name) { this.activeOBJ = {}; }
      else if (file.name == this.activeMTL.name) { this.activeMTL = {}; }
      else if (_.includes(this.errors, file.name)) {
        this.errors.splice(this.errors.indexOf(file.name), 1)
      }
    },
    checkErrors: function(file, message) {
      this.errors.push(file.name);
    },
    checkMultipleFiles: function(file) { return },

    readFile: function(file, ext) {
      var reader = new FileReader();
      reader.readAsText(file);
      //reader.addEventListener("loadend", function(e) { console.log(event);});
      //reader.readAsBinaryString(file);
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

      &.import
        height: 200px
        padding: 0
        border: 2px dashed $action_color
        background-color: #F6F6F6
        margin-bottom: 20px
        +flexbox
        +align-items(center)
        overflow-y: hidden
        overflow-x: scroll
        padding: 20px
        .import-prop
          color: $action_color


        .dz-message
          width: 100%
          text-align: center
        .dz-preview
          width: 100px
          height: 100px
          margin: 0 0 0 10px
          border-radius: 2px
          box-shadow: 2px 2px 8px #c5c5c5
          border: none
          &.dz-error
            border: 5px solid #f55151
            .dz-remove
              top: -13px
              right: -13px
              opacity: 1
          .dz-image
            border-radius: 2px
            background: $action_color
          .dz-progress
            display: none
          .dz-details
            color: white
            text-align: center
            +flexbox
            +flex-direction(column)
            +justify-content(center)
            height: 100%
            background-color: rgba(0, 0, 0, 0)
            padding: 10px
            cursor: default
            .dz-size
              margin-bottom: 5px
              font-size: 15px
            .dz-filename,.dz-filename
              overflow: hidden
              text-overflow: ellipsis
              word-wrap: break-word
              white-space: initial
          .dz-error-mark,.dz-success-mark
            top: 25%
          .dz-error-mark
            opacity: 0
          .dz-remove
            width: 30px
            height: 30px
            background-color: #f55151
            border-radius: 100px
            border: none
            top: -7px
            right: -7px
            display: flex
            align-items: center
            justify-content: center
            font-size: 12px
            +systemType(normal)
            color: white
            &:hover
              text-decoration: none
          .dz-error-message
            background-color: #f55151
            background: #f55151
            padding: 5px
            color: white
            line-height: 17px
            z-index: 20
            height: 100%
            border-radius: 0
            top: 0
            left: 0
            +flexbox
            +align-items(center)
            +justify-content(center)
            &::after
              display: none


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
