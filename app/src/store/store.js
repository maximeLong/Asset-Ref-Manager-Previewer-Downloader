Vuex = require('vuex')

state = {
  something: 'hi',
  lock: false,
  channels: [
    0,
    0,
    0,
    0,
    0
  ]
}

mutations = {
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
  }

}

module.exports = new Vuex.Store({
  state,
  mutations,
  strict: process.env.NODE_ENV != 'production'
})
