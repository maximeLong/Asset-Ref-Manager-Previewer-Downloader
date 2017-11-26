// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import { sync } from 'vuex-router-sync'
import {store} from './store/store';
import router from './router' // vue-router instance
const unsync = sync(store, router) // done. Returns an unsync callback fn

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  store,
  router
})
