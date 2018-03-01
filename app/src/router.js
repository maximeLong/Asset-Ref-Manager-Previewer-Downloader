import Vue      from 'vue'
import Router   from 'vue-router'
import {store}  from './store/store'

import Landing        from './views/Landing'
import Scene          from './views/Scene'
import NoScene        from './views/NoScene'
import CreateScene    from './views/CreateScene'
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
        if (store.state.firebaseStore.user) {
          next(vm => {})
        } else {
          console.log('no user -- go to landing')
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
