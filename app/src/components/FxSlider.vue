<template>
  <div class="fxSlider">

    <div class="name">{{name}}</div>
    <div class="value">{{sliderValue}}</div>
    <input type="range" value="0" min="-20" max="20" :value="sliderValue" @input="updateSlider">

  </div>
</template>

<script>
export default {
  name: 'fxSlider',
  props: ['name', 'onUpdate', 'sliderValue'],

  computed: {},
  methods: {
    updateSlider: function(e) {
      if (this.onUpdate != null) {
        this.onUpdate(e.target.value, this.name);
      }
    }
  }

}
</script>

<style scoped lang="sass">
@import src/styles/main


.fxSlider
  width: 100%
  height: 30px
  +flexbox
  +align-items(center)
  +justify-content(space-between)

  .name
    width: 150px
  .value
    text-align: center
    width: 100px
    border: 1px solid $border_color
    height: 25px

  input
    +flex(1)
    margin-left: 20px


</style>
