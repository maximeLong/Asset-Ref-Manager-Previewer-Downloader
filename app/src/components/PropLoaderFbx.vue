<template>
<div id="prop-loader-fbx">

    <vue-dropzone ref="myVueDropzone"
      id="dropzone-model" class="button import"
      :options="dropzoneModelOptions"
      v-on:vdropzone-removed-file="checkRemovedFile"
      v-on:vdropzone-files-added="checkMultipleFiles"
      v-on:vdropzone-error="checkErrors">
    </vue-dropzone>

    <vue-dropzone ref="myVueDropzoneTex"
      id="dropzone-texture" class="button import"
      :options="dropzoneTextureOptions"
      v-on:vdropzone-removed-file="checkRemovedFile"
      v-on:vdropzone-files-added="checkMultipleFiles"
      v-on:vdropzone-error="checkErrors">
    </vue-dropzone>


</div>
</template>
<script>

import _ from 'lodash'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.css'


export default {
  name: 'propLoaderFbx',
  components: {
    vueDropzone: vue2Dropzone
  },
  data: function() {
    return {

      //local file storage
      activemodel: {},
      activeTextures: [],
      errors: [],

      //dropzone params
      dropzoneModelOptions: {
          thumbnailWidth: 100,
          thumbnailHeight: 100,
          clickable: false,
          addRemoveLinks: true,
          dictRemoveFile: "x",
          dictCancelUpload: "x",
          dictFileTooBig: "Files must be smaller than {{maxFilesize}}MB on free plan",
          acceptedFiles: ".fbx",
          maxFilesize: 50,
          url: 'whocares',       //--this library needs a url because they are doing way too much
          accept: this.dropzoneValidate //--prevents library from sending server event (just never call done())
      },

      dropzoneTextureOptions: {
          thumbnailWidth: 100,
          thumbnailHeight: 100,
          clickable: false,
          addRemoveLinks: true,
          dictRemoveFile: "x",
          dictCancelUpload: "x",
          dictFileTooBig: "Files must be smaller than {{maxFilesize}}MB on free plan",
          acceptedFiles: "image/*",
          maxFilesize: 50,
          url: 'whocares',      //--this library needs a url because they are doing way too much
          accept: this.dropzoneValidate //--prevents library from sending server event (just never call done())
      }
    }
  },

  computed: {
    user: function()            { return this.$store.state.auth.user },
    currentLayout: function()   { return this.$store.getters['layouts/current'] },
  },
  methods: {

    // -- drag file handler
    //
    dropzoneValidate: function(file, done) {
      var ext = file.name.split('.').pop().toLowerCase();

      //handle fbx
      if (ext == 'fbx') {

        if (!_.isEmpty(this.activeModel)) { done("there is already a .fbx file in prop"); }
        else {
          this.activeModel = file;
          this.readFile(file, ext);
        }
      }

      //handle images
      else if (_.includes(file.type, 'image')) {

        //duplicate check
        if (this.activeTextures.findIndex(texture => texture.name === file.name) === 0) {
          done("you have already included this texture");
        }
        else {
          this.activeTextures.push(file);
          this.readFile(file, ext);
        }
      }

    },
    checkRemovedFile: function(file, err) {
      //remove activeModel or activeTextur
      if      (file == this.activeModel) { this.activeModel = {}; }
      else if (_.includes(this.activeTextures, file)) {
        this.errors.splice(this.activeTextures.indexOf(file), 1)
      }
      //remove from error array if present
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
      // reader.readAsBinaryString(file);
      reader.addEventListener("loadend", function(e) { console.log(event);});
    },

  }

}
</script>

<style lang="sass">
@import src/styles/main

#prop-loader-fbx
  +flexbox
  +align-items(center)

  #dropzone-model
    +flex(0 0 175px)
    +justify-content(center)
    margin-right: 10px
    .dz-preview
      margin: 0
  #dropzone-texture
    +flex(1)

  .import
    height: 175px
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



</style>
