<template>
  <div class="modal">

    <content-box :title="title" v-on-clickaway="clickawayWrapper">
      <slot></slot>
    </content-box>

  </div>
</template>

<script>

import ContentBox from '../components/ContentBox'
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'modal',
  props: {
    title: String,
    onClickaway: Function
  },
  components: {
    ContentBox: ContentBox,
  },
  mixins: [ clickaway ],
  data: function(){
    return {

    }
  },
  computed: {

  },
  methods: {
    clickawayWrapper: function(e) {
      //TODO: better clickaway handler - have to catch button presses on form bcuz bugs
      if (_.includes(e.target.classList, 'button')) { return } else {
        this.onClickaway();
      }
    }
  }

}
</script>

<style scoped lang="sass">
@import src/styles/main
.modal
  position: absolute
  top: 0
  bottom: 0
  left: 0
  right: 0
  width: 100%
  height: 100%
  +flexbox
  +justify-content(center)
  +align-items(center)
  &::before
    content: ''
    position: absolute
    width: 100%
    height: 100%
    background-color: $side_panel_color
    opacity: .8
  .content-box
    width: 80%
    max-width: 700px


</style>
