import * as React from 'react';
import { useState, useEffect } from 'react'
import { Text,Platform, View,TouchableOpacity,Animated,ActivityIndicator,Image, StyleSheet, Dimensions,
  AsyncStorage,Alert,Button} from 'react-native';
  import CommonDataManager from './CommonDataManager';
  let commonData = CommonDataManager.getInstance();
let { width } = Dimensions.get('window');
let { height } = Dimensions.get('window');
var RNFS = require('react-native-fs');
const Constants = require('../components1/Constants');
const GET_DATAURL= Constants.GET_URL;
var storepath = RNFS.DocumentDirectoryPath + '/storesOffline.json';
var offerpath = RNFS.DocumentDirectoryPath + '/OffersOffline.json';
var skupath = RNFS.DocumentDirectoryPath + '/skuOffline.json';
var orderpath = RNFS.DocumentDirectoryPath + '/ordersOffline.json';
import PushNotification from "react-native-push-notification";




 export default class SyncScreen extends React.Component {

  constructor(props) {
    super(props);

    //Dummy event data to list in calendar 
    //You can also get the data array from the API call
    this.state = {
      SKULoaded:false,
      StoresLoaded:false,
      OrdersLoaded:false,
      offersloaded:false,

    };
  }
  async loadorders(){
  
  var that = this;
  var myHeaders = new Headers();
  const value = await AsyncStorage.getItem('Username');
  myHeaders.append("Content-Type", "application/json");
  
  var raw = JSON.stringify({"__module_code__":"PO_14","__query__":"username='"+value+"'","__orderby__": "date_entered DESC","deleted":0});
  
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  
  fetch("http://143.110.178.47/primeorder/get_data_s.php", requestOptions)
  .then(response => response.json())
  .then(result => {console.log(result);
        var json = JSON.stringify(result.entry_list);
        commonData.setorderscount(result.entry_list.length);
      console.log(json, "this is for orders list array")
      RNFS.writeFile(orderpath, json, 'utf8')
        .then((success) => {
          console.log('Orders Written');
        })
        .catch((err) => {
          console.log(err.message);
        });
     that.setState({
       OrdersLoaded:true
     });
   that.readOrders();
     that.AllthFilesLoaded();
  })
  .catch(error => console.log('error', error));
  
  }
  async loadsku(){
  
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", " application/json");
    
    var raw = "{\n\"__module_code__\": \"PO_06\",\n\"__query__\": \"po_products.deleted=0\",\n\"__orderby__\": \"\",\n\"__offset__\": 0,\n\"__select _fields__\": [\"\"],\n\"__max_result__\": 1,\n\"__delete__\": 0\n}";  
        var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    var that = this; 
    const FETCH_TIMEOUT = 2000;
      let didTimeOut = false;
      that.setState({ loading: true });
      new Promise(function (resolve, reject) {
        const timeout = setTimeout(function () {
          didTimeOut = true;
          reject(new Error('Request timed out'));
         
        }, FETCH_TIMEOUT);
  fetch(GET_DATAURL, requestOptions)
    .then(response => response.json())
    .then(result => {
      
      console.log(result.entry_list);
      console.log(result,"The sku data which ****************************come from the server here")
     
      // write the file
      var json = JSON.stringify(result.entry_list);
      commonData.setskucount(result.entry_list.length);
      RNFS.writeFile(skupath, json, 'utf8')
        .then((success) => {
          console.log('SKU FILE WRITTEN!');
        })
        .catch((err) => {
          console.log(err.message,"rtgfghfghghgghh");
        });
        // let tempArray = commonData.gettypeArray(json,'PO_06');
        // commonData.setSkuArray(tempArray)
        that.setState({
          SKULoaded:true
        });
        that.readSku();
        that.AllthFilesLoaded();
      // Clear the timeout as cleanup
      clearTimeout(timeout);
      if (!didTimeOut) {
        resolve(result);
      }})
    .catch(error => console.log('error', error));
  })
  .then(function () {
    // Request success and no timeout
    console.log('good promise, no timeout! ');
  })
  .catch(function (err) {
    // Error: response error, request timeout or runtime error
    console.log('promise error! ', err);
  });
    
  }
  async loadstore(){
    var uid=await AsyncStorage.getItem('ordoid')
    var myHeaders = new Headers();
  myHeaders.append("Content-Type", " application/json");
  
  var raw = "{\n\"__module_code__\": \"PO_01\",\n\"__query__\": \" po_stores.po_ordousers_id_c=\'"+uid+"\'\",\n\"__orderby__\": \"\",\n\"__offset__\": 0,\n\"__select _fields__\": [\"\"],\n\"__max_result__\": 1,\n\"__delete__\": 0\n}";
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  var that = this;
      const FETCH_TIMEOUT = 1000;
      let didTimeOut = false;
      that.setState({ loading: true });
      new Promise(function (resolve, reject) {
        const timeout = setTimeout(function () {
          didTimeOut = true;
          reject(new Error('Request timed out'));
          that.setState({ loading: false });
        }, FETCH_TIMEOUT);
  
        fetch(GET_DATAURL, requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log("this data which come from the server...........................")
      console.log(result.entry_list)
      commonData.setstorescount(result.entry_list.length);
      // write the file
      console.log("contents are there...")
      var json = JSON.stringify(result.entry_list);
      console.log(json, "this is for storing list array")
      RNFS.writeFile(storepath, json, 'utf8')
        .then((success) => {
          console.log('FILE WRITTEN!');
        })
        .catch((err) => {
          console.log(err.message);
        });
        // let tempArray = commonData.gettypeArray(json,'PO_01');
        // commonData.setstoresArray(tempArray)
      // Clear the timeout as cleanup
      that.setState({
        StoresLoaded:true
      });
      that.readstoreDetails();
      that.AllthFilesLoaded();
      clearTimeout(timeout);
      if (!didTimeOut) {
        console.log('fetch good! ', result);
        resolve(result);
      }})
    .catch(error => console.log('error', error));
  })
  .then(function () {
    // Request success and no timeout
    console.log('good promise, no timeout! ');
  })
  .catch(function (err) {
    // Error: response error, request timeout or runtime error
    console.log('promise error! ', err);
  });
  }
  async loadstore3(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({"__module_code__":"PO_12","__query__":"po_ordo_users.username='admin'","__orderby__":"","__offset__":0,"__select _fields__":[""],"__max_result__":1,"__delete__":0});
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
  var that = this;
      const FETCH_TIMEOUT = 1000;
      let didTimeOut = false;
      that.setState({ loading: true });
      new Promise(function (resolve, reject) {
        const timeout = setTimeout(function () {
          didTimeOut = true;
          reject(new Error('Request timed out'));
          that.setState({ loading: false });
        }, FETCH_TIMEOUT);
  
        // fetch(GET_DATAURL, requestOptions)
        fetch("http://143.110.178.47/primeorder/get_data_ltype.php", requestOptions)
    .then(response => response.json())
    .then(result => {
     
      clearTimeout(timeout);
      if (!didTimeOut) {
        console.log('fetch good! ', result);
        var json = JSON.stringify(result.relationship_list[0].link_list[0].records);
        // write the file
        console.log("contents are there...")
        console.log(json, "this is for storing list array")

        RNFS.writeFile(storepath, json, 'utf8')
          .then((success) => {
            console.log('FILE WRITTEN!');
          })
          .catch((err) => {
            console.log(err.message);
          });
          let tempArray = commonData.gettypeArray(json,'PO_12');
          commonData.setstoresArray(tempArray)
        // Clear the timeout as cleanup
        that.setState({
          StoresLoaded:true
        });
        that.readstoreDetails();
        that.AllthFilesLoaded();
        resolve(result);
      }})
    .catch(error => console.log('error', error));
  })
  .then(function () {
    // Request success and no timeout
    console.log('good promise, no timeout! ');
  })
  .catch(function (err) {
    // Error: response error, request timeout or runtime error
    console.log('promise error! ', err);
  });
  }
  syncDataFromServer=()=>{
    this.setState({
      OrdersLoaded:false,
      SKULoaded:false,
      StoresLoaded:false,
    })
    this.loadsku();
this.loadstore();
this.loadorders();

  }
  readstoreDetails(){  
      RNFS.readFile(storepath, 'utf8')
      .then((contents) => {
        // log the file contents
        // contentstr=contents
        let tempArray = commonData.gettypeArray(contents,'PO_01');
        // here we are getting contents from the json and passisng that contents to the function and try to retrieve it .
        commonData.setstoresArray(tempArray)
        
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });
    
  }
  
  
  readSku(){
    RNFS.readFile(skupath, 'utf8')
      .then((contents) => {
        // log the file contents
           let tempArray = commonData.gettypeArray(contents,'PO_06')
        commonData.setSkuArray(tempArray)
       
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });
    
   }
  
   readOrders(){
        RNFS.readFile(orderpath, 'utf8')
          .then((contents) => {
            contentsOrder=contents
            let object=JSON.parse(contents);
           
                let tempArray = commonData.gettypeArray(contents,'PO_14')
            commonData.setorderssArray(tempArray)
          })
          .catch((err) => {
            console.log(err.message, err.code);
          });
       
   
        }
  async AllthFilesLoaded(){
    if(this.state.OrdersLoaded==true&& this.state.SKULoaded==true&&this.state.StoresLoaded==true){
    const isLogin = await AsyncStorage.getItem('isLogin');
      const { navigate } = this.props.navigation;
      if(isLogin != null || isLogin == "true")
      {
         
          this.props.navigation.navigate("TabScreen");
      }

    }
  }
  async loadstore1(){
  var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"__module_code__":"PO_12","__query__":"po_ordo_users.username='"+this.state.username+"'","__orderby__":"","__offset__":0,"__select _fields__":[""],"__max_result__":1,"__delete__":0});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch(Constants.TYPE_DATA_URL, requestOptions)
  .then(response => response.json())
  .then(result => {console.log(result.relationship_list[0].link_list[0].records)
    var json = JSON.stringify(result.relationship_list[0].link_list[0].records);
    RNFS.writeFile(storepath, json, 'utf8')
.then((success) => {
  console.log('FILE WRITTEN!');
})
.catch((err) => {
  console.log(err.message);
});
    console.log(json, "this is for orders list array")
    let tempArray = commonData.gettypeArray(json,'PO_12');
    commonData.setstoresArray(tempArray);
    
  })
  .catch(error => console.log('error', error));
}
 loadOffers(){
   
        var that = this;
      
        // fetch("http://192.168.9.14:8080/get_data_s.php", {
          fetch(GET_DATAURL, {
          method: "POST",
          body: JSON.stringify({
            "__module_code__": "PO_10",
            "__query__": "",
            "__orderby__": "",
            "__offset__": 0,
            "__select _fields__": [""],
            "__max_result__": 1,
            "__delete__": 0,
          })
        }).then(function (response) {
          return response.json();
        }).then(function (result) {
         let skuArray = result.entry_list;
     that.setState({offersloaded:true});
     that.AllthFilesLoaded();
          let temparray=[];
          for(var i=0;i<result.entry_list.length;i++){
           console.log(skuArray.length.toString());
            temparray.push({Code:skuArray[i].name_value_list.coupon_code.value,Validity:skuArray[i].name_value_list.valud_till.value,type:skuArray[i].name_value_list.type.value,OfferVAl:skuArray[i].name_value_list.discount_value.value});
          }
         


          console.log("The sku data which come from the server here")
          console.log(temparray);
    var json = JSON.stringify(temparray);
    commonData.setoffersArray(temparray);
    console.log(json, "this is sku order array list array")
    RNFS.writeFile(offerpath, json, 'utf8')
      .then((success) => {
        console.log('FILE WRITTEN!');
      })
      .catch((err) => {
        console.log(err.message);
      });
         
        }).catch(function (error) {
          console.log("-------- error ------- " + error);
        });
      }
      async componentWillMount(){

        const { navigation } = this.props;

    this.focusListener = navigation.addListener("didFocus", () => {
      // const value=await AsyncStorage.getItem('Username')
   
      
      this.loadOffers();
      // commonData.setusername(value)
      this.syncDataFromServer();
    });
    this.focusListener = navigation.addListener("willBlur", () => {
     
    });

        // const value=await AsyncStorage.getItem('Username')
   
        // this.loadOffers();
        // commonData.setusername(value)
        // this.syncDataFromServer();
      }
  async componentDidMount () {
   
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
        console.log("TOKEN:", token.token);
        AsyncStorage.setItem('FBtoken', token.token);
       commonData.setFBToken(token.token);
        
       
      },
      onAction:function(notification){
        console.log("notification:", notification);
       
      },
    //   // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        console.log("NOTIFICATION:", notification);

        // process the notification here
    
        // required on iOS only 
       if(Platform.OS === 'ios')
         notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      // Android only
      senderID: "290421905540",
      // iOS only
      permissions: {
        alert: true,
        badge: true,
        sound: true,
        ignoreInForeground:false
      },
     
      popInitialNotification: true,
      requestPermissions: true
    });
   
//FB#24
   

    // this.props.navigation.navigate("TabScreen");
   
        
       
  }
  
componentWillUnmount() {
  
  
}

  render() {
    
    return (
      <View style={{ flex: 1,justifyContent:'center', backgroundColor:'#FFFFFF'}}>
        <ActivityIndicator
               animating = {true}
               color = {'#1B1BD0'}
               size = "large"/>
             
        <Text style={{alignSelf:'center',color:'#21283d'}} >App Initialising, Please wait</Text>
         </View>
      );
  }
  }

