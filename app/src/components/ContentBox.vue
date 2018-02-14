<template>
  <div class="content-box">
    <div class="content-header">
      <h2>{{title}}</h2>
      <slot name="buttons"></slot>
    </div>

    <div class="content-content">

      <slot></slot>

    </div>
  </div>
</template>

<script>

export default {
  name: 'contentBox',
  props: {
    title: String
  },
  components: {
  },
  data: function(){
    return {
    }
  },
  computed: {
  },
  methods: {

  }

}
</script>

<style scoped lang="sass">
@import src/styles/main
.content-box
  background-color: $content_box_background
  border-radius: 3px
  margin-bottom: 30px
  box-shadow: 2px 2px 10px rgba(103, 103, 103, 0.3)
  z-index: 9
  &:last-of-type
    margin-bottom: 0

  .content-header
    padding: 15px 30px
    border-bottom: 1px solid $border_color_light
    +flexbox
    +align-items(center)
    +justify-content(flex-start)
    .buttons
      margin-left: 10px
      +flexbox
      +align-items(center)
      +justify-content(flex-start)
      .button
        margin-left: 25px
        +clickable
        +systemType(small)
        &.active
          color: $action_color

  .content-content
    padding: 30px


</style>
