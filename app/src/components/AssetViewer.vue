<template>
  <div id="asset-viewer">

    <transition name="fade">
      <div class="loader" v-if="!loaded">
        <dot-loader :color="'#4e4e4e'"></dot-loader>
      </div>
    </transition>

    <div class="wireframe-toggle" @click="toggleWireframe(!wireframe)" v-if="showWireframeButton && loaded">
      <div></div>
    </div>
    <transition name="fadeup" mode="out-in" v-if="showSnapButton">
      <div class="button" @click="takeSnapShot" v-if="!snapshotIsTaken" key="take">Snapshot</div>
      <div class="asset-snapshot" v-else key="snap">
        <img :src="snapshot">
      </div>
    </transition>

  </div>
</template>


<script>

const THREE = window.THREE = require('three');
import _ from 'lodash'
import DotLoader from 'vue-spinner/src/DotLoader.vue'

const OrbitControls =  require("three/examples/js/controls/OrbitControls");
const GLTFLoader =     require('three/examples/js/loaders/GLTFLoader');
const Detector =       require('three/examples/js/Detector');
// const ValidationController =  require('.@/loaders/gltf/validation-controller');


export default {
  name: 'assetViewer',

  components: {
    DotLoader
  },

  props: {
    showSnapButton: Boolean,
    showWireframeButton: Boolean,
    assetIsBinary: Boolean,
    gltfFileMap: Object,      // handles gltf viewer
    binaryUrl: String         //handle glb viewer from remote or local url
    //
    // -- reverse props ($emits) api:
    // 1) loadSuccess, 2) loadFailure, 3) snapTaken
    //
  },
  data: function(){
    return {
      //snapshot
      snapshotIsTaken: false,
      snapshot: undefined,
      loaded: false,

      //three scenes
      camera: {},
      scene: {},
      controls: {},
      renderer: {},

      //three state
      wireframe: false,
      gammaOutput: true,
      exposure: 0.9,
      textureEncoding: 'sRGB',
      ambientIntensity: 1.04,
      ambientColor: 0xFFFFFF,
      directIntensity: 0.22,
      directColor: 0xFFFFFF,
      lights: [],
      content: undefined,

    }
  },

  // 1) check if WebGL
  // 2) start THREE scene
  // 3) Load model
  mounted: function() {
    window.addEventListener('resize', this.onWindowResize);
    if(!Detector.webgl) {
      window.alert("WebgGL is not supported in your browser");
    } else {
      this.startScene();
    }
  },
  destroyed: function() {
    window.removeEventListener('resize', this.onWindowResize);
    if (!_.isEmpty(this.renderer)) {
      this.renderer.forceContextLoss();
      this.renderer.context = null;
      this.renderer.domElement = null;
      this.renderer = null;
      cancelAnimationFrame( this.animate );
    }
  },

  computed: {
    userIsLoggedIn: function()  { return this.user ? true : false },
    user: function()            { return this.$store.state.auth.user },
    device: function()          { return this.$store.state.device },
  },

  methods: {

    // -- handle paths dependent if gltf or glb
    //
    prepLoad: function() {
      if (!this.assetIsBinary) {
        var url = this.gltfFileMap.fileURL;
        var rootPath = this.gltfFileMap.rootPath;
        var assetMap = this.gltfFileMap.fileMap;
        const manager = new THREE.LoadingManager();
        const baseURL = THREE.LoaderUtils.extractUrlBase(url);
        const blobURLs = [];
        manager.setURLModifier((url, path) => {
          const normalizedURL = rootPath + url
            .replace(baseURL, '')
            .replace(/^(\.?\/)/, '');
          if (assetMap.has(normalizedURL)) {
            const blob = assetMap.get(normalizedURL);
            const blobURL = URL.createObjectURL(blob);
            blobURLs.push(blobURL);
            return blobURL;
          }
          return (path || '') + url;
        });
        const loader = new THREE.GLTFLoader(manager);
        loader.setCrossOrigin('anonymous');

        this.load(url, loader)
        .then(()=> {
          this.$store.commit('SET_MODEL_GEOMETRY_INFO', this.renderer.info);
          this.loaded = true;
          this.$emit('loadSuccess');
        })
        .catch((error) => {
          console.log(error);
          this.$emit('loadFailure');
          window.alert((error||{}).message || error);
        });
      }

      //if glb just serve URL endpoint
      else {
        var url = this.binaryUrl;
        const loader = new THREE.GLTFLoader();
        this.load(url, loader)
        .then(()=> {
          this.loaded = true;
          this.$store.commit('SET_MODEL_GEOMETRY_INFO', this.renderer.info);
          this.$emit('loadSuccess');
        })
        .catch((error) => {
          console.log(error);
          this.$emit('loadFailure');
          window.alert((error||{}).message || error);
        });
      }
    },


    load: function(url, loader) {
      return new Promise((resolve, reject) => {
        loader.load(url, (gltf) => {

          const scene = gltf.scene || gltf.scenes[0];
          this.scene.add(scene);

          scene.updateMatrixWorld();
          const box = new THREE.Box3().setFromObject(scene);
          const size = box.getSize().length();
          const center = box.getCenter();

          this.controls.reset();
          scene.position.x += (scene.position.x - center.x);
          scene.position.y += (scene.position.y - center.y);
          scene.position.z += (scene.position.z - center.z);
          this.controls.maxDistance = size * 10;
          this.camera.position.copy(center);
          this.camera.position.x += size / 2.0;
          this.camera.position.y += size / 5.0;
          this.camera.position.z += size / 2.0;
          this.camera.near = size / 100;
          this.camera.far = size * 100;
          this.camera.updateProjectionMatrix();
          this.camera.lookAt(center);
          this.controls.saveState();

          //add lights and material
          this.updateLights();
          this.updateTextureEncoding(scene);
          this.content = scene;

          resolve();
        }, undefined, reject);
      });
    },

    //three js scene and model loader
    startScene: function() {
      var container = document.getElementById( 'asset-viewer' );
      var containerHeight = getComputedStyle(container).height.slice(0, -2);
      var containerWidth = getComputedStyle(container).width.slice(0, -2);

      //create scene and camera
      var color = new THREE.Color( 0xf3f3f3 );
      this.camera = new THREE.PerspectiveCamera( 45, containerWidth / containerHeight, 1, 5000 );
      this.scene = new THREE.Scene();
      this.scene.background = color;

      //render loop -- and add to container
      //TODO: have only one renderer in app, have to mutate renderer
      this.renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true,
        antialias: true,
      });
      this.renderer.setPixelRatio( window.devicePixelRatio );
      this.renderer.setSize( containerWidth, containerHeight );
      this.renderer.gammaOutput = this.gammaOutput;
      container.appendChild( this.renderer.domElement );

      // controls, camera
      this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
      this.controls.target.set( 0, 12, 0 );
      this.camera.position.set( 2, 18, 28 );
      this.controls.update();

      //run loop + watch for resize
      this.animate();
      this.prepLoad();
    },

    updateTextureEncoding: function(content) {
      const encoding = this.textureEncoding === 'sRGB'
        ? THREE.sRGBEncoding
        : THREE.LinearEncoding;
      content.traverse((node) => {
        if (node.isMesh) {
          const material = node.material;
          if (material.map) material.map.encoding = encoding;
          if (material.emissiveMap) material.emissiveMap.encoding = encoding;
          if (material.map || material.emissiveMap) material.needsUpdate = true;
        }
      });
    },
    updateLights: function() {
      const lights = this.lights;
      this.addLights();
      this.renderer.toneMappingExposure = this.exposure;
      if (lights.length) {
        lights[0].intensity = this.ambientIntensity;
        lights[0].color.setHex(this.ambientColor);
        lights[1].intensity = this.directIntensity;
        lights[1].color.setHex(this.directColor);
      }
    },
    addLights: function() {
      const light1  = new THREE.AmbientLight(this.ambientColor, this.ambientIntensity);
      light1.name = 'ambient_light';
      this.scene.add( light1 );
      const light2  = new THREE.DirectionalLight(this.directColor, this.directIntensity);
      light2.position.set(0.5, 0, 0.866); // ~60º
      light2.name = 'main_light';
      this.scene.add( light2 );
      this.lights.push(light1, light2);
    },

    //three render functions
    animate: function() {
      if (this.renderer === null) {
        cancelAnimationFrame( this.animate );
      } else {
        requestAnimationFrame( this.animate );

        this.controls.update();
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
		},

    // -- viewer specific functions
    //
    toggleWireframe: function(val) {
      this.wireframe = val;
      this.content.traverse((node) => {
        if (node.isMesh) {
          node.material.wireframe = this.wireframe;
        }
      });
    },
    takeSnapShot: function() {
      var dataURL = this.renderer.domElement.toDataURL("image/jpeg", 0.75);
      this.snapshot = dataURL;
      this.snapshotIsTaken = true;
      this.$store.commit('SET_MODEL_SNAPSHOT', dataURL)
      setTimeout( ()=> {
        this.$emit('snapTaken');
        this.snapshotIsTaken = false
      }
      , 2000)
    }


  //end methods
  }

}
</script>

<style lang="sass">
@import src/styles/main

#asset-viewer
  width: 100%
  height: 250px
  background: $asset_background
  position: relative
  overflow: hidden
  cursor: move
  cursor: -webkit-grab
  &:active
    cursor: -webkit-grabbing
  .loader
    width: 100%
    height: 100%
    +flexbox
    +align-items(center)
    +justify-content(center)
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
    +button(false, true, $action_color, 125px)
    background-color: transparent

  .wireframe-toggle
    position: absolute
    top: 15px
    left: 15px
    z-index: 1
    border-radius: 50px
    padding: 10px
    background-color: grey
    width: 40px
    height: 40px
    +flexbox
    +align-items(center)
    +justify-content(center)
    +clickable
    div
      height: 25px
      width: 25px
      // background: url('../assets/wireframe.svg')
      // background-repeat: no-repeat
      // background-position: 50% 50%

</style>
