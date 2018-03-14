//firebase store
import firebase from '@firebase/app';
import { firestore, auth, storage, usersCollection, scenesCollection, assetsCollection, scenesLinkAssetsCollection, scenesLinkUsersCollection} from './initApp'

import router from '../router'
import _ from 'lodash'
import md5 from 'md5'


export const firebaseStore = {
  namespaced: true, //access actions with 'firebase/whatever'

  actions: {

    signIn: function(store, {email, password}) {
      auth.signInWithEmailAndPassword(email, password)
        .then((success)=> {
          console.log('signed in... watchAuth should fire..')
          store.commit('SET_USER_PANEL', {open: false}, {root : true})
        })
        .catch((error)=>  { console.log(error) });
    },

    signOut: function(store) {
      auth.signOut()
        .then((success)=> {
          console.log('signed out')
          //TODO: this should unsubscribe all snapShots in memory
          store.commit('SET_USER_PANEL', {open: false}, {root : true})
          store.commit('SET_POPULATED_SCENES_DATA', [])
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
      store.dispatch('getScenesByUser', uid)
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
    },

    createAsset: function(store, {assetData, assetFile}) {
      //send file to cloud storage
      var storageRef = storage.ref();
      var uploadTask = storageRef.child('gltf/' + assetData.name + '.glb').put(assetFile);

      uploadTask.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
          }
      }, function(error) {  //error
        console.log(error)
      }, function() {       //success

        //get the downloadURL and add it to assetData
        var downloadURL = uploadTask.snapshot.downloadURL;
        assetData.assetUrl = downloadURL;

        // then batch request the asset model & scenesLinkAssets model
        var assetRef = assetsCollection.doc();
        var batch = firestore.batch();
        batch.set(assetRef, assetData);
        batch.set(scenesLinkAssetsCollection.doc(store.getters['currentScene']._id + '_' + assetRef.id), {
          sceneId: store.getters['currentScene']._id,
          assetId: assetRef.id,
          assetThumbnailImage: assetData.thumbnailImage, //NOTE: duplicate in data model
          assetName: assetData.name //NOTE: duplicate in data model
        })
        batch.commit().then((success)=> {
          store.commit('SET_ASSET_STANDIN', false, {root: true});
          console.log('asset completed')
        })
      });

      //close the modal before response is done
      store.commit('SET_ASSET_IMPORT_MODAL_IS_OPEN', false, {root: true});
      store.commit('SET_ASSET_STANDIN', true, {root: true});
    },

    getAssetsByScene: function(store, sceneId) {
      //NOTE: duplicating data model to include name/image --> will save a populate but can't change values
      //TODO: unsubscribe on scene change
      //BUG:  signOut() fires onSnapshot and returns error (bcuz no auth, bcuz ???)
      scenesLinkAssetsCollection.where("sceneId", "==", sceneId)
      .onSnapshot((snapshot) => {
        var assetsInScene = [];
        snapshot.forEach((doc) => {
          assetsInScene.push(_.merge({_id: doc.id}, doc.data()) )
        });
        store.commit('SET_ASSETS_IN_CURRENT_SCENE_DATA', assetsInScene)
      }, (error)=> {
        //console.log(error)
      });
    },

    getAsset: function(store, assetId) {
      return new Promise((resolve, reject) => {
        assetsCollection.doc(assetId).get()
          .then((doc)=> {
            if (doc.exists) {
              store.commit('SET_CURRENT_ASSET', doc.data());
              resolve()
            } else {
              console.log({message: 'no asset info -- this is bad'})
              reject()
            }
          }).catch((error)=> { console.log(error) })
      })
    },

    deleteAsset: function(store, {sceneId, assetId}) {
      return new Promise((resolve, reject) => {
        var batch = firestore.batch()

        scenesLinkAssetsCollection.where('sceneId', '==', sceneId).get()
          .then((querySnapshot)=> {
            //delete all scenes_link_assets docs with sceneId
            //NOTE: permissions need to thought out
            querySnapshot.forEach((doc)=> { batch.delete(doc.ref) })
            //delete current assets
            batch.delete(assetsCollection.doc(assetId))

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
    user: null,

    populatedScenes: [],

    currentSceneIndex: 0,
    usersInCurrentScene: [],

    assetsInCurrentScene: [],
    currentAsset: {}

    //TODO: need manage large sets of asset data (thumbs need to be released + watchers unsubbed)
    // currentSceneAssets: [],
    // currentUserAssets: [],
    // currentAsset: {},
  },

  mutations: {
    SET_USER_DATA: function(state, val)   { state.user = val; },

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

    SET_ASSETS_IN_CURRENT_SCENE_DATA: function(state, val) { state.assetsInCurrentScene = val },
    SET_CURRENT_ASSET: function(state, val) { state.currentAsset = val }

  }

}
