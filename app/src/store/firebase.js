//firebase store
import firebase from '@firebase/app';
import router from '../router'
import _ from 'lodash'
import md5 from 'md5'

export const firebaseStore = {
  namespaced: true, //access actions with 'firebase/whatever'

  actions: {

    //TODO: have to mimic the waterfall on automatic auth
    signIn: function(store, {email, password}) {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((success)=> {
          console.log('signed in... watchAuth should fire..')
          store.commit('SET_USER_PANEL', {open: false}, {root : true})
        })
        .catch((error)=>  { console.log(error) });
    },

    signOut: function(store) {
      firebase.auth().signOut()
        .then((success)=> {
          console.log('signed out')
          //TODO: this should unsubscribe all snapShots in memory
          store.commit('SET_USER_PANEL', {open: false}, {root : true})
          store.commit('SET_RAW_SCENES_DATA', [])
          store.commit('SET_POPULATED_SCENES_DATA', [])
        })
        .catch((error)=>  { console.log(error) });
    },

    createUser: function(store, {email, password}) {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user)=> {
          //create user doc in firestore using user.uid as doc uuid
          firebase.firestore().collection('users').doc(user.uid).set({
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
      firebase.auth().onAuthStateChanged((user)=> {
        if (user) {
          var userData = {
            email: user.email,
            uid: user.uid,
            emailVerified: user.emailVerified,
            providerData: user.providerData,
            metaData: user.metadata
          };

          //get userInfo stored in firestore
          firebase.firestore().collection("users").doc(user.uid)
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
      store.dispatch('getScenesByUser', uid)

        //basically wants to wait for populated scenes to end before pushing to route
        //but resolve has to fire even if no onSnapshot happens (log out + back in)
        .then((sucess)=> {
          if (store.state.populatedScenes.length) {
            router.push({ name: 'Scene', params: { scene_id: store.state.populatedScenes[store.state.currentSceneIndex]._id }})
          } else {
            router.push({ name: 'NoScene' })
          }
        })
        .catch((error)=> {
          console.log('something went wrong with the initial scene lookup:', error)
          router.push({ name: 'Landing' })
        })
    },

    //subscribe to scene_user docs, and subscribe (so that we can see additions, removals, changes to admin status)
    //TODO: hold subscriber and unsub on complete teardown event (like logout)
    getScenesByUser: function(store, uid) {
      return new Promise((resolve, reject) => {

        firebase.firestore().collection("scenes_link_users")
        .where("userId", "==", uid)
        .onSnapshot((snapshot) => {
          var scenesByUser = [];
          snapshot.forEach((doc) => {
            scenesByUser.push(_.merge({_id: doc.id}, doc.data()) )
          });
          store.commit('SET_RAW_SCENES_DATA', scenesByUser)
          store.dispatch('populateScenes', scenesByUser)
            .then((success)=> {
              resolve()
            })

        }, (error)=> {
          reject(error)
        });
      });
    },


    populateScenes: function({state, commit, rootState}, rawScenes) {
      return new Promise((resolve, reject) => {

        //check (+) -- if rawScenes has object that isnt in popScene
        //TODO: hold subscriber to unsub
        rawScenes.forEach((rawScene)=> {
          if ( !_.some(state.populatedScenes, {'_id': rawScene.sceneId}) ) {

            console.log('populate scene: ' + rawScene.sceneId)

            firebase.firestore().collection("scenes").doc(rawScene.sceneId)
            .onSnapshot((doc) => {
              var populatedScene = _.merge({_id: doc.id}, doc.data());
              var popSceneIndex = _.findIndex(state.populatedScenes, function(o) { return o._id == doc.id; });
              if ( popSceneIndex !== -1 ) {
                commit('UPDATE_POPULATED_SCENE_DATA', {splicePosition: popSceneIndex, newVal: populatedScene})
              } else {
                commit('ADD_POPULATED_SCENE_DATA', populatedScene)
              }

              //BUG: this wont resolve on logout/login, bcuz snapshot is cached and doesn't fire again
              resolve()
            })
          }
        })

        //check (-) -- if popScenes has object that isnt in rawScenes
        //TODO: this needs to unsub as well -- look at vueFire for inspiration
        state.populatedScenes.forEach((popScene)=> {
          if ( !_.some(rawScenes, {'sceneId': popScene._id}) ) {

            var popSceneIndex = _.findIndex(state.populatedScenes, popScene );
            commit('REMOVE_POPULATED_SCENE_DATA', popSceneIndex)
          }
        })

      })
    },

    getUsersByScene: async function(store, sceneId) {
      //NOTE: duplicating data model to include email --> will save a populate but can't change email
      //TODO: unsubscribe on scene change
      //BUG: signOut() fires onSnapshot and returns error (bcuz no auth)
      firebase.firestore().collection("scenes_link_users")
      .where("sceneId", "==", sceneId)
      .onSnapshot((snapshot) => {
        var usersInScene = [];
        snapshot.forEach((doc) => {
          usersInScene.push(_.merge({_id: doc.id}, doc.data()) )
        });
        store.commit('SET_USERS_IN_CURRENT_SCENE_DATA', usersInScene)
      }, (error)=> {
        //console.log(error)
      });
    }

  },


  getters: {
    //scene change just changes the index of populatedScenes[]
    currentScene: function(state) {
      return state.populatedScenes[state.currentSceneIndex];
    }
  },


  //-- STATE AND MUTATORS
  //
  state: {
    user: null,

    rawScenes: [],
    populatedScenes: [],

    currentSceneIndex: 0,
    usersInCurrentScene: [],

    //TODO: need manage large sets of asset data (thumbs need to be released + watchers unsubbed)
    // currentSceneAssets: [],
    // currentUserAssets: [],
    // currentAsset: {},


  },
  mutations: {
    SET_USER_DATA: function(state, val)   { state.user = val; },

    SET_RAW_SCENES_DATA: function(state, val)      { state.rawScenes = val; },

    SET_POPULATED_SCENES_DATA: function(state, val) { state.populatedScenes = val },
    ADD_POPULATED_SCENE_DATA: function(state, val) {
      state.populatedScenes.push(val)
    },
    UPDATE_POPULATED_SCENE_DATA: function(state, {splicePosition, newVal}) {
      state.populatedScenes.splice(splicePosition, 1, newVal)
    },
    REMOVE_POPULATED_SCENE_DATA: function(state, splicePosition) {
      state.populatedScenes.splice(splicePosition, 1)
    },

    SET_CURRENT_SCENE_INDEX: function(state, val) { state.currentSceneIndex = val },
    SET_USERS_IN_CURRENT_SCENE_DATA: function(state, val) { state.usersInCurrentScene = val }

  }

}
