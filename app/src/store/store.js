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

      //FBX model info
      FBXModelVertices: 0,
      FBXModelType: '',
      FBXModelVersion: '',
      FBXModelSize: '',
      FBXModelName: '',
      FBXModelSnapshot: undefined,
      FBXModelFile: undefined,

      //current team
      currentTeam: {}
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

      SET_PROP_INFO: function(state, val)       { state.propInfo = val; },
      SET_PROP_IMPORT: function(state, val)     { state.propImport = val; },
      SET_LAYOUT_OPTIONS: function(state, val)  { state.layoutOptions = val; },

      SET_FORM_PROPNAME: function(state, val)   { state.formPropName = val },

      SET_FORM_EMAIL: function(state, val)        { state.formEmail = val; },
      SET_FORM_TEAMNAME: function(state, val)     { state.formTeamName = val; },
      SET_FORM_LAYOUTNAME: function(state, val)   { state.formLayoutName = val; },
      SET_FORM_PASSWORD: function(state, val)     { state.formPassword = val; },
      SET_FORM_INVITEEMAIL: function(state, val)  { state.formInviteEmail = val },

      SET_FBX_MODEL_VERTICES: function(state, val)  { state.FBXModelVertices += val },
      SET_FBX_MODEL_TYPE: function(state, val)      { state.FBXModelType = val },
      SET_FBX_MODEL_VERSION: function(state, val)   { state.FBXModelVersion = val },
      SET_FBX_MODEL_NAME: function(state, val)      { state.FBXModelName = val },
      SET_FBX_MODEL_SIZE: function(state, val)      {state.FBXModelSize = val},
      SET_FBX_MODEL_SNAPSHOT: function(state, val)  {state.FBXModelSnapshot = val},
      SET_FBX_MODEL_FILE: function(state, val)      {state.FBXModelFile = val},


      SET_CURRENT_TEAM: function(state, val) { state.currentTeam = val },
  }

});
