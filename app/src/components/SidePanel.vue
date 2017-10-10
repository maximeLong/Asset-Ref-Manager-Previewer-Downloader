<template>
  <div id="side-panel-content">

    <div class="option fx"
      @click="setPanel('cameraFX')"
      :class="{ active: activePanel == 'cameraFX' }"></div>
    <div class="option move"></div>
    <div class="option dmx"
      @click="setPanel('dmxBoard')"
      :class="{ active: activePanel == 'dmxBoard' }"></div>
    <div class="option other"></div>

  </div>
</template>

<script>

export default {
  name: 'sidePanel',
  data: function(){
    return {
    }
  },
  computed: {
    activePanel: function() {
      return this.$store.state.activePanel;
    }
  },
  methods: {
    setPanel: function(value){
      this.$store.commit('SET_ACTIVE_PANEL', value);
    }
  }

}
</script>

<style scoped lang="sass">
@import src/styles/main
#side-panel-content
  height: 100%
  border-right: 1px solid $border_color
  +flexbox
  +align-items(center)
  +flex-direction(column)
  +justify-content(center)

  .option
    +clickable
    height: 40px
    width: 40px
    margin: 25px 0
    +flexbox
    +align-items(center)

    background-size: contain
    background-position: 50% 50%
    background-repeat: no-repeat
    border-radius: 100%
    background-color: #d0cfcf

    &.active
      background-color: $action_color
      box-shadow: 0px 0px 13px $action_color

    &.dmx
      background-image: url('../assets/dmx-icon.svg')
    &.fx
      background-image: url('../assets/camera-icon.svg')
    &.move
      background-image: url('../assets/resize-icon.svg')
    &.other
      background-image: url('../assets/other-icon.svg')

</style>
