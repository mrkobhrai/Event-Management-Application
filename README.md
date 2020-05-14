# Event Management App
The purpose of this app is to allow tokens to be managed digitally during an event.
The initial plan is to allow 'hashes' to be scanned from an NFC which will related to a token
Stored in a database

 ## Dependencies
 yarn add native-base
 yarn add react-native
 yarn add firebase
 yarn add @react-navigation/stack
 yarn add @react-native-community/masked-view
 yarn add react-native-safe-area-context
 yarn add react-navigation-stack
 yarn add react-native-screens
 
 ## Database
 Note that config.json found in the root directory of this repo has been left out.
 This is because it contains an API key.
 To run this project, set up your own database on firebase.
 A script can be found in ./SETUP which will generate a JSON object which you can import.
 Then create a config.json in this folder with your own API keys.
 
 ## Running it on emulators
 ### Android
 npx react-native run-android

 ### IOS
 Port over to Expo
 Then run yarn ios
 Then scan on IOS
 
 ## Author(s)
 Karan Obhrai
 
 ### README Last Updated
 14/5/2020 
