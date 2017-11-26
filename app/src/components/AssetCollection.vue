<template>
  <div class="assetCollection">

    <div class="asset-list">
      <div class="asset-organizer" v-if="organizer"></div>

      <asset-mini v-for="asset in assets" key="asset.name"
        :name="asset.name"
      ></asset-mini>

    </div>

    <div class="asset-info">
      <div class="mesh-total">total number of meshes in variant: ______</div>
      <div class="upload-asset">upload new model</div>
    </div>

  </div>
</template>

<script>
import AssetMini from './AssetMini'

export default {
  name: 'assetCollection',
  props: {
    assets: Array,
    organizer: Boolean
  },
  components: {
    AssetMini
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
.assetCollection
  +flexbox
  +justify-content(center)
  +align-items(center)
  .asset-list
    +flex(1)
    border-right: 1px solid $border_color
  .asset-info
    padding: 30px
    +flex(1)
    .upload-asset
      +button(false,false,$action_color)
      margin-top: 10px

</style>
