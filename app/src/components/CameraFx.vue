<template>
  <div id="cameraFX">

    <div class="content-box">
      <h2 class="content-header">Channel Mixer</h2>
      <div class="content-content">
        <div class="fx-buttons">
          <div class="button"
            v-for="channel in channels"
            @click="activeChannel = channel"
            :class="{ active : activeChannel == channel }">
            {{channel}}
          </div>
        </div>

        <fx-slider :name="'red'"   :sliderValue="mixerValue('red')" :onUpdate="updateMixer"></fx-slider>
        <fx-slider :name="'green'" :sliderValue="mixerValue('green')" :onUpdate="updateMixer"></fx-slider>
        <fx-slider :name="'blue'"  :sliderValue="mixerValue('blue')" :onUpdate="updateMixer"></fx-slider>

      </div>
    </div>

    <div class="content-box">
      <h2 class="content-header">Tonemapping</h2>
      <div class="content-content">

        <fx-slider :name="'temperature'" :sliderValue="toneMappingValue('temperature')" :onUpdate="updateToneMapper"></fx-slider>
        <fx-slider :name="'saturation'"  :sliderValue="toneMappingValue('saturation')" :onUpdate="updateToneMapper"></fx-slider>
        <fx-slider :name="'tint'"        :sliderValue="toneMappingValue('tint')" :onUpdate="updateToneMapper"></fx-slider>

      </div>
    </div>

    <div class="content-box">
      <h2 class="content-header">Contrast</h2>
      <div class="content-content">

        <fx-slider :name="'contrast'" :sliderValue="contrastValue('contrast')" :onUpdate="updateContrast"></fx-slider>
        <fx-slider :name="'brightness'"  :sliderValue="contrastValue('brightness')" :onUpdate="updateContrast"></fx-slider>
        <fx-slider :name="'tone'"        :sliderValue="contrastValue('tone')" :onUpdate="updateContrast"></fx-slider>

      </div>
    </div>

  </div>
</template>

<script>
import FxSlider from './FxSlider'

export default {
  name: 'cameraFx',
  components: {
    FxSlider
  },
  data: function(){
    return {
      channels: ['red', 'green', 'blue'],
      activeChannel: 'red'
    }
  },
  computed: {

  },
  methods: {
    mixerValue: function(value) {
      return this.$store.state.channel_mixer[this.activeChannel][value];
    },
    updateMixer: function(value, name) {
      this.$store.commit('UPDATE_CHANNEL_MIXER', {
        channel: this.activeChannel,
        name: name,
        value: value
      });
    },

    toneMappingValue: function(value){
      return this.$store.state.tonemapping[value];
    },
    updateToneMapper: function(value, name){
      this.$store.commit('UPDATE_TONEMAPPING', {
        name: name,
        value: value
      });
    },

    contrastValue: function(value){
      return this.$store.state.contrast[value];
    },
    updateContrast: function(value, name){
      this.$store.commit('UPDATE_CONTRAST', {
        name: name,
        value: value
      });
    }

  }

}
</script>

<style scoped lang="sass">
@import src/styles/main
#cameraFX

  .fx-buttons
    +flexbox
    +align-items(center)
    +flex-direction(row)
    border: 1px solid $border_color
    border-radius: 3px
    margin-bottom: 20px
    .button
      +clickable
      padding: 10px 0
      +flex(1)
      text-align: center
      &.active
        background-color: $button_color

        color: white
      &:nth-of-type(1)
        border-right: 1px solid $border_color
      &:nth-of-type(2)
        border-right: 1px solid $border_color

</style>
