<template>
<div id="prop-loader-fbx">

  <div id="prop-loader">

    <vue-dropzone ref="myVueDropzone"
      id="dropzone-model" class="button import"
      :options="dropzoneModelOptions"
      v-on:vdropzone-removed-file="checkRemovedFile"
      v-on:vdropzone-error="checkErrors">
    </vue-dropzone>

    <vue-dropzone ref="myVueDropzoneTex"
      id="dropzone-texture" class="button import"
      :options="dropzoneTextureOptions"
      v-on:vdropzone-removed-file="checkRemovedFile"
      v-on:vdropzone-error="checkErrors">
    </vue-dropzone>

  </div>

  <div class="button" @click="loadProp" v-if="activeModel">Load FBX</div>


  <div id="prop-viewer">

  </div>

</div>
</template>
<script>

import _ from 'lodash'


import * as THREE from 'three'
import '@/loaders/FBXLoader'
(window).THREE = THREE;
const OrbitControls = require("three/examples/js/controls/OrbitControls");


import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.css'


export default {
  name: 'propLoaderFbx',
  components: {
    vueDropzone: vue2Dropzone
  },
  data: function() {
    return {
      loaded: false,
      //local file storage
      activeModel: {},
      activeTextures: [],
      errors: [],
      //three
      camera: {},
      scene: {},
      renderer: {},
      //dropzone params
      dropzoneModelOptions: {
          thumbnailWidth: 100,
          thumbnailHeight: 100,
          clickable: false,
          addRemoveLinks: true,
          dictRemoveFile: "x",
          dictCancelUpload: "x",
          dictFileTooBig: "Files must be smaller than {{maxFilesize}}MB on free plan",
          dictDefaultMessage: "Drop your .fbx file here",
          acceptedFiles: ".fbx",
          maxFiles: 1,
          maxFilesize: 50,
          url: 'whocares', //--this library needs a url because they are doing way too much
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
          dictDefaultMessage: "Drop your texture files here (doesn't work currently)",
          acceptedFiles: "image/*",
          maxFilesize: 50,
          url: 'whocares', //--this library needs a url because they are doing way too much
          accept: this.dropzoneValidate //--prevents library from sending server event (just never call done())
      }
    }
  },
  mounted: function() {
    window.addEventListener('resize', this.onWindowResize)
  },
  destroyed: function() {
    window.removeEventListener('resize', this.onWindowResize);
    //TODO: have only one renderer, shouldnt have to do this cleanup
    if (!_.isEmpty(this.renderer)) {
      this.renderer.forceContextLoss();
      this.renderer.context = null;
      this.renderer.domElement = null;
      this.renderer = null;
      cancelAnimationFrame( this.animate );
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
      //remove activeModel or activeTexture
      if      (file == this.activeModel) { this.activeModel = {}; }
      else if (_.includes(this.activeTextures, file)) {
        this.activeTextures.splice(this.activeTextures.indexOf(file), 1)
      }
      //remove from error array if present
      else if (_.includes(this.errors, file.name)) {
        this.errors.splice(this.errors.indexOf(file.name), 1)
      }
    },
    checkErrors: function(file, message) {
      this.errors.push(file.name);
    },

    //read file after basic validation
    readFile: function(file, ext) {
      var _this = this;
      var reader = new FileReader();
      reader.onload = function(e) {
        var binaryData = [];
        binaryData.push(e.target.result);
        var url = window.URL.createObjectURL(new Blob(binaryData, {type: "fbx"}))

        //start scene, and load prop
        if (_.isEmpty(_this.renderer)) { _this.startScene() }
        _this.loadProp(url)
      };
      reader.readAsArrayBuffer(file);
    },

    startScene: function() {
      var container = document.getElementById( 'prop-viewer' );
      var containerHeight = getComputedStyle(container).height.slice(0, -2);
      var containerWidth = getComputedStyle(container).width.slice(0, -2);

      //create scene and camera
      this.camera = new THREE.PerspectiveCamera( 45, containerWidth / containerHeight, 1, 2000 );
      this.scene = new THREE.Scene();

      // grid helper
      var gridHelper = new THREE.GridHelper( 50, 50, 0x303030, 0x303030 );
      gridHelper.position.set( 0, - 0.04, 0 );
      this.scene.add( gridHelper );

      //render loop -- and add to container
      //TODO: have only one renderer, and make these actions, or mutators to renderer
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setPixelRatio( window.devicePixelRatio );
      this.renderer.setSize( containerWidth, containerHeight );
      container.appendChild( this.renderer.domElement );

      // controls, camera
      var controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
      controls.target.set( 0, 12, 0 );
      this.camera.position.set( 2, 18, 28 );
      controls.update();

      //basic lights in scene
      var hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
      var dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
      hemiLight.position.set(0, 1, 0);
      dirLight.position.set(0, 1, 0);
      this.scene.add(hemiLight);
      this.scene.add(dirLight);

      //run loop + watch for resize
      this.animate();
    },

    loadProp: function(result) {
        var _this = this;

        //manager callbacks
				var manager = new THREE.LoadingManager();
				manager.onProgress = function( item, loaded, total ) { console.log( item, loaded, total ); };
				var onProgress = function( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
					}
				};
				var onError = function( xhr ) { console.error( xhr ); };

        //fbx loader
				var loader = new THREE.FBXLoader( manager );
        loader.load( result, function( object ) {
          _this.scene.add(object)
				}, onProgress, onError );
    },

    //three render functions
    animate: function() {
      if (this.renderer === null) {
        cancelAnimationFrame( this.animate );
      } else {
        requestAnimationFrame( this.animate );
        this.render();
      }
    },
    render: function() {
    	this.renderer.render( this.scene, this.camera );
    },
    onWindowResize: function(container) {

      var container = document.getElementById( 'prop-viewer' );
      var containerHeight = getComputedStyle(container).height.slice(0, -2);
      var containerWidth = getComputedStyle(container).width.slice(0, -2);
      if (!_.isEmpty(this.renderer)) {
        this.camera.aspect = containerWidth / containerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( containerWidth, containerHeight );
      }
		}

  }

}
</script>

<style lang="sass">
@import src/styles/main

#prop-loader-fbx
  #prop-viewer
    width: 100%
    height: 300px
  #prop-loader
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
