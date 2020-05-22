# Event Management App
The purpose of this app is to allow tokens to be managed digitally during an event.
The initial plan is to allow 'hashes' to be scanned from an NFC which will related to a token
Stored in a database

 ## Database
 This application has the backend on a Firebase Realtime Database which it accesses through an API.
 The API key should be stored in the root of the repository as 'config.json'.
 To generate the database json structure, under ./SETUP/generate_token_base, find:
 * generate_tokens.py  
 This python script generates 'database.json'
 This can be imported directory into a Firebase Realtime Database to give the required database structure
 More information on this can be found in 'README.txt' under /SETUP.

 ## System Environment


 ### MacOS
 Ensure these are installed:
 - Cocoapods (install using gem)


 Run the following commands in terminal:
 ~~~
 cd ios
 pod install
 ~~~
 (If it says 'no podfile', try 'pod init' then 'pod install')
 Then run:
 'cd ..'
 To go back to the repo root directory

 ### Universal Setup
 Ensure these commands are installed:
 - yarn
 - node.js
 - Homebrew

 It might be worth installing react-native-cli globally through npm

 -'npm install –g react-native-cli'

 Run the command:
 - 'yarn add'  

 To install all dependencies via yarn.
 If you get 'unrecognized command' or equivalent error, then try:
 - 'npx yarn add'

 ## Dependencies
 These should be installed via 'yarn add' command
 Node Modules:
 - native-base
 - react-native
 - firebase
 - @react-navigation/stack
 - @react-native-community/masked-view
 - react-native-safe-area-context
 - react-navigation-stack
 - react-native-screens
 - react-native-nfc-manager

 ## Running it on emulators
 ### Android
 npx react-native run-android

 ### iOS
 ONLY WORKS ON MacOS:  
 npx react-native run-android

## Running it on devices
### iOS
Note! This has to be done on a MacOS System.
- Ensure XCode and Command Line Tools are installed!
- Open './ios/firstApp.xcworkspace'
- Add the NFC Capability (Requires apple developer license)
- Plug in iPhone, select this device as output in XCode
- Build (This may take ages)
- App should be installed
- (If app won't open due to untrusted developer error, go to general->device management -> (developer team) -> trust)
- Open app, should then compile javascript bundle and provide login page

 ## Author(s)
 Karan Obhrai

 ### README Last Updated
 22/5/2020
