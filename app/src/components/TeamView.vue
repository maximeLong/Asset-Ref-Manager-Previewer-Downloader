<template>
  <div id="teamView">

    <content-box :title="'Scenes'">
        <div class="scene-container" v-for="scene in scenes">
          <div class="scene-title" @click="setPanel('sceneView')">{{scene.name}}</div>
          <div class="scene-information">
            assetCount: {{scene.assets.length}}
            <br>
            authors: <span v-for="author in scene.authors">{{author.name}}</span>
          </div>
        </div>
    </content-box>

    <content-box :title="'Team Assets'">
        assets components in use
    </content-box>

    <content-box :title="'Members'">
        list of team members
    </content-box>

  </div>
</template>

<script>
import ContentBox from './ContentBox'

export default {
  name: 'teamView',
  components: {
    ContentBox
  },
  data: function(){
    return {
      activeScene: ''
    }
  },
  computed: {
    scenes: function() {
      return this.$store.state.scenes.ids;
    }
  },
  methods: {
    setActiveScene: function(clickedScene){
      if (this.activeScene == clickedScene) {
        this.activeScene = '';
      } else {
        this.activeScene = clickedScene;
      }
    },
    setPanel: function(value){
      this.$store.commit('SET_ACTIVE_PANEL', value);
    }

  }

}
</script>

<style scoped lang="sass">
@import src/styles/main
#teamView
  .scene-container
    border: 1px solid $border_color
    padding: 15px
    margin-bottom: 15px
    &:last-of-type
      margin: 0
    .scene-title
      +userType(average)
      +clickable
      color: $action_color
    .scene-information
      padding-top: 10px

</style>
