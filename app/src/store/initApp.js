import firebase from '@firebase/app';
import '@firebase/firestore'
import '@firebase/auth'

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

  //initialize auth watcher > kicks off appLoad on auth
  store.dispatch('firebaseStore/watchAuthChange');

}
