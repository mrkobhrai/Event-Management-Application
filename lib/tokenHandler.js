import * as firebase from 'firebase';
import * as firebaseConfig from '../config.json';

//Initialise firebase connection
firebase.initializeApp(firebaseConfig);
//Common references
database = firebase.database();
config_ref = database.ref("/config");
users_ref = database.ref("/users");
log_ref = database.ref("/logs");