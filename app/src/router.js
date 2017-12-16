import Vue from 'vue'
import Router from 'vue-router'
import {store} from './store/store'


import Landing        from './views/Landing'
import Layout         from './views/Layout'
import LayoutLoading  from './views/LayoutLoading'

import NoLayout       from './views/NoLayout'
import CreateLayout   from './views/CreateLayout'
import CreateTeam     from './views/CreateTeam'


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
      path: '/nolayout',
      name: 'NoLayout',
      component: NoLayout,
      beforeEnter: (to, from, next) => {
        next(vm => {}) //need to call next for router to continue to fire
      }
    },
    {
      path: '/layout/:layout_id',
      name: 'Layout',
      component: Layout,
      beforeEnter: (to, from, next) => {
        if (store.state.auth.user) {

          //TODO: currentLayout doesn't update on changes to "currentLayout" getter
          store.dispatch('layouts/get', [to.params.layout_id])
          .then(success => {
            console.log('layout success', success)
            next(vm => {})
          })
          .catch(error => {
            console.log('layout error', error)
            next({ name: 'LayoutLoading' })
          })
        } else {
          next('/')
        }
      },
      beforeRouteUpdate: (to, from, next) => {
        console.log('do we need this?')
      }
    },
    {
      path: '/layout',
      name: 'LayoutLoading',
      component: LayoutLoading,
      beforeEnter: (to, from, next) => {
        if (store.state.auth.user) {
          if (!store.state.layouts.ids.length) {
            console.log('go to no layout')
            next({ name: 'NoLayout' })
          }
          else {
            console.log('go to layout')
            next({ name: 'Layout', params: { layout_id: store.state.layouts.keyedById[store.state.layouts.ids[0]]._id }})
          }
        } else {
          next('/')
        }
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
      component: CreateLayout,
      beforeEnter: (to, from, next) => {
        next(vm => {}) //need to call next for router to continue to fire
      }
    }
  ]
})
