import * as firebase from 'firebase';
import * as firebaseConfig from '../config.json';

//Initialise firebase connection
firebase.initializeApp(firebaseConfig);
//Common references
database = firebase.database();
config_ref = database.ref("/config");
users_ref = database.ref("/users");
log_ref = database.ref("/logs");

export function get_active_tokens() {
    return config_ref
        .child("/tokens")
        .orderByChild("Active")
        .equalTo(true)
        .once('value')
        .then(snapshot => (snapshot.exists()) ? Object.keys(snapshot.val()) : []);
}