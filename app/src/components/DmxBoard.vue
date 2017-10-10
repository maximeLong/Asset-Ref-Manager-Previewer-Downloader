<template>
  <div id="dmxBoard">

    <div class="content-box">
      <h2 class="content-header">DMX Sneak Controls</h2>
      <div id="tableContainer" class="content-content">
        <slider :channel="0"></slider>
        <slider :channel="1"></slider>
        <slider :channel="2"></slider>
        <slider :channel="3"></slider>
        <slider :channel="4"></slider>
      </div>
    </div>
    <div class="lock">
      <button @click="lockChannel">test lock channels</button>
    </div>

  </div>
</template>

<script>
import Slider from './Slider'

export default {
  name: 'dmxBoard',
  components: {
    Slider
  },

  computed: {
    lock: function() { return this.$store.state.lock }
  },
  methods: {
    lockChannel: function(){
      this.$store.commit('UPDATE_LOCK', !this.lock)
    }
  }

}
</script>

<style scoped lang="sass">
@import src/styles/main
#dmxBoard

  #tableContainer
    overflow-x: scroll
    +flexbox
    +flex-direction(row)

  .lock
    margin-top: 20px
    padding: 15px 0
    background-color: $content_box_background
    text-align: center
    button
      background-color: transparent
      border: none
      outline: 0
      +consoleType(normal)
      color: $action_color
      +clickable

</style>
