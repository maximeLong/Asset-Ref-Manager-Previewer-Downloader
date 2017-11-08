<template>
  <div id="sceneView">

    <div class="page-header">
      <h1>{{activeScene.name}}</h1>
      <h2>See other scenes</h2>
    </div>

    <content-box :title="'Scene Varients'">
        <div class="scene-container" v-for="variant in activeScene.variants">
          <div class="scene-title" @click="setActiveVariant(variant.name)">{{variant.name}}</div>
          <div class="scene-information" v-if="activeVariant == variant.name">

            <asset-collection :assets="variant.assets"></asset-collection>

          </div>
        </div>
    </content-box>

    <content-box :title="'Shared Assets'">
        a bunch of assets that are shared across varients
    </content-box>

  </div>
</template>

<script>
import AssetCollection from './AssetCollection'
import ContentBox from './ContentBox'

export default {
  name: 'teamView',
  components: {
    AssetCollection,
    ContentBox
  },
  data: function(){
    return {
      activeVariant: ''
    }
  },
  computed: {
    activeScene: function() {
      return this.$store.state.activeScene;
    }
  },
  methods: {
    setActiveVariant: function(clickedScene){
      if (this.activeVariant == clickedScene) {
        this.activeVariant = '';
      } else {
        this.activeVariant = clickedScene;
      }
    }

  }

}
</script>

<style scoped lang="sass">
@import src/styles/main
#sceneView
  .scene-container
    border: 1px solid $border_color
    padding: 15px
    margin-bottom: 15px
    &:last-of-type
      margin: 0
    .scene-title
      +headerType(normal)
      font-size: 17px
      +clickable
      color: $action_color
    .scene-information
      padding-top: 10px

</style>
