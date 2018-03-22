import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'

//modules
import {users} from './modules/users'
import {scenes} from './modules/scenes'
import {assets} from './modules/assets'
import {ux} from './modules/ux'
import {apis} from './modules/apis'


//initialize db
import {initApp} from './plugins/initApp'         //initialize application

Vue.use(Vuex);
export const store = new Vuex.Store({

  plugins: [
    initApp
  ],
  modules: {
    users,
    scenes,
    assets,
    ux,
    apis
  },

  actions: {},
  state: {},
  mutations: {}

});
