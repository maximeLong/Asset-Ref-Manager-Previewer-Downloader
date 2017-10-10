<template>
  <div id="header-content">

    <div class="logo">hi</div>

    <div class="middle-section">
      <div class="options">
        <div class="icon"></div>
      </div>
    </div>

    <div class="right-section">
      <div class="account-image"></div>
      <div class="account-name">Hotmax Interactive</div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'appHeader',
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
$margin_amount: 55px

#header-content
  width: 100%
  height: 100%
  +flexbox
  +align-items(center)
  +flex-direction(row)
  +justify-content(space-between)
  background-color: $header_color
  border-bottom: 1px solid $border_color
  +headerType(small)
  //font-weight: bold

  .logo
    +flexbox
    +align-items(center)
    +justify-content(center)
    width: 75px
    height: 100%
    margin-right: 40px
    border-right: 1px solid $border_color

  .middle-section
    +flexbox
    +align-items(center)
    +justify-content(flex-end)
    height: 100%
    //border-left: 1px solid red
    +flex(1)

    .options
      width: 75px
      height: 100%
      border-left: 1px solid $border_color
      +flexbox
      +align-items(center)
      +justify-content(center)
      .icon
        width: 55px
        height: 55px
        background-size: contain
        background-position: 50% 50%
        background-repeat: no-repeat
        border-radius: 100%
        background-image: url('../assets/other-icon-color.svg')

  .right-section
    +flexbox
    +align-items(center)
    +justify-content(center)
    margin-right: $margin_amount
    height: 100%
    padding-left: 25px
    border-left: 1px solid $border_color
    .account-image
      width: 45px
      height: 45px
      border: 1px solid $border_color
      border-radius: 100%
      margin-right: 10px
      
      background-size: contain
      background-position: 50% 50%
      background-repeat: no-repeat
      border-radius: 100%
      background-image: url('../assets/insta-logo.jpg')

</style>
