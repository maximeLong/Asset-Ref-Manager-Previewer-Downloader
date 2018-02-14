import Vue from 'vue'
import Vuex from 'vuex'
import feathersVuex from 'feathers-vuex'
import server from '../server'
import router from '../router'

//feathers actions
const { service, auth } = feathersVuex(server, { idField: '_id' })

Vue.use(Vuex);
export const store = new Vuex.Store({

  state: {

      userPanel: { open: false, panelType: 'userInfo' }, //panelType can be : 'signIn', 'createAccount', 'userInfo', 'team'

      sceneOptions: false, //scene options panel
      assetImport: false,    //import asset panel
      assetInfo: false,      //asset info panel

      //various form info holders
      formEmail: '',
      formTeamName: '',
      formSceneName: '',
      formPassword: '',
      formInviteEmail: '',
      formAssetName: '',

      //model info on import
      modelGeometryInfo: {},
      modelFileSize: '',
      modelFile: undefined,
      modelSnapshot: undefined,

      //current team
      currentTeam: {}
  },

  plugins: [
      auth({userService: '/users'}),
      service('users'),
      service('scenes'),
      service('assets'),

      service('teams')

  ],

  actions: {

    // -- first major db lookup, gets scenes and teams, and current of both
    // -- should open websocket connection, for getter lists (store.getters['teams/list'])
    // -- TODO: populate doesn't work when lists update from websocket
    //
    async signInLoad (store) {
      const res = await store.dispatch('scenes/find', {
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
          router.push({ name: 'SceneLoading' })
        })
      })
      .catch(error => { console.log(error) })
    },
    logOutUser: function({dispatch, commit}) {
      dispatch('auth/logout')
      .then(success => {
        //-- clear the store of user specific stuff
        router.push({ name: 'Landing' })
        commit('scenes/clearAll');
        commit('SET_CURRENT_SCENE', {});
      })
      .catch(error => { console.log(error) })
    },

    //-- team actions -- move to router when you finish
    //
    findCurrentTeamScenes: function(store, team) {
      store.commit('SET_CURRENT_TEAM', team);
      store.dispatch('scenes/find', {
        query: {
          teams: team._id,
          $populate: ['users', 'creator', 'admins', 'teams']
        }
      }).then(success => { console.log(success)})
        .catch(error => { console.log(error) })
    }

  },

  mutations: {

      SET_USER_PANEL: function(state, {open, panelType}) {
        state.userPanel.open = open;
        if (panelType != undefined) {
          state.userPanel.panelType = panelType;
        }
      },

      SET_ASSET_INFO: function(state, val)        { state.assetInfo = val; },
      SET_ASSET_IMPORT: function(state, val)      { state.assetImport = val; },
      SET_SCENE_OPTIONS: function(state, val)    { state.sceneOptions = val; },

      SET_FORM_ASSETNAME: function(state, val)    { state.formAssetName = val },
      SET_FORM_EMAIL: function(state, val)        { state.formEmail = val; },
      SET_FORM_TEAMNAME: function(state, val)     { state.formTeamName = val; },
      SET_FORM_SCENENAME: function(state, val)   { state.formSceneName = val; },
      SET_FORM_PASSWORD: function(state, val)     { state.formPassword = val; },
      SET_FORM_INVITEEMAIL: function(state, val)  { state.formInviteEmail = val },

      SET_MODEL_GEOMETRY_INFO: function(state, val)   { state.modelGeometryInfo = val },
      SET_MODEL_FILE_SIZE: function(state, val)       { state.modelFileSize = val },
      SET_MODEL_FILE: function(state, val)            { state.modelFile = val },
      SET_MODEL_SNAPSHOT: function(state, val)        { state.modelSnapshot = val },

      SET_CURRENT_TEAM: function(state, val)   { state.currentTeam = val },
  }

});
