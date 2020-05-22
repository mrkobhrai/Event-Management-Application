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

//Async fetch function
//Checks token is active in case user hasn't update selection
export function check_token_active(token) {
    //Check the token given is active
    //Might be incase someone has cached app and attempts to scan for inactive token
    return config_ref
        .child("/tokens")
        .child("/" + token + "/Active")
        .once('value')
        .then(snapshot => (snapshot.exists()) ? snapshot.val() : false);
}