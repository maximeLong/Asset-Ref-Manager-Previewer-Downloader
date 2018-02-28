import firebase from '@firebase/app';
import '@firebase/firestore'
import '@firebase/auth'

export const initFirebase = (store)=> {

  //begin firebase --> triggered by store plugin
  firebase.initializeApp({
    apiKey: "AIzaSyCk02gfvp5ZZIamkip3cNibXo9fNNNjd3k",
    authDomain: "depthcast-188705.firebaseapp.com",
    databaseURL: "https://depthcast-188705.firebaseio.com",
    projectId: "depthcast-188705",
    storageBucket: "depthcast-188705.appspot.com",
    messagingSenderId: "223278791727"
  });

  firebase.firestore()
  //reference current firebase/firestore by importing firebase to other files

}
