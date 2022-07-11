
import React, { Component } from 'react';
import {
Text,
Dimensions,
Alert,
ActivityIndicator,
ImageBackground,
StyleSheet,
Image,
TouchableOpacity,
SafeAreaView,
TouchableWithoutFeedback,

Button,
AsyncStorage,
View,
Keyboard,
} from 'react-native';
import {TextInput} from "react-native-paper"
const Constants = require('../components1/Constants');
import DropDownPicker from 'react-native-dropdown-picker';
import CommonDataManager from './CommonDataManager';
let commonData = CommonDataManager.getInstance();
import Icon from 'react-native-vector-icons/Ionicons';
// let commonData = CommonDataManager.getInstance();
// import CommonDataManager from './CommonDataManager';

// const GET_DATAURL = 'https://csardent.com/primeorder/get_data_crm.php';
// const GET_DATAURL='https://primesophic.com/SalesAltum/log_in_crm.php'

import LinearGradient from 'react-native-linear-gradient';
const { height } = Dimensions.get('window');
const { width } = Dimensions.get('screen');
var RNFS = require('react-native-fs');
var storepath = RNFS.DocumentDirectoryPath + '/storesOffline.json';
class LoginScreen extends Component {
constructor(props) {
super(props);

// this.textHandler = this.textHandler.bind(this);
this.LoginButtonClick = this.LoginButtonClick.bind(this);

this.state = {
username: '',
type:'',
password: '',
isLoading: false,
responseCount: '',
error: '',
};
this.textInput='';
this.textInputPassword='';
}


componentWillMount(){
this.setState({
username:'',
})
}
async getSession(){
 var sessionid = await AsyncStorage.getItem('sessionid')
 var user_id=await AsyncStorage.getItem('userid')
 var uname= await AsyncStorage.getItem('Username')
 commonData.setusername(uname)
 commonData.setsessionId(sessionid)
 commonData.setUserid(user_id)
}

// async LoginButtonClick() {

// if(this.state.username.length==0 || this.state.password.length==0){
// this.setState({error:'Field cannot be blank'})
// return;
// }
// var that = this;
// //New Implementation 
// //Date : 19 April 2021
// //Written By Sonia
// if(that.state.type=='customer'){
//   that.setState({isloading:false});
//   commonData.setLoginType('customer');
//   that.props.navigation.navigate("SyncScreen") 
// }
// //______________________________________________
// that.state.isLoading=true;

// console.log("po_user.username = '" + that.state.username + "' AND po_user.username = '" + that.state.password + "'")
// const FETCH_TIMEOUT = 5000;
// let didTimeOut = false;
// that.setState({
// isloading: true,
// });
// const GET_DATAURL =Constants.LOGIN_URL
// var uname=that.state.username
// var pname=that.state.password
// new Promise(function (resolve, reject) {
// const timeout = setTimeout(function () {
// didTimeOut = true;
// reject(new Error('Request timed out'));
// Alert.alert('Error', 'Coudnt Reach the Server,Try again later');
// that.setState({isLoading:false})
// }, FETCH_TIMEOUT);

// fetch(GET_DATAURL, {
// method: 'POST',
// body: JSON.stringify({
//   "__module_code__":"PO_12",
//   "__uname__":uname,      
//   "__pass__":pname,
//   "__type__":0
//   }),
// })
// .then(response => response.json())
// .then( (response) => {
//   that.setState({isloading:false})
//   console.log('result is', response.ErrorCode);
//   console.log('result is', response.name)
//   console.log('result is', response.token)
//   clearTimeout(timeout);
//   if (!didTimeOut) {
//   if(response.name=='undefined'||response.name==undefined){
   
//     var sessionid=response.id;
//     var user_id=response.name_value_list.user_id.value
//     AsyncStorage.setItem('isLogin', 'true');
//     AsyncStorage.setItem('Username', that.state.username)
//     AsyncStorage.setItem('sessionid', sessionid)
//     AsyncStorage.setItem('userid',user_id)
    
//     that.setState({
// error: '',
// isLoading:false,
// username:'',
// password:''
// });
// that.props.navigation.navigate("SyncScreen")
// that.getSession();
//   }
      
//   else{
//       that.setState({
//     error: 'Invalid Credentials',
//     });
//     that.setState({
//       isLoading:false,
//       username:'',
//       password:''
//       });

//       }
//     }
//       response=''

// })
// .then(function () {


// })
// .catch(function (err) {
// console.log(err);
// });
// });
// }
readstoreDetails(){
  
  console.log("writting to store json file.......................")

    RNFS.readFile(storepath, 'utf8')
    .then((contents) => {
      let tempArray = commonData.gettypeArray(contents,'PO_01');
     commonData.setstoresArray(tempArray)
    })
    .catch((err) => {
      console.log(err.message, err.code);
    });
  
}


 
storedis=()=>{
  var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"__module_code__":"PO_12","__query__":"po_ordousers.username='"+this.state.username+"'","__orderby__":"","__offset__":0,"__select _fields__":[""],"__max_result__":1,"__delete__":0});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch(Constants.TYPE_DATA_URL, requestOptions)
  .then(response => response.json())
  .then(result => {
    console.log(result.relationship_list[0].link_list[0].records,"fdgfdgfddfgddfgdgf")
    var json = JSON.stringify(result.relationship_list[0].link_list[0].records);
    console.log(json, "this is for orders list array")
    let tempArray = commonData.gettypeArray(json,'PO_12');
    commonData.setstoresArray(tempArray);
    RNFS.writeFile(storepath, json, 'utf8')
    
.then((success) => {
  console.log('FILE WRITTEN!');
})
.catch((err) => {
  console.log(err.message);
});
    
    
  })
  .catch(error => console.log('error', error));
}
async LoginButtonClick() {
  this.storedis();
  if(this.state.username.length==0 || this.state.password.length==0){
  this.setState({error:'Field cannot be blank'})
  return;
  }
  var that = this;
  let type=99;
  //New Implementation 
  //Date : 19 April 2021
  //Written By Sonia
  // if(that.state.type=='customer'){
  //   that.setState({isloading:false});
  //   commonData.setLoginType('customer');
  //   that.props.navigation.navigate("SyncScreen") 
  // }
  if(that.state.type=='0'){
    type=0;
  }else if(that.state.type=='1'){
    type=1;
  }else if(that.state.type=='2'){
    type=2;
  }else if(that.state.type=='3'){
    type=3;
  }else if(that.state.type=='4'){
    type=4;
  }
  //______________________________________________
  that.state.isLoading=true;
  
  console.log("po_user.username = '" + that.state.username + "' AND po_user.username = '" + that.state.password + "'")
  const FETCH_TIMEOUT = 5000;
  let didTimeOut = false;
  that.setState({
  isloading: true,
  });
  const GET_DATAURL =Constants.LOGIN_URL
  var uname=that.state.username
  var pname=that.state.password
  new Promise(function (resolve, reject) {
  const timeout = setTimeout(function () {
  didTimeOut = true;
  reject(new Error('Request timed out'));
  Alert.alert('Error', 'Coudnt Reach the Server,Try again later');
  that.setState({isLoading:false})
  }, FETCH_TIMEOUT);
  
  fetch(GET_DATAURL, {
  method: 'POST',
  body: JSON.stringify({
    "__module_code__":"PO_12",
    "__uname__":uname,      
    "__pass__":pname
    }),
  })
  .then(response => response.json())
  .then( (response) => {
    that.setState({isloading:false})
    console.log('result is', response.ErrorCode);
    console.log('result is', response.name)
    console.log('result is', response.token)
    console.log('result is', response)
    clearTimeout(timeout);
    if (!didTimeOut) {
    if(response.ErrorCode=='200'){
     
      var sessionid=response.token;
      var user_id=response.name
      var uid=response.id;
      commonData.setuid(uid);
      AsyncStorage.setItem('isLogin', 'true');
      AsyncStorage.setItem('Username', that.state.username)
      AsyncStorage.setItem('sessionid', sessionid)
      AsyncStorage.setItem('ordoid', uid)
      AsyncStorage.setItem('userid',uid)
      AsyncStorage.setItem('type',response.type)
      commonData.setUserID(uid)
      that.setState({
  error: '',
  isLoading:false,
  username:'',
  password:''
  });
  if(response.type==4)
  that.props.navigation.navigate("DeliveryMain")
  else
  that.props.navigation.navigate("SyncScreen")
  that.getSession();
    }
        
    else{
        that.setState({
      error: 'Invalid Credentials',
      });
      that.setState({
        isLoading:false,
        username:'',
        password:''
        });
  
        }
      }
        response=''
  
  })
  .then(function () {
  
  
  })
  .catch(function (err) {
  console.log(err);
  });
  });
  }
  

performTimeConsumingTask = async () => {
return new Promise((resolve) =>
setTimeout(
() => { resolve('result') },
5000
)
);

}

async componentDidMount() {
const data = await this.performTimeConsumingTask();
if (data !== null) {
this.setState({ isLoading: false });
}
}


componentDidMount(){
this.setState({
username:''
})
}
changedPasswordValue=(text)=>{
  this.setState({
  password:text,
  error:''
  })
  if(text.length==0){
  this.setState({
  error:text
  })
  }
  }

changedValue=(text)=>{
this.setState({
username:text,
error:''
})
if(text.length==0){
this.setState({
error:text
})
}
}
render() {


if (this.state.isLoading) {
return (
<View
style={{
flex: 1,
alignItems: 'center',
justifyContent: 'center',
backgroundColor: 'rgba(52, 52, 52, 0.8)',
}}>
<ActivityIndicator />
<Text>Loading , Please wait.</Text>
</View>
);
}

return (
<SafeAreaView style={{ flex: 1 }} backgroundColor='#FFFFFF'>

{/* <View style={{borderTopLeftRadius:30}} backgroundColor='#FFFFFF'> */}

<View style={{ marginTop:10 ,width:width-40,alignSelf:'center'}}>
          <Image transition={false} source={require('../components1/images/OrDo.png')} style={{ marginTop: 10, width: 150,height:70}} > 
          </Image>
          </View>
          <Text
style={{
color:'black',
// fontWeight: '700',
// alignSelf: 'center',
width:width-60,
alignSelf:'center',
fontSize:30,
marginTop: 0,
height:40,
fontFamily:'Lato-Bold'
}}>
{' '}
Login
</Text>
<Text
style={{
color:'#a5a5a5',
// fontWeight: '700',
// alignSelf: 'center',
width:width-60,
alignSelf:'center',
fontSize:16,
// marginTop: 0,
height:30,
fontFamily:'Lato-Regular'
}}>
{' '}
Please Login to continue
</Text>
<View>
<View style={styles.searchSection}>
    <Icon style={styles.searchIcon} name="md-person" size={20} color="#000"/>
    <TextInput
       label="Username"
               
       type="outlined"
          placeholderTextColor='#dddddd'
          underlineColor='#dddddd'
         
          activeUnderlineColor='#dddddd'
          outlineColor="#dddddd"
          selectionColor="#dddddd"
          autoCompleteType='off'
          autoCorrect={false}
keyboardType="default"
autoCapitalize="none"
underlineColorAndroid="transparent"
onChangeText={(username) => {this.setState({username:username})}}
clearButtonMode="always"
ref={username => { this.textInput = username }}
style={{

backgroundColor:'white',
width:width-110,
height:60,
color: '#534F64',
marginTop: -10,
}}
value={this.state.username}
/>
    {/* <TextInput
        style={styles.input}
        label="Username"
        placeholder="Username"
        keyboardType="default"
        autoCapitalize="none"
        onChangeText={(username) => {this.setState({username:username})}}
        clearButtonMode="always"
        ref={username => { this.textInput = username }}
        autoCorrect={false}
        value={this.state.username}
    /> */}
</View>


<View style={styles.searchSection}>
  
    <Icon style={styles.searchIcon} name="md-lock" size={20} color="#000"/>
    <TextInput
       label="Password"
               
       type="outlined"
          placeholderTextColor='#dddddd'
          underlineColor='#dddddd'
         
          activeUnderlineColor='#dddddd'
          outlineColor="#dddddd"
          selectionColor="#dddddd"
          autoCompleteType='off'
          autoCorrect={false}
keyboardType="default"
fontSize={8}
autoCapitalize="none"
underlineColorAndroid="transparent"
secureTextEntry={true}
onChangeText={(password) => {this.setState({password:password})}}
clearButtonMode="always"
ref={username => { this.textInput = username }}
style={{

backgroundColor:'white',
width:width-110,

height:60,
color: '#534F64',
marginTop: -10,
}}
value={this.state.password}
/>
    {/* <TextInput
        style={styles.input}
        autoCompleteType="off"
password={true}
placeholder="Password"
secureTextEntry={true} 
keyboardType="default"
autoCapitalize="none"
underlineColorAndroid="transparent"
// onChangeText={username => this.setState({ username })}
onChangeText={password => this.changedPasswordValue(password)}
clearButtonMode="always"
ref={password => { this.textInputPassword = password }}
autoCorrect={false}
value={this.state.password}
multiline={false} 
    /> */}
    
</View>

{/* <DropDownPicker
   
    items={[
      {label: 'Sales Rep', value: '2'},
      {label: 'Customer/Store', value: '0'},
      {label: 'Delivery Rep', value: '4'},
      {label: 'Administrator', value: '99'},
      {label: 'Sales Manager', value: '3'},
      {label: 'Customer Manager', value: '1'},

    ]}
    defaultValue={this.state.type}
    containerStyle={{height: 60,width: 290,alignSelf: 'center'}}
    style={{backgroundColor: '#fafafa', backgroundColor: '#fff',
    // shadowColor: '#000',
    // borderRadius:10,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.7, marginHorizontal:5,
    // shadowRadius: 3,
    // elevation: 10 ,
    marginTop:10,width:width-70,alignSelf:'center'}}
    itemStyle={{
        justifyContent: 'flex-start'
    }}
    dropDownStyle={{backgroundColor: '#fafafa'}}
   
    placeholder={"Choose Type of User"}
    onChangeItem={item =>{ this.setState({
      type: item.value
    });}}
/> */}

</View>




<Text
style={{
marginTop: 0,
color: 'red',
textAlign: 'center',
alignSelf: 'center',
fontFamily:'Lato-Regular'
}}>
{this.state.error}
</Text>


               <TouchableOpacity title="Login" onPress={this.LoginButtonClick} style={{ alignSelf: 'flex-end',paddingRight:30,marginTop:20, justifyContent: 'center'}}>
                
                 <LinearGradient
              colors={['#1B1BD0', '#1B1BD0']}
              style={styles.signIn}>
                
              <Text style={styles.textSign}>Login</Text>
              <Icon style={styles.searchIcon} name="md-arrow-forward" size={20} color="#fff"/>
            </LinearGradient>
               </TouchableOpacity>

            


{/* </View> */}

</SafeAreaView>
);
}
}

const styles = StyleSheet.create({
  searchSection: {
    // flex: 1,
    height:70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    // shadowColor: '#000',
    // borderRadius:10,
// shadowOffset: { width: 0, height: 2 },
// shadowOpacity: 0.7, marginHorizontal:5,
// shadowRadius: 3,
// elevation: 10 ,
marginTop:0,width:width-70,alignSelf:'center',
    
},
searchIcon: {
    padding: 10,
},
input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
    fontFamily:'Lato-Regular',
    alignSelf:'flex-start'
},
cardContainer: {
marginTop: 10,
overflow: 'hidden',
// height: 390,
// width: 150,
borderRadius: 10,
backgroundColor: '#F5F5F5',
marginHorizontal: 5,
elevation: 3,
marginVertical: 10,
shadowColor: '#F5F5F5',
shadowOffset: { width: 0, height: 0 },
shadowRadius: 2,
shadowOpacity: 0.4,
},
container: {
flex: 0,
alignItems: 'center',
justifyContent: 'center',
backgroundColor: '#ecf0f1',
marginTop: 10,
},

flatliststyle: {
marginTop: 1,
overflow: 'hidden',
borderRadius: 10,
backgroundColor: '#ffffff',
marginHorizontal: 5,
elevation: 3,
marginVertical: 1,
shadowColor: '#534F64',
shadowOffset: { width: 0, height: 0 },
shadowRadius: 2,
shadowOpacity: 0.4,
alignContent: 'center',
},
modal: {
flex: 1,
alignItems: 'center',
backgroundColor: '#00ff00',
padding: 100,
},
text: {
color: '#3f2949',
marginTop: 10,
fontFamily:'Lato-Bold'
},
textOrder: {
color: '#00ACEA',
fontSize: 27,
marginHorizontal: -25,
fontWeight: 'bold',
fontFamily:'Lato-Bold'
// fontWeight:'bold'
},
textPrime: {
color: '#34495A',
fontSize: 27,
marginHorizontal: 27,
fontWeight: 'bold',
fontFamily:'Lato-Bold'
// fontWeight:'bold'
},
RunningText: {
color: '#DCDCDE',
fontSize: 17,
fontWeight: 'bold',
fontFamily:'Lato-Bold'
},
input: {
width: 200,
color: '#534F64',
alignSelf: 'center',
marginTop: 10,
textAlign: 'center',
fontFamily:'Lato-Bold'
},
TextInputStyleClass: {
// Setting up Hint Align center.
textAlign: 'center',
alignSelf: 'center',
// Setting up TextInput height as 50 pixel.
height: 40,
width: 150,
padding: 10,
// Set border width.
borderWidth: 2,
color: '#DCDCDE',
// Set border Hex Color Code Here.
borderColor: '#00ACEA',

// Set border Radius.
borderRadius: 25,

//Set background color of Text Input.
backgroundColor: '#00ACEA',
},
submitButton: {
padding: 10,
margin: 15,
height: 50,
shadowColor: 'rgba(0, 0, 0, 0.1)',
shadowOpacity: 0.8,
elevation: 6,
shadowRadius: 15,
shadowOffset: { width: 1, height: 13 },
},
button: {
  alignItems: 'flex-end',
  marginTop: 30,
},
signIn: {
  width: width-60,
  height: 50,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 180,
  flexDirection: 'row',
  borderWidth:1,
  borderColor:'#1B1BD0',
},
textSign: {
  color: '#ffffff',
  fontWeight: '200',
  fontSize:17,
  fontFamily:'Lato-Regular'
},
});

export default LoginScreen;

// import React, { Component } from 'react';
// import {
// Text,
// Dimensions,
// Alert,
// ActivityIndicator,
// ImageBackground,
// StyleSheet,
// Image,
// TouchableOpacity,
// SafeAreaView,
// TextInput,
// Button,
// AsyncStorage,
// View,
// } from 'react-native';
// const Constants = require('../components1/Constants');
// import DropDownPicker from 'react-native-dropdown-picker';
// import CommonDataManager from './CommonDataManager';
// let commonData = CommonDataManager.getInstance();
// import Icon from 'react-native-vector-icons/Feather';
// // let commonData = CommonDataManager.getInstance();
// // import CommonDataManager from './CommonDataManager';

// // const GET_DATAURL = 'https://csardent.com/primeorder/get_data_crm.php';
// // const GET_DATAURL='https://primesophic.com/SalesAltum/log_in_crm.php'

// import LinearGradient from 'react-native-linear-gradient';
// const { height } = Dimensions.get('window');
// const { width } = Dimensions.get('screen');
// var RNFS = require('react-native-fs');
// var storepath = RNFS.DocumentDirectoryPath + '/storesOffline.json';
// class LoginScreen extends Component {
// constructor(props) {
// super(props);

// // this.textHandler = this.textHandler.bind(this);
// this.LoginButtonClick = this.LoginButtonClick.bind(this);

// this.state = {
// username: '',
// type:'',
// password: '',
// isLoading: false,
// responseCount: '',
// error: '',
// };
// this.textInput='';
// this.textInputPassword='';
// }


// componentWillMount(){
// this.setState({
// username:'',
// })
// }
// async getSession(){
//  var sessionid = await AsyncStorage.getItem('sessionid')
//  var user_id=await AsyncStorage.getItem('userid')
//  var uname= await AsyncStorage.getItem('Username')
//  commonData.setusername(uname)
//  commonData.setsessionId(sessionid)
//  commonData.setUserid(user_id)
// }

// // async LoginButtonClick() {

// // if(this.state.username.length==0 || this.state.password.length==0){
// // this.setState({error:'Field cannot be blank'})
// // return;
// // }
// // var that = this;
// // //New Implementation 
// // //Date : 19 April 2021
// // //Written By Sonia
// // if(that.state.type=='customer'){
// //   that.setState({isloading:false});
// //   commonData.setLoginType('customer');
// //   that.props.navigation.navigate("SyncScreen") 
// // }
// // //______________________________________________
// // that.state.isLoading=true;

// // console.log("po_user.username = '" + that.state.username + "' AND po_user.username = '" + that.state.password + "'")
// // const FETCH_TIMEOUT = 5000;
// // let didTimeOut = false;
// // that.setState({
// // isloading: true,
// // });
// // const GET_DATAURL =Constants.LOGIN_URL
// // var uname=that.state.username
// // var pname=that.state.password
// // new Promise(function (resolve, reject) {
// // const timeout = setTimeout(function () {
// // didTimeOut = true;
// // reject(new Error('Request timed out'));
// // Alert.alert('Error', 'Coudnt Reach the Server,Try again later');
// // that.setState({isLoading:false})
// // }, FETCH_TIMEOUT);

// // fetch(GET_DATAURL, {
// // method: 'POST',
// // body: JSON.stringify({
// //   "__module_code__":"PO_12",
// //   "__uname__":uname,      
// //   "__pass__":pname,
// //   "__type__":0
// //   }),
// // })
// // .then(response => response.json())
// // .then( (response) => {
// //   that.setState({isloading:false})
// //   console.log('result is', response.ErrorCode);
// //   console.log('result is', response.name)
// //   console.log('result is', response.token)
// //   clearTimeout(timeout);
// //   if (!didTimeOut) {
// //   if(response.name=='undefined'||response.name==undefined){
   
// //     var sessionid=response.id;
// //     var user_id=response.name_value_list.user_id.value
// //     AsyncStorage.setItem('isLogin', 'true');
// //     AsyncStorage.setItem('Username', that.state.username)
// //     AsyncStorage.setItem('sessionid', sessionid)
// //     AsyncStorage.setItem('userid',user_id)
    
// //     that.setState({
// // error: '',
// // isLoading:false,
// // username:'',
// // password:''
// // });
// // that.props.navigation.navigate("SyncScreen")
// // that.getSession();
// //   }
      
// //   else{
// //       that.setState({
// //     error: 'Invalid Credentials',
// //     });
// //     that.setState({
// //       isLoading:false,
// //       username:'',
// //       password:''
// //       });

// //       }
// //     }
// //       response=''

// // })
// // .then(function () {


// // })
// // .catch(function (err) {
// // console.log(err);
// // });
// // });
// // }
// readstoreDetails(){
  
//   console.log("writting to store json file.......................")

//     RNFS.readFile(storepath, 'utf8')
//     .then((contents) => {
//       let tempArray = commonData.gettypeArray(contents,'PO_01');
//      commonData.setstoresArray(tempArray)
//     })
//     .catch((err) => {
//       console.log(err.message, err.code);
//     });
  
// }


 
// storedis=()=>{
//   var myHeaders = new Headers();
// myHeaders.append("Content-Type", "application/json");

// var raw = JSON.stringify({"__module_code__":"PO_12","__query__":"po_ordo_users.username='"+this.state.username+"'","__orderby__":"","__offset__":0,"__select _fields__":[""],"__max_result__":1,"__delete__":0});

// var requestOptions = {
//   method: 'POST',
//   headers: myHeaders,
//   body: raw,
//   redirect: 'follow'
// };

// fetch(Constants.TYPE_DATA_URL, requestOptions)
//   .then(response => response.json())
//   .then(result => {console.log(result.relationship_list[0].link_list[0].records)
//     var json = JSON.stringify(result.relationship_list[0].link_list[0].records);
//     RNFS.writeFile(storepath, json, 'utf8')
// .then((success) => {
//   console.log('FILE WRITTEN!');
// })
// .catch((err) => {
//   console.log(err.message);
// });
//     console.log(json, "this is for orders list array")
//     let tempArray = commonData.gettypeArray(json,'PO_12');
//     commonData.setstoresArray(tempArray);
    
//   })
//   .catch(error => console.log('error', error));
// }
// async LoginButtonClick() {
//   this.storedis();
//   if(this.state.username.length==0 || this.state.password.length==0){
//   this.setState({error:'Field cannot be blank'})
//   return;
//   }
//   var that = this;
//   let type=99;
//   //New Implementation 
//   //Date : 19 April 2021
//   //Written By Sonia
//   // if(that.state.type=='customer'){
//   //   that.setState({isloading:false});
//   //   commonData.setLoginType('customer');
//   //   that.props.navigation.navigate("SyncScreen") 
//   // }
//   if(that.state.type=='0'){
//     type=0;
//   }else if(that.state.type=='1'){
//     type=1;
//   }else if(that.state.type=='2'){
//     type=2;
//   }else if(that.state.type=='3'){
//     type=3;
//   }else if(that.state.type=='4'){
//     type=4;
//   }
//   //______________________________________________
//   that.state.isLoading=true;
  
//   console.log("po_user.username = '" + that.state.username + "' AND po_user.username = '" + that.state.password + "'")
//   const FETCH_TIMEOUT = 5000;
//   let didTimeOut = false;
//   that.setState({
//   isloading: true,
//   });
//   const GET_DATAURL =Constants.LOGIN_URL
//   var uname=that.state.username
//   var pname=that.state.password
//   new Promise(function (resolve, reject) {
//   const timeout = setTimeout(function () {
//   didTimeOut = true;
//   reject(new Error('Request timed out'));
//   Alert.alert('Error', 'Coudnt Reach the Server,Try again later');
//   that.setState({isLoading:false})
//   }, FETCH_TIMEOUT);
  
//   fetch(GET_DATAURL, {
//   method: 'POST',
//   body: JSON.stringify({
//     "__module_code__":"PO_12",
//     "__uname__":uname,      
//     "__pass__":pname,
//     "__type__":type
//     }),
//   })
//   .then(response => response.json())
//   .then( (response) => {
//     that.setState({isloading:false})
//     console.log('result is', response.ErrorCode);
//     console.log('result is', response.name)
//     console.log('result is', response.token)
//     clearTimeout(timeout);
//     if (!didTimeOut) {
//     if(response.ErrorCode=='200'){
     
//       var sessionid=response.token;
//       var user_id=response.name
//       var uid=response.id;
//       commonData.setuid(uid);
//       AsyncStorage.setItem('isLogin', 'true');
//       AsyncStorage.setItem('Username', that.state.username)
//       AsyncStorage.setItem('sessionid', sessionid)
//       AsyncStorage.setItem('ordoid', uid)
//       AsyncStorage.setItem('userid',uid)
      
//       that.setState({
//   error: '',
//   isLoading:false,
//   username:'',
//   password:''
//   });
//   that.props.navigation.navigate("SyncScreen")
//   that.getSession();
//     }
        
//     else{
//         that.setState({
//       error: 'Invalid Credentials',
//       });
//       that.setState({
//         isLoading:false,
//         username:'',
//         password:''
//         });
  
//         }
//       }
//         response=''
  
//   })
//   .then(function () {
  
  
//   })
//   .catch(function (err) {
//   console.log(err);
//   });
//   });
//   }
  

// performTimeConsumingTask = async () => {
// return new Promise((resolve) =>
// setTimeout(
// () => { resolve('result') },
// 5000
// )
// );

// }

// async componentDidMount() {
// const data = await this.performTimeConsumingTask();
// if (data !== null) {
// this.setState({ isLoading: false });
// }
// }


// componentDidMount(){
// this.setState({
// username:''
// })
// }
// changedPasswordValue=(text)=>{
//   this.setState({
//   password:text,
//   error:''
//   })
//   if(text.length==0){
//   this.setState({
//   error:text
//   })
//   }
//   }

// changedValue=(text)=>{
// this.setState({
// username:text,
// error:''
// })
// if(text.length==0){
// this.setState({
// error:text
// })
// }
// }
// render() {


// if (this.state.isLoading) {
// return (
// <View
// style={{
// flex: 1,
// alignItems: 'center',
// justifyContent: 'center',
// backgroundColor: 'rgba(52, 52, 52, 0.8)',
// }}>
// <ActivityIndicator />
// <Text>Loading , Please wait.</Text>
// </View>
// );
// }

// return (
// <SafeAreaView style={{ flex: 1 }} backgroundColor='#FFFFFF'>

// <View style={{borderTopLeftRadius:30}} backgroundColor='#FFFFFF'>

// <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center', marginTop:10 }}>
//           <Image transition={false} source={require('../components1/images/OrDo.png')} style={{ marginTop: 10, width: 150,height:70,alignSelf:'center' }} > 
//           </Image>
//           </View>

// <View>
// <DropDownPicker
//     // items={[
//     //     {label: 'Sales Rep', value: '2', icon: () => <Icon name="flag" size={18} color="#900" />},
//     //     {label: 'Customer/Store', value: '0', icon: () => <Icon name="flag" size={18} color="#900" />},
//     //     {label: 'Delivery Rep', value: '4', icon: () => <Icon name="flag" size={18} color="#900" />},
//     //     {label: 'Administrator', value: '99', icon: () => <Icon name="flag" size={18} color="#900" />},
//     //     {label: 'Sales Manager', value: '3', icon: () => <Icon name="flag" size={18} color="#900" />},
//     //     {label: 'Customer Manager', value: '1', icon: () => <Icon name="flag" size={18} color="#900" />},

//     //   ]}
//     items={[
//       {label: 'Sales Rep', value: '2'},
//       {label: 'Customer/Store', value: '0'},
//       {label: 'Delivery Rep', value: '4'},
//       {label: 'Administrator', value: '99'},
//       {label: 'Sales Manager', value: '3'},
//       {label: 'Customer Manager', value: '1'},

//     ]}
//     defaultValue={this.state.type}
//     containerStyle={{height: 40,width: 290,alignSelf: 'center'}}
//     style={{backgroundColor: '#fafafa'}}
//     itemStyle={{
//         justifyContent: 'flex-start'
//     }}
//     dropDownStyle={{backgroundColor: '#fafafa'}}
//     placeholder={"Who are you ?"}
//     onChangeItem={item => this.setState({
//       type: item.value
//     })}
// />
// <Text
// style={{
// color:'white',
// fontWeight: '700',
// alignSelf: 'center',
// marginTop: 5,
// fontFamily:'Lato-Bold'
// }}>
// {' '}
// Login
// </Text>
// <TextInput
// placeholder="Username"
// autoCompleteType="off"
// keyboardType="default"
// autoCapitalize="none"
// underlineColorAndroid="transparent"
// onChangeText={username => this.changedValue(username)}
// clearButtonMode="always"
// ref={username => { this.textInput = username }}
// autoCorrect={false}
// style={{
// marginHorizontal: 10,
// backgroundColor:'white',
// width: 290,
// height: 50,
// color: '#534F64',
// borderWidth: 1,
// // fontFamily: 'Lato-Regular',
// marginTop: 10,
// textAlign: 'center',
// alignSelf: 'center',
// borderRadius:10
// }}
// value={this.state.username}
// />
// <TextInput
// placeholder="Password"
// autoCompleteType="off"
// password={true}
// secureTextEntry={true} 
// keyboardType="default"
// autoCapitalize="none"
// underlineColorAndroid="transparent"
// // onChangeText={username => this.setState({ username })}
// onChangeText={password => this.changedPasswordValue(password)}
// clearButtonMode="always"
// ref={password => { this.textInputPassword = password }}
// autoCorrect={false}

// multiline={false} secureTextEntry={true}
// style={{
//   fontFamily:'Lato-Regular',
// marginHorizontal: 10,
// backgroundColor:'white',
// width: 290,
// height: 50,
// color: '#534F64',
// borderWidth: 1,
// marginTop: 10,
// textAlign: 'center',
// alignSelf: 'center',
// borderRadius:10
// }}
// value={this.state.password}
// />
// <Text
// style={{
// marginTop: 0,
// color: 'red',
// textAlign: 'center',
// alignSelf: 'center',
// fontFamily:'Lato-Regular'
// }}>
// {this.state.error}
// </Text>


//                <TouchableOpacity title="Login" onPress={this.LoginButtonClick} style={{ alignSelf: 'center', justifyContent: 'center', marginTop: 5 }}>
                
//                  <LinearGradient
//               colors={['#1B1BD0', '#1B1BD0']}
//               style={styles.signIn}>
//               <Text style={styles.textSign}>Submit</Text>
//             </LinearGradient>
//                </TouchableOpacity>

            
// </View>

// </View>

// </SafeAreaView>
// );
// }
// }

// const styles = StyleSheet.create({
// cardContainer: {
// marginTop: 10,
// overflow: 'hidden',
// // height: 390,
// // width: 150,
// borderRadius: 10,
// backgroundColor: '#F5F5F5',
// marginHorizontal: 5,
// elevation: 3,
// marginVertical: 10,
// shadowColor: '#F5F5F5',
// shadowOffset: { width: 0, height: 0 },
// shadowRadius: 2,
// shadowOpacity: 0.4,
// },
// container: {
// flex: 0,
// alignItems: 'center',
// justifyContent: 'center',
// backgroundColor: '#ecf0f1',
// marginTop: 10,
// },

// flatliststyle: {
// marginTop: 1,
// overflow: 'hidden',
// borderRadius: 10,
// backgroundColor: '#ffffff',
// marginHorizontal: 5,
// elevation: 3,
// marginVertical: 1,
// shadowColor: '#534F64',
// shadowOffset: { width: 0, height: 0 },
// shadowRadius: 2,
// shadowOpacity: 0.4,
// alignContent: 'center',
// },
// modal: {
// flex: 1,
// alignItems: 'center',
// backgroundColor: '#00ff00',
// padding: 100,
// },
// text: {
// color: '#3f2949',
// marginTop: 10,
// fontFamily:'Lato-Bold'
// },
// textOrder: {
// color: '#00ACEA',
// fontSize: 27,
// marginHorizontal: -25,
// fontWeight: 'bold',
// fontFamily:'Lato-Bold'
// // fontWeight:'bold'
// },
// textPrime: {
// color: '#34495A',
// fontSize: 27,
// marginHorizontal: 27,
// fontWeight: 'bold',
// fontFamily:'Lato-Bold'
// // fontWeight:'bold'
// },
// RunningText: {
// color: '#DCDCDE',
// fontSize: 17,
// fontWeight: 'bold',
// fontFamily:'Lato-Bold'
// },
// input: {
// width: 200,
// color: '#534F64',
// alignSelf: 'center',
// marginTop: 10,
// textAlign: 'center',
// fontFamily:'Lato-Bold'
// },
// TextInputStyleClass: {
// // Setting up Hint Align center.
// textAlign: 'center',
// alignSelf: 'center',
// // Setting up TextInput height as 50 pixel.
// height: 40,
// width: 150,
// padding: 10,
// // Set border width.
// borderWidth: 2,
// color: '#DCDCDE',
// // Set border Hex Color Code Here.
// borderColor: '#00ACEA',

// // Set border Radius.
// borderRadius: 25,

// //Set background color of Text Input.
// backgroundColor: '#00ACEA',
// },
// submitButton: {
// padding: 10,
// margin: 15,
// height: 60,
// shadowColor: 'rgba(0, 0, 0, 0.1)',
// shadowOpacity: 0.8,
// elevation: 6,
// shadowRadius: 15,
// shadowOffset: { width: 1, height: 13 },
// },
// button: {
//   alignItems: 'flex-end',
//   marginTop: 30,
// },
// signIn: {
//   width: 150,
//   height: 40,
//   justifyContent: 'center',
//   alignItems: 'center',
//   borderRadius: 50,
//   flexDirection: 'row',
// },
// textSign: {
//   color: 'white',
//   fontWeight: 'bold',
//   fontFamily:'Lato-bold'
// },
// });

// export default LoginScreen;
