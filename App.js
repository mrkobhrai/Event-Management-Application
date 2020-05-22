//Imports
import React from 'react';
import {
  View,
  Text,
  Picker,
  TouchableOpacity
} from 'react-native';

import NfcManager, { NfcEvents, Ndef } from 'react-native-nfc-manager';

import {
  Container,
  Content,
  Header,
  Form,
  Input,
  Item,
  Button,
  Label
} from 'native-base';

import * as firebase from 'firebase';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import { get_active_tokens, check_token_active } from "./lib/tokenHandler"

//Import API Keys
const firebaseConfig = require('./config.json');
import ETokenStatus from "./lib/ETokenStatus";


//Initialise firebase connection
firebase.initializeApp(firebaseConfig);
//Common references
database = firebase.database();
config_ref = database.ref("/config");
users_ref = database.ref("/users");
log_ref = database.ref("/logs");

import { get_user } from "./lib/dbHandler";

//Async fetch function
//Checks if user has the token
async function scan_token(token, userid) {
  return get_user(userid).once('value').then(parent_snapshot => {
    if (!parent_snapshot.exists()) return ETokenStatus.UserNotFound;
    let user = super_snap.val()[0];
    if (!("tokens" in user)) return ETokenStatus.UserNotFound;

    if (!([token] in user.tokens)) {
      log_action({ "Action": "Scanned Token", "Token": token, "Person": user["name"], "Success": false, "Failure": "Token doesn't exist" });
      return ETokenStatus.UserNotFound;
    }

    if (user.tokens[token] == null) {
      log_action({ "Action": "Scanned Token", "Token": token, "Person": user["name"], "Success": false, "Failure": "User does not have token" });
      return ETokenStatus.TokenAlreadyUsed;
    }

    set_token_as_used(token, hash);
    log_action({ "Action": "Scanned Token", "Token": token, "Person": user["name"], "Success": true });
    return ETokenStatus.ValidScan;
  });
}


//Sets the token for the user as used
function set_token_as_used(token, userid) {
  get_user(userid).once("child_added", function (snapshot) {
    snapshot.ref.child("tokens").update({ [token]: false });

  })
}

function log_action(log) {
  log["Timestamp"] = new Date().toLocaleString();
  log_ref.push(log);
}

class TokenSelectionPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = ({
      tokens: [],
      scan_type: "",
      attendant: "",
      scan_success: ""
    })
  }

  componentDidMount() {
    NfcManager.start();
    try {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
        ndef_payload = Ndef.text.decodePayload(tag.ndefMessage[0].payload);
        this.setState({ attendant: ndef_payload });
        this.try_scan_token(this.state.scan_type, this.state.attendant);
        NfcManager.unregisterTagEvent().catch(() => 0);
      });
    } catch (error) {
      alert(error);
    }

  }

  async componentWillMount() {
    const active_tokens = await get_active_tokens();
    this.setState({ tokens: active_tokens });
    if (active_tokens.length > 0) {
      this.setState({ scan_type: active_tokens[0] });
    }

  }

  componentWillUnmount() {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    NfcManager.unregisterTagEvent().catch(() => 0);
  }

  _cancel = () => {
    NfcManager.unregisterTagEvent().catch(() => 0);
  }



  _test = async () => {
    try {
      await NfcManager.registerTagEvent();
    } catch (ex) {
      console.warn('ex', ex);
      NfcManager.unregisterTagEvent().catch(() => 0);
    }
  }

  try_scan_token(token, person_hash) {
    this.state.scan_success = "";
    return check_token_active().then(async (doesExist) => {
      if (!doesExist) {
        this.setState({ scan_success: "Inactive token, application restart required" });
        alert("Token is now inactive. Reloading page");
        componentWillMount();
        return;
      }

      // Avoiding to go into callback hell by using await here
      let statusCode = await scan_token(token, person_hash);
      switch (statusCode) {
        case ETokenStatus.ValidScan:
          this.setState({ scan_success: "Scan Successful!" });
        case ETokenStatus.TokenAlreadyUsed:
          this.setState({ scan_success: "TOKEN ALREADY USED" });
          alert("This token has already been scanned!");
        default:
          this.setState({ scan_success: "User doesn't exist, sent to help desk ASAP" });
          alert("This user doesn't exist! Seek assistance");
      }
    });
  }

  render() {
    var token_buttons = [];
    const { navigate } = this.props.navigation;
    for (item in this.state.tokens) {
      token_buttons.push(<Picker.Item label={this.state.tokens[item]} value={this.state.tokens[item]} />)
    }
    return (
      <Container>
        <View>
          <Text>Currently scanning token: {this.state.scan_type}</Text>
          <Picker selectedValue={this.state.scan_type} onValueChange={(value, _index) => this.setState({ scan_type: value })}>
            {token_buttons}
          </Picker>
          <Item>
            <Text> Person Hash: {this.state.attendant}</Text>
          </Item>
          <Text>Scan Status: {this.state.scan_success}</Text>
          <Button
            full
            rounded
            primary
            onPress={this._test} >
            <Text>Scan NFC</Text>
          </Button>
        </View>
      </Container>
    )
  }
}

class LoginPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = ({
      email: '',
      password: ''
    })
  }



  signUpUser = (email, password) => {
    try {
      if (this.state.password.length < 6) {
        alert("Passwords must be at least 6 characters in length");
        return;
      }
      firebase.auth().createUserWithEmailAndPassword(email, password);
    }
    catch (error) {
      console.log(error.toString());
    }

  }

  loginUser = (email, password) => {
    const { navigate } = this.props.navigation;
    firebase.auth().signInWithEmailAndPassword(email, password
    ).then(
      function (user) {
        firebase.database().ref("/users/").orderByChild("hash").equalTo("my_hash").once('value', function (snapshot) {
        })
        log_action({ "Attempted Login": email, "Successful": true });
        navigate('Scan Tags');
      }
    ).catch(
      function (error) {
        alert(error.toString());
        log_action({ "Attempted Login": email, "Successful": false, "Error": error });
      });

  }

  render() {
    return (
      <Container>
        <Form>
          <Item>
            <Input
              onChangeText={(email) => this.setState({ email })}
              placeholder="Email"
            />
          </Item>
          <Item>
            <Input
              secureTextEntry={true}
              onChangeText={(password) => this.setState({ password })}
              placeholder="Password"
            />
          </Item>

          <Button
            full
            rounded
            success
            onPress={() => this.loginUser(this.state.email, this.state.password)}
          >
            <Text> Login </Text>
          </Button>
        </Form>
      </Container>
    )
  }
}


const AppNavigator = createStackNavigator(
  {
    Login: LoginPage,
    'Scan Tags': TokenSelectionPage,
  },
  {
    initialRouteName: "Login"
  }
);

const AppContainer = createAppContainer(AppNavigator);
export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
