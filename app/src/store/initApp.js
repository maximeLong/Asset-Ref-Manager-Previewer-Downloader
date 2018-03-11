import firebase from '@firebase/app';
import '@firebase/firestore'
import '@firebase/auth'
import '@firebase/storage'

export const initApp = (store)=> {

  //begin firebase --> triggered by store plugin
  firebase.initializeApp({
    apiKey: "AIzaSyCk02gfvp5ZZIamkip3cNibXo9fNNNjd3k",
    authDomain: "depthcast-188705.firebaseapp.com",
    databaseURL: "https://depthcast-188705.firebaseio.com",
    projectId: "depthcast-188705",
    storageBucket: "depthcast-188705.appspot.com",
    messagingSenderId: "223278791727"
  });
  firebase.firestore();  //can reference current firestore through import


  //set up collection + refs
  this.firestore = firebase.firestore();
  this.auth = firebase.auth();
  this.storage = firebase.storage();

  this.usersCollection = firebase.firestore().collection('users');
  this.scenesCollection = firebase.firestore().collection('scenes');
  this.assetsCollection = firebase.firestore().collection('assets');
  this.scenesLinkAssetsCollection = firebase.firestore().collection('scenes_link_assets');
  this.scenesLinkUsersCollection = firebase.firestore().collection('scenes_link_users');

  //initialize auth watcher > kicks off appLoad on auth
  store.dispatch('firebaseStore/watchAuthChange');

}
