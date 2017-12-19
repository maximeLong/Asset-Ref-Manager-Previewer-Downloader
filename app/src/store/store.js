import Vue from 'vue'
import Vuex from 'vuex'
import feathersVuex from 'feathers-vuex'
import server from '../server'
import router from '../router'

//feathers actions
const { service, auth } = feathersVuex(server, { idField: '_id' })
//custom server actions
import serverActions from '../actions/serverActions'

Vue.use(Vuex);
export const store = new Vuex.Store({

  state: {
      userPanel: { open: false, panelType: 'userInfo' }, //panelType can be : 'signIn', 'createAccount', 'userInfo', 'team'
      layoutOptions: false,
      propImport: false,
      propInfo: false,

      formEmail: '',
      formTeamName: '',
      formLayoutName: '',
      formPassword: '',
      formInviteEmail: '',

      formPropName: '',

      //current team
      currentTeam: {},

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
      //team layouts dummy
      // layouts: [
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
      service('users'),
      service('layouts'),
      service('teams'),
      service('variants'),
      service('assets')
  ],

  actions: {

    // -- first major db lookup, gets layouts and teams, and current of both
    // -- should open websocket connection, for getter lists (store.getters['teams/list'])
    // -- TODO: populate doesn't work when lists update from websocket
    //
    async signInLoad (store) {
      const res = await store.dispatch('layouts/find', {
        query: { users: store.state.auth.user._id }
      })

      console.log(res, 'sign in load stuff is done')
      store.commit('SET_USER_PANEL', {open: false})

      return res
    },

    // -- other user actions
    //
    createUser: function({dispatch, commit}, props) {
      dispatch('users/create', props)
      .then(success => {
        dispatch('signInUser', props)
      })
      .catch(error => { console.log(error) })
    },
    signInUser: function({dispatch, commit}, {email, password}) {
      dispatch('auth/authenticate', {strategy: 'local', email, password})
      .then(success => {
        dispatch('signInLoad')
        .then(success => {
          router.push({ name: 'LayoutLoading' })
        })
      })
      .catch(error => { console.log(error) })
    },
    logOutUser: function({dispatch, commit}) {
      dispatch('auth/logout')
      .then(success => {
        //-- clear the store of user specific stuff
        router.push({ name: 'Landing' })
        commit('layouts/clearAll');
        commit('SET_CURRENT_LAYOUT', {});
      })
      .catch(error => { console.log(error) })
    },

    //-- team actions -- move to router when you finish
    //
    findCurrentTeamLayouts: function(store, team) {
      store.commit('SET_CURRENT_TEAM', team);
      store.dispatch('layouts/find', {
        query: {
          teams: team._id,
          $populate: ['users', 'creator', 'admins', 'teams']
        }
      }).then(success => { console.log(success)})
        .catch(error => { console.log(error) })
    }

    //-- layout action
    //-- automatically update CurrentLayout when getter is getter stream is modified from server


  },

  mutations: {

      SET_USER_PANEL: function(state, {open, panelType}) {
        state.userPanel.open = open;
        if (panelType != undefined) {
          state.userPanel.panelType = panelType;
        }
      },

      SET_PROP_INFO: function(state, val) { state.propInfo = val; },
      SET_PROP_IMPORT: function(state, val) { state.propImport = val; },
      SET_LAYOUT_OPTIONS: function(state, val) { state.layoutOptions = val; },

      SET_FORM_PROPNAME: function(state, val) { state.formPropName = val },

      SET_FORM_EMAIL: function(state, val) { state.formEmail = val; },
      SET_FORM_TEAMNAME: function(state, val) { state.formTeamName = val; },
      SET_FORM_LAYOUTNAME: function(state, val) { state.formLayoutName = val; },
      SET_FORM_PASSWORD: function(state, val) { state.formPassword = val; },
      SET_FORM_INVITEEMAIL: function(state, val) { state.formInviteEmail = val },

      SET_CURRENT_TEAM: function(state, val) { state.currentTeam = val },

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
