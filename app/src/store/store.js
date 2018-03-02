import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'

import {firebaseStore} from './firebase'  //firestore module
import {initApp} from './initApp'         //initialize application

Vue.use(Vuex);
export const store = new Vuex.Store({

  plugins: [
    initApp
  ],
  modules: {
    firebaseStore
  },

  actions: {

    // -- first major db lookup, gets scenes and teams, and current of both
    // -- TODO: populate doesn't work when lists update from websocket
    signInLoad: async function(store) {
      const res = await store.dispatch('scenes/find', {
        query: { users: store.state.auth.user._id }
      })
      console.log(res, 'sign in load stuff is done')
      store.commit('SET_USER_PANEL', {open: false})
      return res
    },

    // -- other user actions
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

    //-- create asset
    createAsset: function(store, formData) {
      fetch(process.env.SERVER_ADDRESS + '/model', {
        method: 'POST',
        body: formData
      })
      .then((res) => {
        if (!res.ok) {
          res.json().then((data)=> {console.log(data) }); //error
          store.commit('SET_ASSET_STANDIN', false);
        } else {
          res.json().then((data)=> {console.log(data) }); //success
          store.commit('SET_ASSET_STANDIN', false);
        }
      })
      .catch((error) => { //catch all other errors?
        console.log('res failed', error);
        store.commit('SET_ASSET_STANDIN', false);
      })
      //close the modal before response is done
      store.commit('SET_ASSET_IMPORT', false);
      store.commit('SET_ASSET_STANDIN', true);
    }

  },

  state: {
    userPanel: { open: false, panelType: 'userInfo' }, //panelType can be : 'signIn', 'createAccount', 'userInfo', 'team'
    sceneOptionsModalIsOpen: false, //scene options panel
    assetImportModalIsOpen: false,    //import asset panel
    assetInfoModalIsOpen: false,      //asset info panel

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

    //model standin that exists between upload click and server response
    assetStandin: false,
  },

  mutations: {
    SET_USER_PANEL: function(state, {open, panelType}) {
      state.userPanel.open = open;
      if (panelType != undefined) {
        state.userPanel.panelType = panelType;
      }
    },

    SET_ASSET_INFO_MODAL_IS_OPEN: function(state, val)        { state.assetInfoModalIsOpen = val; },
    SET_ASSET_IMPORT_MODAL_IS_OPEN: function(state, val)      { state.assetImportModalIsOpen = val; },
    SET_SCENE_OPTIONS_MODAL_IS_OPEN: function(state, val)     { state.sceneOptionsModalIsOpen = val; },

    SET_FORM_ASSETNAME: function(state, val)    { state.formAssetName = val },
    SET_FORM_EMAIL: function(state, val)        { state.formEmail = val; },
    SET_FORM_TEAMNAME: function(state, val)     { state.formTeamName = val; },
    SET_FORM_SCENENAME: function(state, val)    { state.formSceneName = val; },
    SET_FORM_PASSWORD: function(state, val)     { state.formPassword = val; },
    SET_FORM_INVITEEMAIL: function(state, val)  { state.formInviteEmail = val },

    SET_MODEL_GEOMETRY_INFO: function(state, val)   { state.modelGeometryInfo = val },
    SET_MODEL_FILE_SIZE: function(state, val)       { state.modelFileSize = val },
    SET_MODEL_FILE: function(state, val)            { state.modelFile = val },
    SET_MODEL_SNAPSHOT: function(state, val)        { state.modelSnapshot = val },

    SET_ASSET_STANDIN: function(state, val) { state.assetStandin = val },
  }

});
