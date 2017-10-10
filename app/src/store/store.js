Vuex = require('vuex')

state = {
  activePanel: 'cameraFX',

  //dmx board
  lock: false,
  channels: [0,0,0,0,0],

  //channel mixer sliders
  channel_mixer: {
    red: {
      red:    0,
      green:  0,
      blue:   0
    },
    green: {
      red:    0,
      green:  0,
      blue:   0
    },
    blue: {
      red:    0,
      green:  0,
      blue:   0
    }
  },

  //tonemapping sliders
  tonemapping: {
    temperature:  0,
    tint:         0,
    saturation:   0
  },

  //2D sliders
  two_d_sliders: {
    lift:   [0,0],
    gamma:  [0,0],
    gain:   [0,0]
  }


}

mutations = {

  SET_ACTIVE_PANEL: function(state, value) {
    state.activePanel = value;
  },

  //DMX board
  SET_CHANNELS_COLLECTION: function(state, {channel, value}) {
    //hard coding channels 1 - 5 (pos 0 -4)
    state.channels.splice(channel, 1, value);
    //pos 5 - 520
    for (var i = 5; i < 512; i++) {
      state.channels[i] = 0;
    }
  },
  UPDATE_LOCK: function(state, val) {
    state.lock = val;
  },

  //FX Board
  UPDATE_CHANNEL_MIXER: function(state, val) {
    state.channel_mixer[val.channel][val.name] = val.value;
  },
  UPDATE_TONEMAPPING: function(state, val) {
    state.tonemapping[val.name] = val.value;
  },
  UPDATE_2D_SLIDER: function(state, slider, xVal, yVal){
    state.two_d_sliders[slider] = [xVal,yVal];
  }




}

module.exports = new Vuex.Store({
  state,
  mutations,
  strict: process.env.NODE_ENV != 'production'
})
