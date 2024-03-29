import Vue from 'vue'
import Router from 'vue-router'
import {store} from './store/store'


import Landing        from './views/Landing'
import Scene         from './views/Scene'
import SceneLoading  from './views/SceneLoading'

import NoScene       from './views/NoScene'
import CreateScene   from './views/CreateScene'
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
      path: '/noscene',
      name: 'NoScene',
      component: NoScene,
      beforeEnter: (to, from, next) => {
        next(vm => {}) //need to call next for router to continue to fire
      }
    },
    {
      path: '/scene/:scene_id',
      name: 'Scene',
      component: Scene,
      beforeEnter: (to, from, next) => {
        if (store.state.auth.user) {

          //TODO: currentScene doesn't update on changes to "currentScene" getter
          store.dispatch('scenes/get', [to.params.scene_id])
          .then(success => {
            console.log('scene success', success)
            next(vm => {})
          })
          .catch(error => {
            console.log('scene error', error)
            next({ name: 'SceneLoading' })
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
      path: '/scene',
      name: 'SceneLoading',
      component: SceneLoading,
      beforeEnter: (to, from, next) => {
        if (store.state.auth.user) {
          if (!store.state.scenes.ids.length) {
            console.log('go to no scene')
            next({ name: 'NoScene' })
          }
          else {
            console.log('go to scene')
            next({ name: 'Scene', params: { scene_id: store.state.scenes.keyedById[store.state.scenes.ids[0]]._id }})
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
      path: '/createscene',
      name: 'CreateScene',
      component: CreateScene,
      beforeEnter: (to, from, next) => {
        next(vm => {}) //need to call next for router to continue to fire
      }
    }
  ]
})
