import Vue from 'vue'
import Router from 'vue-router'
import {store} from './store/store'


import Landing      from './views/Landing'
import Layout       from './views/Layout'
import CreateLayout from './views/CreateLayout'
import CreateTeam   from './views/CreateTeam'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: Landing,
      beforeEnter: (to, from, next) => {
        next(vm => {}) //need to call next for router to continue to fire
      }
    },
    {
      path: '/layout/:layout_id',
      name: 'Layout',
      component: Layout,
      beforeEnter: (to, from, next) => {
        next(vm => {}) //need to call next for router to continue to fire
      }
    },
    {
      path: '/createteam',
      name: 'CreateTeam',
      component: CreateTeam,
      beforeEnter: (to, from, next) => {
        next(vm => {}) //need to call next for router to continue to fire
      }
    },
    {
      path: '/createlayout',
      name: 'CreateLayout',
      component: Landing,
      beforeEnter: (to, from, next) => {
        next(vm => {}) //need to call next for router to continue to fire
      }
    }
  ]
})
