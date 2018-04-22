import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyCHtzTb8Fmgy1tu3tQ2ghmaTH_1lhgr6s4",
  authDomain: "rcv-sim.firebaseapp.com",
  databaseURL: "https://rcv-sim.firebaseio.com",
  projectId: "rcv-sim",
  storageBucket: "rcv-sim.appspot.com",
  messagingSenderId: "710177801325"
};

firebase.initializeApp(config);

export const googleAuth = new firebase.auth.GoogleAuthProvider();
export const database = firebase.database();
export const auth = firebase.auth();