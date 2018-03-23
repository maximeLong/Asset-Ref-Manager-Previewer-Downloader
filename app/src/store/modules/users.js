//firebase hooks
import { auth, usersCollection } from '../plugins/initApp'
import router from '../../router'
import md5 from 'md5'


export const users = {
  namespaced: true, //access actions with 'users/whatever'

  actions: {

    signIn: function(store, {email, password}) {
      auth.signInWithEmailAndPassword(email, password)
        .then((success)=> {
          console.log('signed in... watchAuth should fire..')
          store.commit('ux/SET_USER_PANEL', {open: false}, {root : true})
        })
        .catch((error)=>  { console.log(error) });
    },

    signOut: function(store) {
      auth.signOut()
        .then((success)=> {
          console.log('signed out')
          //TODO: this should unsubscribe all snapShots in memory
          store.commit('ux/SET_USER_PANEL', {open: false}, {root : true})
          store.commit('scenes/SET_POPULATED_SCENES_DATA', [], {root : true})
        })
        .catch((error)=>  { console.log(error) });
    },

    createUser: function(store, {email, password}) {
      auth.createUserWithEmailAndPassword(email, password)
        .then((user)=> {
          usersCollection.doc(user.uid).set({
            email: email,
            thumbnail_big: 'http://www.gravatar.com/avatar/' + md5(email) + '.jpg?s=' + 150 + '&d=retro',
            thumbnail_small: 'http://www.gravatar.com/avatar/' + md5(email) + '.jpg?s=' + 50 + '&d=retro',
          })
            .then((success)=> { store.dispatch('signIn', {email: email, password: password}) })
            .catch((error)=> { console.log(error) })
        })
        .catch((error)=> { console.log(error) });
    },

    watchAuthChange: function(store) {

      auth.onAuthStateChanged((user)=> {
        if (user) {
          var userData = {
            email: user.email,
            uid: user.uid,
            emailVerified: user.emailVerified,
            providerData: user.providerData,
            metaData: user.metadata
          };

          // > then get info in firestore
          usersCollection.doc(user.uid)
            .get()
            .then((doc)=> {
              if (doc.exists) {
                userData.thumbnail_big = doc.data().thumbnail_big;
                userData.thumbnail_small = doc.data().thumbnail_small;
                store.commit('SET_USER_DATA', userData);

                //begin the loading process on succesful authentication
                store.dispatch('beginLoadApp', user.uid)

              } else { console.log({message: 'no user info'}) }
            }).catch((error)=> { console.log(error) })

        } else {
          //if no user then go back to landing
          store.commit('SET_USER_DATA', null);
          router.push({ name: 'Landing' })
        }
      });
    },

    //takes the userId and begins the scene load process
    beginLoadApp: function(store, uid) {
      store.dispatch('scenes/getScenesByUser', uid, {root: true})
        .then((sucess)=> {
          if (store.rootState.scenes.populatedScenes.length) {
            router.push({
              name: 'Scene',
              params: { scene_id: store.rootState.scenes.populatedScenes[store.rootState.scenes.currentSceneIndex]._id }
            })
          } else {
            router.push({ name: 'NoScene' })
          }
        })
        .catch((error)=> {
          console.log('something went wrong with initial scene lookup:', error)
          router.push({ name: 'Landing' })
        })
    }

  },

  //-- STATE AND MUTATORS
  //
  state: {
    user: null
  },
  mutations: {
    SET_USER_DATA: function(state, val)   { state.user = val; }
  }
}
