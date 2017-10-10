<template>
  <div class="slider">
    <input type="range" value="0" max="255" :value="channelValue" @input="updateChannelValue">
    <div class="info-container">
      <div class="info channel">Channel: <span>{{channel + 1}}</span></div>
      <div class="info">Integer value: <span>{{channelValue}}</span></div>
      <div class="info byte">UIT8 value: <span>0x{{channelValueToByte}}</span></div>
    </div>

    <div class="lock-sign" v-if="lock && channel == 0"></div>
  </div>
</template>

<script>
export default {
  name: 'slider',
  props: ['channel'],


  computed: {
    channelValueToByte: function() {
      return ("0"+(Number(this.channelValue).toString(16))).slice(-2).toUpperCase()
    },
    channelValue: function() { return this.$store.state.channels[this.channel] },
    lock: function() { return this.$store.state.lock }
  },
  methods: {
    updateChannelValue: function(e) {
      //watch for locks -- kind of hardcoded because ..
      if ((this.channel == 0 || this.channel == 1) && this.lock){
        this.$store.commit('SET_CHANNELS_COLLECTION', {channel: 0, value: e.target.value});
        this.$store.commit('SET_CHANNELS_COLLECTION', {channel: 1, value: e.target.value});
      } else {
        this.$store.commit('SET_CHANNELS_COLLECTION', {channel: this.channel, value: e.target.value});
      }

      this.$socket.emit('dmx', this.$store.state.channels);
      console.log(this.$store.state.channels);
    }
  }

}
</script>

<style scoped lang="sass">
@import src/styles/main


.slider
  border: 3px solid $ink_black
  height: 450px
  padding-top: 160px
  width: 220px
  margin-right: 10px
  position: relative

  input
    +rotate(-90deg)
    height: 30px
    width: 300px
    background-color: white
    margin-left: -40px

    &::-webkit-slider-runnable-track
      width: 10px
      background: $ink_black


  .info-container
    padding-top: 160px
    padding-left: 20px
    span
      color: $action_color

  .lock-sign
    position: absolute
    display: block
    width: 75px
    height: 15px
    border-top: 2px solid $action_color
    border-bottom: 2px solid $action_color
    top: 50%
    left: 185px


</style>
