import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAln9KogkLpr_eMbBLlnQfMae7Ji380phQ',
  authDomain: 'avdeasis-4b5c7.firebaseapp.com',
  projectId: 'avdeasis-4b5c7',
  storageBucket: 'avdeasis-4b5c7.appspot.com',
  messagingSenderId: '563212793374',
  appId: '1:563212793374:web:4a5f5dd187e0304661a00f',
  measurementId: 'G-5LTWLEWR22'
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

export { firebase, auth, db };
