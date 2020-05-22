import * as firebase from 'firebase';
const firebaseConfig = require('../config.json');

firebase.initializeApp(firebaseConfig);
//Common references
const database = firebase.database();
const config_ref = database.ref("/config");
const users_ref = database.ref("/users");
const log_ref = database.ref("/logs");

export function get_user(userid) {
    return users_ref.orderByChild("hash").equalTo(userid);
}