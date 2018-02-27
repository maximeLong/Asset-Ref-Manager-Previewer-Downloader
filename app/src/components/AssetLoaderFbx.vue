<template>
<div id="asset-loader-fbx">

  <div id="asset-loader" v-show="!loaded">

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

  <div id="asset-viewer" v-show="loaded">
    <transition name="fadeup" mode="out-in">
      <div class="button" @click="takeSnapShot" v-if="activeModel && !snapshotIsTaken" key="take">Snapshot</div>
      <div class="asset-snapshot" v-else key="snap">
        <img :src="snapshot">
      </div>
    </transition>
  </div>

</div>
</template>
<script>

import _ from 'lodash'


import * as THREE from 'three'
import '@/loaders/FBXLoader'
(window).THREE = THREE;
const OrbitControls = require("three/examples/js/controls/OrbitControls");


import vue2Dropzone from 'vue2-dropzone' //need to reimplement this library if using this again
import 'vue2-dropzone/dist/vue2Dropzone.css'


export default {
  name: 'assetLoaderFbx',
  components: {
    vueDropzone: vue2Dropzone
  },
  data: function() {
    return {
      loaded: false,
      snapshotIsTaken: false,

      //local file storage
      activeModel: {},
      activeTextures: [],
      snapshot: undefined,
      errors: [],
      //three
      camera: {},
      scene: {},
      controls: {},
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
          maxFilesize: 15.5,
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
    currentScene: function()   { return this.$store.getters['scenes/current'] },
  },
  methods: {

    // -- drag file handler
    dropzoneValidate: function(file, done) {
      var ext = file.name.split('.').pop().toLowerCase();
      //handle fbx
      if (ext == 'fbx') {
        if (!_.isEmpty(this.activeModel)) { done("there is already a .fbx file in asset"); }
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

    //turn file into ObjectURL
    readFile: function(file, ext) {
      this.$store.commit('SET_FBX_MODEL_NAME', file.name);
      this.$store.commit('SET_FBX_MODEL_SIZE', file.size);
      this.$store.commit('SET_FBX_MODEL_FILE', file);
      console.log(file)
      this.$emit('loaded')
      this.loaded = true;

      var _this = this;
      var reader = new FileReader();
      reader.onload = function(e) {
        var binaryData = [];
        binaryData.push(e.target.result);
        var url = window.URL.createObjectURL(new Blob(binaryData, {type: "fbx"}))
        //start scene, and load asset
        if (_.isEmpty(_this.renderer)) { _this.startScene() }
        _this.loadAsset(url)
      };
      reader.readAsArrayBuffer(file);
    },

    //three js scene and model loader
    startScene: function() {
      var container = document.getElementById( 'asset-viewer' );
      var containerHeight = getComputedStyle(container).height.slice(0, -2);
      var containerWidth = getComputedStyle(container).width.slice(0, -2);

      //create scene and camera
      this.camera = new THREE.PerspectiveCamera( 45, containerWidth / containerHeight, 1, 5000 );
      this.scene = new THREE.Scene();

      //render loop -- and add to container
      //TODO: have only one renderer in app, have to mutate renderer
      this.renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true,
        antialias: true,
        alpha: true
      });
      this.renderer.setPixelRatio( window.devicePixelRatio );
      this.renderer.setSize( containerWidth, containerHeight );
      container.appendChild( this.renderer.domElement );

      // controls, camera
      this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
      this.controls.target.set( 0, 12, 0 );
      this.camera.position.set( 2, 18, 28 );
      this.controls.update();

      //basic lights in scene
      var ambientLight = new THREE.AmbientLight(0x999999 );
      this.scene.add(ambientLight);
      var lights = [];
      lights[0] = new THREE.DirectionalLight( 0xc9a26f, 1 );
      lights[0].position.set( 1, 0, 0 );
      lights[1] = new THREE.DirectionalLight( 0x11E8BB, 1 );
      lights[1].position.set( 0.75, 1, 0.5 );
      lights[2] = new THREE.DirectionalLight( 0xFF5B40, 1 );
      lights[2].position.set( -0.75, -1, 0.5 );
      this.scene.add( lights[0] );
      this.scene.add( lights[1] );
      this.scene.add( lights[2] );

      //run loop + watch for resize
      this.animate();
    },
    loadAsset: function(result) {
        var _this = this;

        //manager callbacks
				var manager = new THREE.LoadingManager();
				manager.onProgress = function( item, loaded, total ) { console.log( item, loaded, total ); };
				var onProgress = function( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						//console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
					}
				};
				var onError = function( xhr ) { console.error( xhr ); };

        //fbx loader

				var loader = new THREE.FBXLoader( manager );
        loader.load( result, function( object ) {
          _this.scene.add(object)

          //center the camera
          var boundingBox = new THREE.Box3();
          boundingBox.setFromObject( object );
          var center = boundingBox.getCenter();
          // set camera to rotate around center of object
          _this.controls.target = center;
				}, onProgress, onError );
    },

    takeSnapShot: function() {
      var dataURL = this.renderer.domElement.toDataURL();
      this.snapshot = dataURL;
      this.snapshotIsTaken = true;
      this.$store.commit('SET_FBX_MODEL_SNAPSHOT', dataURL)
      setTimeout( ()=> {
        this.$emit('snap');
        this.snapshotIsTaken = false
      }
      , 2000)
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

      var container = document.getElementById( 'asset-viewer' );
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

#asset-loader-fbx
  #asset-loader
    +flexbox
    +align-items(center)
    #dropzone-model
      +flex(0 0 175px)
      +justify-content(center)
      margin-right: 10px
      overflow: hidden
      .dz-message
        padding-bottom: 10px
      .dz-preview
        margin: 0
    #dropzone-texture
      +flex(1)

  #asset-viewer
    width: 100%
    height: 250px
    background: radial-gradient(#f1e4d1 0%, #737373 100%)
    position: relative
    overflow: hidden
    cursor: move
    cursor: -webkit-grab
    &:active
      cursor: -webkit-grabbing
    .asset-snapshot
      position: absolute
      bottom: 15px
      left: 15px
      height: 60px
      width: auto
      background: radial-gradient(#f1e4d1 0%, #9a9898 100%)
      img
        width: auto
        height: 100%
    .button
      position: absolute
      bottom: 15px
      left: 15px
      +button(false, true, white, 125px)
      background-color: transparent

  //dz override
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
    .import-asset
      color: $action_color


    .dz-message
      width: 100%
      text-align: center
      +systemType(small)
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
