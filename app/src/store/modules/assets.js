//firebase hooks
import firebase from '@firebase/app';
import { firestore, storage, assetsCollection, scenesLinkAssetsCollection } from '../plugins/initApp'


export const assets = {
  namespaced: true, //access actions with 'assets/whatever'

  actions: {

    createAsset: function(store, {assetData, assetFile}) {
      //NOTE: duplicating data model to include name/image --> will save a populate but can't change values
      //send file to cloud storage
      var storageRef = storage.ref();
      var uploadTask = storageRef.child('gltf/' + assetData.name + '.glb').put(assetFile);

      console.log(store)

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
        batch.set(scenesLinkAssetsCollection.doc(store.rootGetters['scenes/currentScene']._id + '_' + assetRef.id), {
          sceneId: store.rootGetters['scenes/currentScene']._id,
          assetId: assetRef.id,
          assetThumbnailImage: assetData.thumbnailImage, //NOTE: duplicate in data model
          assetName: assetData.name //NOTE: duplicate in data model
        })
        batch.commit().then((success)=> {
          store.commit('ux/SET_ASSET_STANDIN', false, {root: true});
          console.log('asset completed')
        })
      });

      //close the modal before response is done
      store.commit('ux/SET_ASSET_IMPORT_MODAL', {isOpen: false}, {root: true});
      store.commit('ux/SET_ASSET_STANDIN', true, {root: true});
    },

    getAssetsByScene: function(store, sceneId) {
      //TODO: unsubscribe on scene change
      scenesLinkAssetsCollection.where("sceneId", "==", sceneId)
      .onSnapshot((snapshot) => {
        var assetsInScene = [];
        snapshot.forEach((doc) => {
          assetsInScene.push(_.merge({_id: doc.id}, doc.data()) )
        });
        store.commit('SET_ASSETS_IN_CURRENT_SCENE_DATA', assetsInScene)
      }, (error)=> {
        console.log(error)
      });
    },

    getAssetsByUser: function(store, uid) {
      //TODO: unsubscribe on logout
      assetsCollection.where("creator", "==", uid)
      .onSnapshot((snapshot) => {
        var assetsByUser = [];
        snapshot.forEach((doc) => {
          assetsByUser.push(_.merge({_id: doc.id}, doc.data()) )
        });
        store.commit('SET_ASSETS_BY_CURRENT_USER_DATA', assetsByUser)
      }, (error)=> {
        console.log(error)
      });
    },

    removeAssetsByScene: function(store, multiSelectList) {
      return new Promise((resolve, reject) => {
        var batch = firestore.batch()

        multiSelectList.forEach((link)=> {
          batch.delete(scenesLinkAssetsCollection.doc(link.original._id))
        })
        batch.commit()
          .then((success)=> resolve() )
          .catch((error)=> reject(error) )
      })
    },
    addAssetsToScene: function(store, multiSelectList) {
      return new Promise((resolve, reject) => {
        var batch = firestore.batch()

        multiSelectList.forEach((asset)=> {
          batch.set(scenesLinkAssetsCollection.doc(store.rootGetters['scenes/currentScene']._id + '_' + asset.original._id), {
            sceneId: store.rootGetters['scenes/currentScene']._id,
            assetId: asset.original._id,
            assetThumbnailImage: asset.original.thumbnailImage, //NOTE: duplicate in data model
            assetName: asset.original.name //NOTE: duplicate in data model
          })
        })
        batch.commit()
          .then((success)=> resolve() )
          .catch((error)=> reject(error) )
      })
    },

    getAsset: function(store, assetId) {
      return new Promise((resolve, reject) => {
        assetsCollection.doc(assetId).get()
          .then((doc)=> {
            if (doc.exists) {
              store.commit('SET_CURRENT_ASSET', _.merge({_id: doc.id}, doc.data()) );
              resolve()
            } else {
              console.log({message: 'no asset info -- this is bad'})
              reject()
            }
          }).catch((error)=> { console.log(error) })
      })
    },

    deleteAsset: function(store, assetId) {
      return new Promise((resolve, reject) => {
        var batch = firestore.batch()

        scenesLinkAssetsCollection.where('assetId', '==', assetId).get()
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

  //-- STATE AND MUTATORS
  //
  state: {
    assetsInCurrentScene: [],
    assetsByCurrentUser: [],
    currentAsset: {},
  },
  mutations: {
    SET_ASSETS_IN_CURRENT_SCENE_DATA: function(state, val) { state.assetsInCurrentScene = val },
    SET_ASSETS_BY_CURRENT_USER_DATA: function(state, val) { state.assetsByCurrentUser = val },
    SET_CURRENT_ASSET: function(state, val) { state.currentAsset = val },
  }

}
