<template>
  <div class="content-box">
    <h2 class="content-header">{{title}}</h2>
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

  h2.content-header
    padding: 15px 30px
    border-bottom: 1px solid $border_color
  .content-content
    padding: 30px


</style>
