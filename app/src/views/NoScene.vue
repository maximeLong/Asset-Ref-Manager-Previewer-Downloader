<template>
  <div id="no-scene">
    <div class="no-scene-helper">
      <div>You haven't made a scene yet.</div>
      <router-link to="/createscene">
        <div>Make one!</div>
      </router-link>
    </div>
  </div>
</template>

<script>

export default {
  name: 'noScene',
  data: function(){
    return {}
  }

}
</script>

<style scoped lang="sass">
@import src/styles/main

#no-scene
  height: 100%
  +flexbox
  +justify-content(center)
  +align-items(center)
  .no-scene-helper
    background-color: $border_color_light
    width: 500px
    height: 250px
    border-radius: 2px
    +flexbox
    +justify-content(center)
    +align-items(center)
    +flex-direction(column)
    div
      margin: 10px 0

</style>
