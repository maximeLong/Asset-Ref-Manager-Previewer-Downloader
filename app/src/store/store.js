import Vue from 'vue'
import Vuex from 'vuex'
import feathersVuex from 'feathers-vuex'
import server from '../server'
const { service, auth } = feathersVuex(server, { idField: '_id' })

Vue.use(Vuex);

export const store = new Vuex.Store({

  state: {
      activePanel: 'teamView',
      userPanel: { open: false, panelType: 'userInfo' } //panelType can be : 'signIn', 'createAccount', 'userInfo'

      //dmx board
      // lock: false,
      // channels: [0,0,0,0,0],
      //channel mixer sliders
      // channel_mixer: {
      //   red: {
      //     red:    0,
      //     green:  0,
      //     blue:   0
      //   },
      //   green: {
      //     red:    0,
      //     green:  0,
      //     blue:   0
      //   },
      //   blue: {
      //     red:    0,
      //     green:  0,
      //     blue:   0
      //   }
      // },
      // tonemapping: {
      //   temperature:  0,
      //   tint:         0,
      //   saturation:   0
      // },
      // contrast: {
      //   contrast:   0,
      //   brightness: 0,
      //   tone:       0
      // },
      // two_d_sliders: {
      //   lift:   [0,0],
      //   gamma:  [0,0],
      //   gain:   [0,0]
      // },

      //team scenes dummy
      // scenes: [
      //   {
      //     name: 'Sheraton 2018 Gala',
      //     assets: [
      //       {
      //         name: 'someAsset',
      //       }
      //     ],
      //     varients: 2,
      //     authors: [
      //       {
      //         name: 'maximeLong'
      //       }
      //     ]
      //   }
      // ],
      // activeScene: {
      //   name: 'Sheraton 2018 Gala',
      //   assets: [
      //     {
      //       name: 'someAsset',
      //     }
      //   ],
      //   variants: [
      //     {
      //       name: 'Sheraton 2018 Varient - No podium',
      //       assets: [
      //         {
      //             name: 'someAsset'
      //         }
      //       ]
      //     },
      //     {
      //       name: 'Sheraton 2018 Varient - Extra chairs',
      //       assets: [
      //         {
      //             name: 'someAsset'
      //         }
      //       ]
      //     }
      //   ],
      //   authors: [
      //     {
      //       name: 'maximeLong'
      //     }
      //   ]
      // }
  },

  plugins: [
      auth({userService: '/users'}),
      service('scenes'),
      service('teams'),
      service('variants'),
      service('assets')
  ],

  actions: {
    createAccount: function({dispatch, commit}, {email, password, team}) {
      dispatch('users/create')
    }

  },

  mutations: {

      SET_ACTIVE_PANEL: function(state, value) {
        state.activePanel = value;
      },
      SET_USER_PANEL: function(state, {open, panelType}) {
        state.userPanel.open = open;
        state.userPanel.panelType = panelType;
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
      UPDATE_CONTRAST: function(state, val) {
        state.contrast[val.name] = val.value;
      },
      UPDATE_2D_SLIDER: function(state, slider, xVal, yVal){
        state.two_d_sliders[slider] = [xVal,yVal];
      }
  }

});
