// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'

import App from './App'

// import VueSocketio from 'vue-socket.io';
// Vue.use(VueSocketio, 'http://localhost:3000');
Vue.use(Vuex)
const store = require('./store/store')

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  store
  // sockets:{
  //   connect: function(){
  //     console.log('socket connected')
  //   }
  // },
})
