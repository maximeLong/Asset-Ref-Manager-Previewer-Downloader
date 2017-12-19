<template>
<div id="palette">
  <content-box :title="'Palette'">

    <div class="palette-container">
      <div class="prop-container">
      </div>

      <div class="upload-container">
        <input v-model="propSearch" placeholder="search public props, WIP">
        <div class="devider"></div>
        <div class="open-import" @click="openImport">Import from file</div>
      </div>

    </div>


  </content-box>
</div>

</template>

<script>
import ContentBox from './ContentBox'

export default {
  name: 'palette',
  components: {
    ContentBox,
  },
  data: function() {
    return {
      propSearch: ''
    }
  },
  computed: {
    user: function()            { return this.$store.state.auth.user },
    currentLayout: function()   { return this.$store.state.currentLayout },
  },
  methods: {
    openImport: function() { this.$store.commit('SET_PROP_IMPORT', true) }
  }

}
</script>

<style scoped lang="sass">
@import src/styles/main

#palette
  margin-top: 40px
  .palette-container
    +flexbox
    .prop-container
      +flex(2)

    .upload-container
      +flex(.5)
      input
        border-radius: 100px
        padding: 12px 15px
      .devider
        margin: 20px 0
        height: 2px
        background-color: $border_color_light
      .open-import
        +button(false,true)

</style>
