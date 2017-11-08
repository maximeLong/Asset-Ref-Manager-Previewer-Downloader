<template>
  <div class="assetExpanded">
    <div class="thumbnail"><img :src="image"></div>
    <div class="name">{{name}}</div>

    <div class="amount">{{amount}}</div>
  </div>
</template>

<script>

export default {
  name: 'assetExpanded',
  props: {
    name: String,
    image: String,
    amount: Number
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
.assetExpanded
  background-color: white
  padding: 10px

  .thumbnail
    width: 100px
    height: 100px
    border: 1px solid $border_color
    margin-bottom: 10px

</style>
