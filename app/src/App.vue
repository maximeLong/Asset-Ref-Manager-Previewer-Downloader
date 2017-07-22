<template>
  <div id="app">
    <h1>DMX Imposter</h1>
    <h2>Integer to UIT8 Byte Code, and into Unity</h2>

    <div id="tableContainer">
      <slider :channel="0"></slider>
      <slider :channel="1"></slider>
      <slider :channel="2"></slider>
      <slider :channel="3"></slider>
      <slider :channel="4"></slider>
    </div>

    <div class="lock">
      <button @click="lockChannel">test lock channels</button>
    </div>

  </div>
</template>

<script>

import Slider from './components/Slider'
export default {
  name: 'app',
  components: {
    Slider
  },
  methods: {
    lockChannel: function(){
      this.$store.commit('UPDATE_LOCK', !this.lock)
    }
  },
  computed: {
    lock: function() { return this.$store.state.lock }
  }
}
</script>

<style lang="sass">
@import src/styles/main
#app
  position: relative
  width: 100vw
  height: 100vh
  overflow: hidden
  background-color: #f5e6e3
  border: 20px solid white
  padding: 50px
  +consoleType(normal)
  color: $ink_black

  #tableContainer
    margin-top: 50px
    +flexbox
    +flex-direction(row)

  h1
    +headerType(big)
    color: $ink_black
  h2
    +consoleType(normal)
    color: $action_red
    padding-top: 5px

  .lock
    padding: 15px 0 0 15px
    button
      background-color: transparent
      border: none
      outline: 0
      +consoleType(normal)
      color: $action_red
      +clickable



</style>
