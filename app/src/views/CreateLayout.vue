<template>
  <div id="create-layout">
    landing content
  </div>
</template>

<script>

export default {
  name: 'createLayout',
  data: function(){
    return {

    }
  },
  computed: {
    user: function()            { return this.$store.state.auth.user },
    userIsLoggedIn: function()  { return this.user ? true : false },
  },
  methods: {

  }

}
</script>

<style scoped lang="sass">
@import src/styles/main

#create-layout

</style>
