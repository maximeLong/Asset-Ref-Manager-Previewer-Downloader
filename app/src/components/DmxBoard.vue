<template>
  <div id="dmxBoard">

    <content-box :title="'DMX Controls'">
        <div id="tableContainer">
          <slider :channel="0"></slider>
          <slider :channel="1"></slider>
          <slider :channel="2"></slider>
          <slider :channel="3"></slider>
          <slider :channel="4"></slider>
        </div>
    </content-box>

    <div class="lock">
      <button @click="lockChannel">test lock channels</button>
    </div>

  </div>
</template>

<script>
import Slider from './Slider'
import ContentBox from './ContentBox'

export default {
  name: 'dmxBoard',
  components: {
    Slider,
    ContentBox
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
      +systemType(average)
      color: $action_color
      +clickable

</style>
