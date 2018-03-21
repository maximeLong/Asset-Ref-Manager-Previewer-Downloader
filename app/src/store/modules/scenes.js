//firebase hooks
import { firestore, scenesCollection, scenesLinkUsersCollection } from '../plugins/initApp'
import router from '../../router'


export const scenes = {
  namespaced: true, //access actions with 'scenes/whatever'

  actions: {
    //subscribe to scene_user docs
    getScenesByUser: function(store, uid) {
      return new Promise((resolve, reject) => {
        var initialPromiseCall = true; // toggle for entry code (resolve()) and continous code on snapshot updates

        scenesLinkUsersCollection.where("userId", "==", uid)
        .onSnapshot((snapshot) => {

          //resolve immediately if initial promise and no scenes
          if (!snapshot.docs.length && initialPromiseCall) {
            resolve()
            initialPromiseCall = false;
          } else {

            //populate based on added change type
            snapshot.docChanges.forEach((change)=> {
              if (change.type == 'added') {
                var sceneData = _.merge({_id: change.doc.id}, change.doc.data())
                store.dispatch('populateScene', sceneData)
                .then((success)=> {
                  resolve()
                  initialPromiseCall = false;
                })
              }
            })

          }

        }, (error)=> {
          reject(error)
        });
      });
    },


    populateScene: function({state, commit}, scene) {
      return new Promise((resolve, reject) => {

        //populate scene on added -- scene will update/remove itself through its created snapshot subscriber
        var unsubscribe = scenesCollection.doc(scene.sceneId)
        .onSnapshot((doc) => {
          if (doc.exists) {
            var populatedScene = _.merge({_id: doc.id, admin: scene.admin}, doc.data());

            //once added popSceneIndex will exist > fire update, else > add to populated scene
            var popSceneIndex = _.findIndex(state.populatedScenes, function(o) { return o._id == doc.id; });
            if ( popSceneIndex !== -1 ) {
              commit('UPDATE_POPULATED_SCENE_DATA', {splicePosition: popSceneIndex, newVal: populatedScene})
            } else {
              commit('ADD_POPULATED_SCENE_DATA', populatedScene)
            }
            //resolve on initial added
            resolve()

          } else {
            //remove populated scene if deleted
            var removedSceneIndex = _.findIndex(state.populatedScenes, function(o) { return o._id == doc.id });
            commit('REMOVE_POPULATED_SCENE_DATA', removedSceneIndex)
            unsubscribe() //unsubs from listener
          }
        })

      })
    },

    getUsersByScene: function(store, sceneId) {
      //NOTE: duplicating data model to include email --> will save a populate but can't change email
      //TODO: unsubscribe on scene change
      //BUG:  signOut() fires onSnapshot and returns error (bcuz no auth, bcuz ???)
      scenesLinkUsersCollection.where("sceneId", "==", sceneId)
      .onSnapshot((snapshot) => {
        var usersInScene = [];
        snapshot.forEach((doc) => {
          usersInScene.push(_.merge({_id: doc.id}, doc.data()) )
        });
        store.commit('SET_USERS_IN_CURRENT_SCENE_DATA', usersInScene)
      }, (error)=> {
        //console.log(error)
      });
    },

    createScene: function(store, sceneData) {
      return new Promise((resolve, reject) => {
        //create the sceneId + batch request
        var sceneRef = scenesCollection.doc();
        var batch = firestore.batch()

        batch.set(sceneRef, sceneData);
        batch.set(scenesLinkUsersCollection.doc(sceneRef.id + '_' + store.state.user.uid), {
          sceneId: sceneRef.id,
          userId: store.state.user.uid,
          userEmail: store.state.user.email, //NOTE: duplicate in data model
          admin: true
        })
        batch.commit().then((success)=> { resolve() })
      })
    },

    patchSceneInfo: function(store, {sceneId, patchedData}) {
      return new Promise((resolve, reject) => {
        scenesCollection.doc(sceneId).update(patchedData)
          .then((success)=> resolve() )
          .catch((error)=> reject(error) )
      })
    },

    deleteScene: function(store, sceneId) {
      return new Promise((resolve, reject) => {
        var batch = firestore.batch()

        scenesLinkUsersCollection.where('sceneId', '==', sceneId).get()
          .then((querySnapshot)=> {
            //delete all scenes_link_users docs with sceneId
            //NOTE: permissions need to thought out
            querySnapshot.forEach((doc)=> { batch.delete(doc.ref) })
            //delete current scene
            batch.delete(scenesCollection.doc(sceneId))

            batch.commit()
              .then((success)=> resolve() )
              .catch((error)=> reject(error) )
          })
      })
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
    populatedScenes: [],
    currentSceneIndex: 0,
    usersInCurrentScene: [],
  },
  mutations: {
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
    SET_USERS_IN_CURRENT_SCENE_DATA: function(state, val) { state.usersInCurrentScene = val },
  }
}
