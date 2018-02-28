//firebase store
import firebase from '@firebase/app';
import _ from 'lodash'
import md5 from 'md5'

export const firebaseStore = {
  namespaced: true, //access actions with 'firebase/whatever'

  actions: {

    signIn: function(store, {email, password}) {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((success)=> { console.log('signed in... watchAuth should fire..') })
        .catch((error)=>  { console.log(error) });
    },
    signOut: function(store) {
      firebase.auth().signOut
        .then((success)=> { console.log('signed out... watchAuth should fire..') })
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

    watchAuthChange: function({state, commit, rootState}) {
      return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged((user)=> {
          if (user) {
            var userData = {
              email: user.email,
              uid: user.uid,
              emailVerified: user.emailVerified,
              providerData: user.providerData,
              metaData: user.metadata
            };
            commit('SET_USER_DATA', userData);
            resolve(userData);
          } else {
            commit('SET_USER_DATA', null);
            reject({message: 'no user'});
          }
        });
      })
    },

    //subscribe to scene_user docs, and subscribe (so that we can see additions, removals, changes to admin status)
    //TODO: unsub on complete teardown event (like logout)
    //TODO: need where statement
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

          resolve(scenesByUser)
        }, (error)=> {
          console.log(error)
          reject(error)
        });
      });
    },


    populateScenes: function({state, commit, rootState}, rawScenes) {
      //check (+) -- if rawScenes has object that isnt in popScene
      rawScenes.forEach((rawScene)=> {
        if ( !_.some(state.populatedScenes, {'_id': rawScene.sceneId}) ) {

          firebase.firestore().collection("scenes").doc(rawScene.sceneId)
          .onSnapshot((doc) => {
            var populatedScene = _.merge({_id: doc.id}, doc.data());

            //if already in populatedScenes - splice, if not then add
            var popSceneIndex = _.findIndex(state.populatedScenes, function(o) { return o._id == doc.id; });
            if ( popSceneIndex !== -1 ) {
              commit('UPDATE_POPULATED_SCENE_DATA', {splicePosition: popSceneIndex, newVal: populatedScene})
            } else {
              commit('ADD_POPULATED_SCENE_DATA', populatedScene)
            }
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
    },

    getUsersByScene: async function({state, commit, rootState}, scene) {
      //TODO: duplicating data model to include email --> will save a lookup

    }

  },


  //-- STATE AND MUTATORS
  //
  state: {
    user: {},

    rawScenes: [],
    populatedScenes: [],
    // currentScene: {},

    //TODO: need manage large sets of asset data (thumbs need to be released + watchers unsubbed)
    // currentSceneAssets: [],
    // currentUserAssets: [],
    // currentAsset: {},


  },
  mutations: {
    SET_USER_DATA: function(state, val)   { state.user = val; },

    SET_RAW_SCENES_DATA: function(state, val) { state.rawScenes = val; },
    ADD_POPULATED_SCENE_DATA: function(state, val) {
      state.populatedScenes.push(val)
    },
    UPDATE_POPULATED_SCENE_DATA: function(state, {splicePosition, newVal}) {
      state.populatedScenes.splice(splicePosition, 1, newVal)
    },
    REMOVE_POPULATED_SCENE_DATA: function(state, splicePosition) {
      state.populatedScenes.splice(splicePosition, 1)
    },
  }

}
