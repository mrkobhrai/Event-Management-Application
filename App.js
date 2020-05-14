import React from 'react';
import {
  View,
  Text,
  Picker
} from 'react-native';

const firebaseConfig = require('./config.json')


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

firebase.initializeApp(firebaseConfig);
var database = firebase.database();  
var config_ref = database.ref("/config")
var users_ref = database.ref("/users")

async function get_active_tokens() {
  var tokens = [];
  var snapshot = await config_ref.child("/tokens").orderByChild("Active").equalTo(true).once('value');
  if(snapshot.exists()){
    tokens = Object.keys(snapshot.val());
    return tokens;
  }
  return [];
 }

 async function check_token_active(token){
   //Check the token given is active
   //Might be incase someone has cached app and attempts to scan for inactive token
   var snapshot = await config_ref.child("/tokens").child("/"+token+"/Active").once('value');
   if(snapshot.exists()){
     return snapshot.val()
   }
   return false;
 }

 async function check_user_has_token(token, hash){
   //Default code is 2 when no user is found
   //Possible NFC Tampering
   var code = 2;
   await users_ref.orderByChild("hash").equalTo(hash).once('value').then(
     function(super_snap){
       //Take parent snapshot
     if(super_snap.exists()){
       //Check it exists and contains children as a result
       user = super_snap.val()[0];
       if("tokens" in user){
         //Check tokens key is in the user
         if([token] in user["tokens"]){
           //Check the token exists, and if so, get it's value
           if(user["tokens"][token] ){
             //If the user has the token, code is 0 for valid scan
             code = 0;
           } else{
             //If the user doesn't have the token, code is 1 for token used
             code = 1;
           }
         }
       }
     }
   });
   return code;
 }

class TokenSelectionPage extends React.Component {
  constructor(props){
    super(props)
    this.state = ({
      tokens:[],
      scan_type: "",
      attendant: "",
      scan_success : ""
    })
  }
  
  async componentWillMount(){
    const active_tokens = await get_active_tokens();
    this.setState({tokens : active_tokens});
  }

  async scan_token(token, person_hash){
    this.state.scan_success = "";
    doesExist = await check_token_active(token);
    if(doesExist){
      code = await check_user_has_token(token, person_hash);
      if(code == 0){
        this.setState({scan_success:"Scan Successful!"});
      } else if(code==1){
        this.setState({scan_success:"TOKEN ALREADY USED"});
      } else{
        this.setState({scan_success:"User doesn't exist, sent to help desk ASAP"});
      }
    }else{
      this.setState({scan_success:"Inactive token, application restart required"});
    }
  }

  render() {
    var token_buttons = [];
    for(item in this.state.tokens){
      token_buttons.push(<Picker.Item label = { this.state.tokens[item] } value = { this.state.tokens[item] } />)
    }
    return (
      <Container>
        <View>
          <Text>Currently scanning token: { this.state.scan_type }</Text>
          <Text>Currently scanning RFID: { this.state.attendant }</Text>
          <Picker selectedValue = { this.state.scan_type } onValueChange={(value,_index)=> this.setState({scan_type:value})}>
            { token_buttons }
          </Picker>
          <Item>
            <Input
            onChangeText={(attendant) => this.setState({attendant})}
            placeholder="Attendee's RFID"
            />
          </Item>
          <Text>Scan Status: { this.state.scan_success }</Text>
          <Button
            full
            rounded
            primary
            onPress = {()=>this.scan_token(this.state.scan_type, this.state.attendant)}
            ></Button>

        </View> 
      </Container>
    )
  }
}

class LoginPage extends React.Component {
  constructor(props){
    super(props)
    this.state = ({
      email:'',
      password:''
    })
  }

  signUpUser = (email,password) => {
    try{
      if(this.state.password.length<6){
        alert("Passwords must be at least 6 characters in length");
        return;
      }
      firebase.auth().createUserWithEmailAndPassword(email, password);
    }
      catch(error){
        console.log(error.toString());
      }

  }

  loginUser= (email,password) => {
      const { navigate } = this.props.navigation;

      //FOR TESTING:
      navigate('Token_Selection');//Always simulate successful login

      firebase.auth().signInWithEmailAndPassword(email,password
      ).then(
        function(user){
          firebase.database().ref("/users/").orderByChild("hash").equalTo("my_hash").once('value',function(snapshot){
            //console.log(snapshot.val());
          })
          
          navigate('Token_Selection');
        }
      ).catch(
        function(error){
          alert(error.toString());
        });
        
  }

  render() {
    return (
      <Container>
        <Form>
          <Item>
          <Input
          onChangeText={(email) => this.setState({email})}
          placeholder="Email"
          />
          </Item>
          <Item>
          <Input
          onChangeText={(password) => this.setState({password})}
          placeholder="Password"
          />
          </Item>
          <Button
            full
            rounded
            success
            onPress = {() => this.loginUser(this.state.email, this.state.password)}
            >
          <Text> Login </Text>
          </Button>

          <Button
            full
            rounded
            primary
            onPress = {()=>this.signUpUser(this.state.email, this.state.password)}
            >
          <Text> Signup </Text>
          </Button>
        </Form>
      </Container>
      )
  }
}


const AppNavigator = createStackNavigator(
    {
        Login: LoginPage,
        Token_Selection: TokenSelectionPage
    },
    {
        initialRouteName: "Login"
    }
);

const AppContainer = createAppContainer(AppNavigator);
export default class App extends React.Component {
  render(){
    return <AppContainer />;
  }
}
