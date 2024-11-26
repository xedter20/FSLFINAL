import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBNb7RCUrWn3--oS9UQqirjXldvz3dr8FQ',
  authDomain: 'sign-language-app-68ce6.firebaseapp.com',
  projectId: 'sign-language-app-68ce6',
  storageBucket: 'sign-language-app-68ce6.firebasestorage.app',
  messagingSenderId: '452529642919',
  appId: '1:452529642919:web:0db2b3955453c2c1b32a82',
  measurementId: 'G-KTRBT186XC'
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

export { firebase, auth, db };
