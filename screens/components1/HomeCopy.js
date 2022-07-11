
import React, { Component } from 'react';
import { Text, View,Dimensions, FlatList,ActivityIndicator, Modal,TextInput,StyleSheet,AsyncStorage, Button, AppRegistry, ScrollView, Linking, Alert, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { ItemArrayAdded } from './SKU'
import CommonDataManager from './CommonDataManager';
import { Card } from 'native-base'
import { withNavigation } from "react-navigation";
import NetInfo from "@react-native-community/netinfo";
var RNFS = require('react-native-fs');
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons'; 
import TextTicker from 'react-native-text-ticker'
// import HSNZ from "react-native-marquee";

// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '@react-navigation/native';
// import {Button} from 'react-native-paper';

var userpath = RNFS.DocumentDirectoryPath + '/logindetails.json';
var storepath = RNFS.DocumentDirectoryPath + '/storesOffline.json';
var skupath = RNFS.DocumentDirectoryPath + '/skuOffline.json';
var orderpath = RNFS.DocumentDirectoryPath + '/ordersOffline.json';
import {
  Dropdown }
  from 'react-native-material-dropdown';
const{width}=Dimensions.get("screen")
const connection_error='Could not Sync With the Server.Try again later'
let connnctionFailed=false
const Constants = require('./Constants');
const GET_DATAURL= Constants.GET_URL;
let commonData = CommonDataManager.getInstance();
let listArray = [];
let orderArray=[];
let skuArray = [];
const OFFLINE='Offline'
const ONLINE='Online'

  let data = [{
    value: 'Return',
  }, {
    value: 'New',
  }, {
    value: 'History',
  }];
class HomeTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
      isVisible: false,
      userValue: '', totalqty: '',
      loading: false,
      refreshing:false,
      TotalAmount: '',
      items: '',
      Username:'',
      custname: '',
      custid:'',
      custaddress: '',
      connection_Status : ONLINE,
      OffersArray: [{
        image: "https://www.yatra.com/ythomepagecms/media/todayspick_home/2019/Aug/f2829d27b3f1caf9ca6d18769fe13c51.jpg"
        , urlloc: 'https://www.facebook.com'
      },
      {
        image: "https://www.yatra.com/ythomepagecms/media/todayspick_home/2019/Jul/2928e3398822efa29a8ff798bc23eba6.jpg"
        , urlloc: 'https://aboutreact.com'
      },
      {
        image: "https://www.yatra.com/ythomepagecms/media/todayspick_home/2019/Feb/f718385199333221c318864dae78dffa.jpg"
        , urlloc: 'https://google.com'
      },
      {
        image: "https://www.yatra.com/ythomepagecms/media/todayspick_home/2019/Jul/941e7601688e6942b42b95989876e377.jpg"
        , urlloc: 'https://www.yatra.com'
      }

      ]


    }
  }
  logout=()=>{
   
    console.log("after output")
    this.reset();
    commonData.setusername('')
    this.forceUpdate();
   
    this.props.navigation.navigate("LoginScreen")  
  }
  componentDidMount() {
    
    NetInfo.isConnected.addEventListener(
        'connectionChange',
        this._handleConnectivityChange
    );
    NetInfo.isConnected.fetch().done((isConnected) => {

      if(isConnected == true)
      {
        this.setState({connection_Status :ONLINE})
      
      }
      else
      {
        this.setState({connection_Status :OFFLINE})
      }

    });
  }
  componentWillUnmount() {

    NetInfo.isConnected.removeEventListener(
        'connectionChange',
        this._handleConnectivityChange

    );
  }
  LoadFileswithServerData()
  {
   
      // this.readstoreDetails();
      // this.readSku();
      // this.readOrders();
    

  }
  _handleConnectivityChange = (isConnected) => {

    if(isConnected == true)
      {
        this.setState({connection_Status :ONLINE})
      }
      else
      {
          this.setState({connection_Status : OFFLINE})
          
      }
  };
  async getSession(){
    var sessionid = await AsyncStorage.getItem('sessionid')
    var user_id=await AsyncStorage.getItem('userid')
    var uname= await AsyncStorage.getItem('Username')
    commonData.setUname(uname)
    commonData.setsessionId(sessionid)
    commonData.setUserid(user_id)
   }
   async getuser() {
    this.state.userValue = this.props.navigation.getParam('userid', '')
    var user_id=await AsyncStorage.getItem('userid')
    var uname= await AsyncStorage.getItem('Username')
    this.state.userValue=uname;
    
    this.state.totalqty = commonData.getTotalQty();
    this.state.TotalAmount = commonData.getTotalPrice();
    this.state.items = commonData.getTotalItems();
    this.state.custname = commonData.getActiveCustName();
    this.state.custid=commonData.getActiveCustomerID();
    this.state.custaddress = commonData.getActiveAdress();
    // this.loadorders();
    this.readOrders();
    this.forceUpdate();
  }
    
  componentWillMount() {
    // this.synccall()
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {     
      this.forceUpdate();
      this.getuser()
     
    });

 }
 loadstore(){
  var myHeaders = new Headers();
myHeaders.append("Content-Type", " application/json");

var raw = "{\n\"__module_code__\": \"PO_01\",\n\"__query__\": \"\",\n\"__orderby__\": \"\",\n\"__offset__\": 0,\n\"__select _fields__\": [\"\"],\n\"__max_result__\": 1,\n\"__delete__\": 0\n}";
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
  .then(result => {listArray = result.entry_list;
    console.log("this data which come from the server...........................")
    console.log(listArray)
    // write the file
    console.log("contents are there...")
    var json = JSON.stringify(listArray);
    console.log(json, "this is for storing list array")
    RNFS.writeFile(storepath, json, 'utf8')
      .then((success) => {
        console.log('FILE WRITTEN!');
      })
      .catch((err) => {
        console.log(err.message);
      });
    that.setState({
      mainData: result.entry_list,
      JSONResult: result.entry_list,
      loading: false,
      refreshing: false
    });
    // Clear the timeout as cleanup
    clearTimeout(timeout);
    if (!didTimeOut) {
      console.log('fetch good! ', response);
      resolve(response);
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
  exloadstore(){
    connnctionFailed=false;
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

      fetch(GET_DATAURL, {

        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "__module_code__": "PO_01",
          "__query__": "",
          "__orderby__": "",
          "__offset__": 0,
          "__select _fields__": [""],
          "__max_result__": 1,
          "__delete__": 0
          })
      }).then((response) => response.json())
        .then(function (result) {
          
          listArray = result.entry_list;
          console.log("this data which come from the server...........................")
          console.log(listArray)
          // write the file
          console.log("contents are there...")
          var json = JSON.stringify(listArray);
          console.log(json, "this is for storing list array")
          RNFS.writeFile(storepath, json, 'utf8')
            .then((success) => {
              console.log('FILE WRITTEN!');
            })
            .catch((err) => {
              console.log(err.message);
            });
          that.setState({
            mainData: result.entry_list,
            JSONResult: result.entry_list,
            loading: false,
            refreshing: false
          });
          // Clear the timeout as cleanup
          clearTimeout(timeout);
          if (!didTimeOut) {
            console.log('fetch good! ', response);
            resolve(response);
          }
        })
        .catch(function (err) {
          console.log('fetch failed! ', err);

          // Rejection already happened with setTimeout
          if (didTimeOut){
            
          } return;
          // Reject with error
          reject(err);
        });
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


    loadsku(){
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", " application/json");
      
      var raw = "{\n\"__module_code__\": \"PO_06\",\n\"__query__\": \"\",\n\"__orderby__\": \"\",\n\"__offset__\": 0,\n\"__select _fields__\": [\"\"],\n\"__max_result__\": 1,\n\"__delete__\": 0\n}";      var requestOptions = {
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
      .then(result => {skuArray = result.entry_list;
        console.log("The sku data which come from the server here")
        console.log(skuArray);
        // write the file
        var json = JSON.stringify(skuArray);
        console.log(json, "this is sku order array list array")
        RNFS.writeFile(skupath, json, 'utf8')
          .then((success) => {
            console.log('FILE WRITTEN!');
          })
          .catch((err) => {
            console.log(err.message);
          });
        that.setState({
          mainData: result.entry_list,
          JSONResult: result.entry_list,
          loading: false,
          refreshing: false
        });
        console.log(response, "smile pleasea")
        // Clear the timeout as cleanup
        clearTimeout(timeout);
        if (!didTimeOut) {
          console.log('fetch good! ', response);
          resolve(response);
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

  exloadsku(){
   
      
var that = this;
const FETCH_TIMEOUT = 5000;
let didTimeOut = false;
that.setState({ loading: true });
new Promise(function (resolve, reject) {
  const timeout = setTimeout(function () {
    didTimeOut = true;
    reject(new Error('Request timed out'));
    that.setState({ loading: false });
  }, FETCH_TIMEOUT);

  fetch(GET_DATAURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "__module_code__": "PO_06",
      "__query__":"po_products.deleted=0",
      "__orderby__": "",
      "__offset__": 0,
      "__select _fields__": [""],
      "__max_result__": 1,
      "__delete__": 0
      }),
    
  }).then((response) => response.json())
    .then(function (result) {
      skuArray = result.entry_list;
      console.log("The sku data which come from the server here")
      console.log(skuArray);
      // write the file
      var json = JSON.stringify(skuArray);
      console.log(json, "this is sku order array list array")
      RNFS.writeFile(skupath, json, 'utf8')
        .then((success) => {
          console.log('FILE WRITTEN!');
        })
        .catch((err) => {
          console.log(err.message);
        });
      that.setState({
        mainData: result.entry_list,
        JSONResult: result.entry_list,
        loading: false,
        refreshing: false
      });
      console.log(response, "smile pleasea")
      // Clear the timeout as cleanup
      clearTimeout(timeout);
      if (!didTimeOut) {
        console.log('fetch good! ', response);
        resolve(response);
      }
    })
    .catch(function (err) {
      console.log('fetch failed! ', err);

      // Rejection already happened with setTimeout
      if (didTimeOut) return;
      // Reject with error
      reject(err);
    });
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
  
loadorders(){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", " application/json");
  
  var raw = "{\n\"__module_code__\": \"PO_04\",\n\"__query__\": \"\",\n\"__orderby__\": \"\",\n\"__offset__\": 0,\n\"__select _fields__\": [\"\"],\n\"__max_result__\": 1,\n\"__delete__\": 0\n}";  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  var that = this;
    const FETCH_TIMEOUT = 5000;
    let didTimeOut = false;
    that.setState({ loading: true });
    new Promise(function (resolve, reject) {
      const timeout = setTimeout(function () {
        didTimeOut = true;
        reject(new Error('Request timed out'));
        that.setState({ loading: false });
      }, FETCH_TIMEOUT);
      let variable=commonData.getusername();
     
      fetch(GET_DATAURL, {
        method: "POST",
        body: JSON.stringify({
          "__module_code__": "PO_04",
          "__query__": "po_orders.createdby = '" + variable + "'",
          "__orderby__": "",
          "__offset__": 0,
          "__select _fields__": [""],
          "__max_result__": 1,
          "__delete__": 0,
        })
      }).then(function (response) {
        return response.json();})
  .then(result => {orderArray = result.entry_list;
    console.log("The previous order data which come from the server here", result)
    console.log(orderArray);
    var json = JSON.stringify(orderArray);
    console.log(json, "this is for orders list array")
    RNFS.writeFile(orderpath, json, 'utf8')
      .then((success) => {
        console.log('FILE WRITTEN!');
      })
      .catch((err) => {
        console.log(err.message);
      });
    that.setState({
      mainData: result.entry_list,
      JSONResult: result.entry_list,
      loading: false,
      refreshing: false
    });
    console.log(response, "smile pleasea")
    // Clear the timeout as cleanup
    clearTimeout(timeout);
    if (!didTimeOut) {
      console.log('fetch good! ', response);
      resolve(response);
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
 
exloadorders(){
  var that = this;
  const FETCH_TIMEOUT = 5000;
  let didTimeOut = false;
  let variable = commonData.getusername();
  new Promise(function (resolve, reject) {
    const timeout = setTimeout(function () {
      didTimeOut = true;
      reject(new Error('Request timed out'));
      // that.setState({ loading: false });
    }, FETCH_TIMEOUT);

    fetch(GET_DATAURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "__module_code__": "PO_04",
        "__query__": "",
        "__orderby__": "",
        "__offset__": 0,
        "__select _fields__": [""],
        "__max_result__": 1,
        "__delete__": 0
        })
    }).then((response) => response.json())
      .then(function (result) {
        orderArray = result.entry_list;
        console.log("The previous order data which come from the server here", result)
        console.log(orderArray);
        var json = JSON.stringify(orderArray);
        console.log(json, "this is for orders list array")
        RNFS.writeFile(orderpath, json, 'utf8')
          .then((success) => {
            console.log('FILE WRITTEN!');
          })
          .catch((err) => {
            console.log(err.message);
          });
        that.setState({
          mainData: result.entry_list,
          JSONResult: result.entry_list,
          loading: false,
          refreshing: false
        });
        console.log(response, "smile pleasea")
        // Clear the timeout as cleanup
        clearTimeout(timeout);
        if (!didTimeOut) {
          console.log('fetch good! ', response);
          resolve(response);
        }
      })
      .catch(function (err) {
        console.log('fetch failed! ', err);

        // Rejection already happened with setTimeout
        if (didTimeOut) return;
        // Reject with error
        reject(err);
      });
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

  componentDidUpdate() {
    const value = commonData.getUserID();
      if (value !== null) {
    //  this.readstoreDetails();
    //  this.readSku();
    //  this.readOrders();
      }
  }
  readstoreDetails(){
  
  console.log("writting to store json file.......................")

    RNFS.readFile(storepath, 'utf8')
    .then((contents) => {
      // log the file contents
      // contentstr=contents
      
      console.log(contents);
      console.log("cvbnkjhgfdfghjkjhgfdsfgh")
      console.log("Json_parse");
      console.log(JSON.parse(contents));
      let tempArray = commonData.gettypeArray(contents,'PO_01');
      console.log("after json parse")
      console.log("here is our temparary data")
      console.log("temparay array")
      console.log(tempArray);
      // here we are getting contents from the json and passisng that contents to the function and try to retrieve it .
      commonData.setstoresArray(tempArray)
    })
    .catch((err) => {
      console.log(err.message, err.code);
    });
  
}


readSku(){
  
  // var path = RNFS.ExternalDirectoryPath + '/skuOffline.json';

  // // write the file

  // var json = JSON.stringify(skuArray);
  // console.log(json, "this is sku order array list array")
  // RNFS.writeFile(path, json, 'utf8')
  //   .then((success) => {
  //     console.log('FILE WRITTEN!');
  //   })
  //   .catch((err) => {
  //     console.log(err.message);
  //   });

  RNFS.readFile(skupath, 'utf8')
    .then((contents) => {
      // log the file contents
      console.log("writting files to orders.....................")
      console.log(contents);
      console.log("Json_parse");
      console.log(JSON.parse(contents));
      console.log("Reading Order array from json and use it throughout app using common data manager")
      let tempArray = commonData.gettypeArray(contents,'PO_06')
      commonData.setSkuArray(tempArray)
      console.log("temparay array")
      console.log(tempArray);
    })
    .catch((err) => {
      console.log(err.message, err.code);
    });
  
 }

 readOrders(){
      RNFS.readFile(orderpath, 'utf8')
        .then((contents) => {
          contentsOrder=contents
          // log the file contents
          console.log("writting files to orders.....................")
          console.log(contents);
          console.log("Json_parse");
          console.log(JSON.parse(contents));
          console.log("Reading Order array from json and use it throughout app using common data manager")
          let tempArray = commonData.gettypeArray(contents,'PO_04')
          commonData.setorderssArray(tempArray)
          console.log("temparay array")
          console.log(tempArray);
        })
        .catch((err) => {
          console.log(err.message, err.code);
        });
     
 
      }

     
  synccall =() =>{
   
    // this.readOrders();
    // this.readstoreDetails();
    // this.readSku();

  }
  // setuserDetails = async () => {
  //   try {
  //     await AsyncStorage.setItem('Username', this.state.Username);
  //     commonData.setUserID(this.state.Username)
  //   } catch (error) {
     
  //     // Error saving data
  //   }
  // }
  // getuserdetails=async()=>{
  //   // const value = await AsyncStorage.getItem('Username');
  //   // return value
  // }
  retrieveData = async () => {
    try {
      // const value = await AsyncStorage.getItem('Username');
      // commonData.setUserID(value)
      // if (value !== null) {
        this.synccall();
        
      // }
     } catch (error) {
       // Error retrieving data
     }
  }

  onbuttonClick = () => {
    Alert.alert(ItemArrayAdded.length)
  }

  itemSepartor = () => {
    return (
      <View
        style={{
          height: 1,
          width: "90%",
          backgroundColor: "#000",
        }} />
    );
  }
  getdetails= () =>  {
    if(this.state.connection_Status==OFFLINE){
      Alert.alert('No Internet Connection!!')
      return;
    }
    var that = this;
    // fetch("http://192.168.9.14:8080/get_data_s.php", {
      fetch(GET_DATAURL, {
      method: "POST",
      body: JSON.stringify({
        "__module_code__": "PO_04",
        "__query__": "",
        "__orderby__": "",
        "__offset__": 0,
        "__select _fields__": [""],
        "__max_result__": 1,
        "__delete__": 0
        })
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
     if(result.result_count>0){
      // that.setuserDetails()
      // that.retrieveData()
      that.setState({ isVisible: true });
      commonData.isRegistered=true
      // that.LoadFileswithServerData()
      that.forceUpdate()
     }else{
       Alert.alert('Invalid Credentials.')
       that.forceUpdate()
     }
      
    }).catch(function (error) {
      console.log("-------- error ------- " + error);
    });
     } 
     makeRemoteRequest = () => {
      //  this.setState({ loading: true });
      //  this.setState({
      //      loading: false,
      //  });
    
   };
   async reset(){
    await AsyncStorage.removeItem('isLogin')
    await AsyncStorage.removeItem('Username')

   }
   getdatafrompath(path){
     var that =this
    //  that.state.Username=''
     commonData.isRegistered=false
    //  that.state.isVisible=false
    RNFS.readFile(path, 'utf8')
    .then((contents) => {
    console.log(contents,"++++++++++++++++++++",contents.length);
    // that.state.Username=contents
    if(contents.length>0)
    that.state.isVisible=true;
  })
  .catch((err) => {
  });  
   }
  
   render() {

    let uname=commonData.getusername();
    let screenwidth= Dimensions.get('window').width;
    let screenheight= Dimensions.get('window').height;
    
  
    if(screenwidth>375){
      screenwidth= (screenwidth-50)/3;
    }else{

      screenwidth= (screenwidth-50)/3;
    }
   
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(52, 52, 52, 0.8)' }}>
          <ActivityIndicator />
          <Text>Loading , Please wait.</Text>
        </View>
      );
    }
    return (
      <SafeAreaView>
        <View style={{ backgroundColor: '#1B1BD0' }}>
          
             <View style={{width:width-20, alignItems:'flex-end',flexDirection:'row-reverse',backgroundColor:'#1B1BD0'}}>
            
                <TouchableOpacity style={{marginHorizontal:10}} onPress={() =>Alert.alert(
                      //title
                      'Confirmation',
                      //body
                      'Are you sure ,You want to logout?',
                      [
                        { text: 'Yes', onPress: () => { this.logout() }},
                        { text: 'Cancel', onPress: () => console.log('No Pressed'), style: 'cancel' },
                      ],
                      { cancelable: false }
                      //clicking out side of alert will not cancel
                    )}
  >
      <Icon name="md-log-out" color='#FFFFFF' size={25}/>  
                {/* <Image transition={false} source={require('../components1/images/logout.png')} style={{height:25,width:25  ,resizeMode:'contain',alignSelf:'center'}} ></Image> */}
                 {/* <Text style={{color:'#1B1BD0',fontSize:14,fontFamily:'Lato-Bold'}}>Logout</Text> */}
              </TouchableOpacity>
              <TouchableOpacity style={{marginHorizontal:10}} onPress={() =>this.synccall()}>
                 <Icon name="md-sync" color='#FFFFFF' size={25}/>  
                {/* <Image transition={false} source={require('../components1/images/sync.png')} style={{height:25,width:25 ,marginHorizontal:20 ,resizeMode:'contain',alignSelf:'center'}} ></Image> */}
                 {/* <Text style={{color:'#1B1BD0',fontSize:14,fontFamily:'Lato-Bold'}}>Logout</Text> */}
              </TouchableOpacity>
              <View style={{height:50,backgroundColor:'#FFFFFF',flexDirection: 'row',backgroundColor:'#1B1BD0',marginHorizontal:130,marginTop:15}}>
            <Image transition={false} source={require('../components1/images/logo_ordo.png')} style={{ marginTop: 10, marginHorizontal: 20,height:50,width:100,resizeMode:"contain" }} ></Image>

             {/* <Text style={{color:'#ffffff', fontSize:36,fontFamily:'Lato-Bold',fontWeight:'bold',height:50,marginTop:15,width:100}}>OrDo</Text> */}
             </View>
              </View>
            <View style={{ backgroundColor: '#FFFFFF', marginTop: 70, height: 1200, alignSelf:'center',width:screenheight}}>
              {commonData.isOrderOpen ? <Card style={{ height: 180, width:width-30, backgroundColor: 'white',alignSelf:'center',justifyContent:'center',borderRadius:20,marginTop:-40 }}>
                <Text style={{alignSelf:'center',justifyContent:'center',textAlign:'center',marginTop:-20,fontFamily:'Lato-Bold',fontSize:22,fontWeight:'700'}}>{this.state.custname}</Text>
                <Text style={{color:'#00AFA5',fontFamily:'Lato-Bold',fontSize:14,width:300,alignSelf:'center',textAlign:'center'}}>{this.state.custaddress}</Text>
                <View style={{ flexDirection: 'row', marginTop: 0, }}>
                  <View style={{flexDirection:'column',width:120,alignItems:'center'}}>
                  <Text style={{  fontSize: 17, color: '#313841', fontFamily:'Lato-Bold',fontWeight:'700' }}>
                  {this.state.TotalAmount}</Text>
                  <Text style={{ color: '#7A7F85', fontSize: 10, fontFamily: 'Lato-Bold' }}>Amount</Text>
  
                    </View>
                    <View style={{flexDirection:'column',width:100,alignItems:'center'}}>
                  <Text style={{  fontFamily:'Lato-Bold', fontSize: 17, color: '#313841',fontWeight:'700'}}>
                    {this.state.items}</Text>
                    <Text style={{ color: '#7A7F85', fontSize: 10, fontFamily: 'Lato-Bold' }}>Total Items</Text>
  
                    </View>
                    <View style={{flexDirection:'column',width:140,alignItems:'center'}}>
                  <Text style={{ fontFamily:'Lato-Bold', color:'#313841', fontSize: 17,fontWeight:'700' }}>
                    {this.state.totalqty}
                  </Text>
                  <Text style={{ color: '#7A7F85', fontSize: 10, fontFamily: 'Lato-Bold' }}>Total Qty</Text>
  
                  </View>
                </View>
                <TouchableOpacity style={{marginHorizontal:10,marginTop:10,height:40,alignSelf:'center',alignItems:'center', width:300}} onPress={() => this.props.navigation.navigate('customer')}>
            <LinearGradient
              colors={['#1B1BD0', '#1B1BD0']}
              style={styles.signIn}>
              <Text style={styles.textSign}>View Items</Text>
              {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}
            </LinearGradient>
          </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => { this.props.navigation.navigate('OrderItem') }} >
                <Image transition={false} source={require('../components1/images/View.png')} style={{height:70,width:350,alignSelf:'center',marginLeft:15}}>
                </Image>
               </TouchableOpacity>  */}
              </Card> :
                // <View style={{ backgroundColor: '#FFFFFF', height: 150, marginTop: -60, width: 330, marginHorizontal: 45 }}>
                //   <Text style={{ color: '#34495A', fontSize: 15, width: 350, marginTop: 20, paddingLeft: 25, paddingRight: 25, textAlign: 'center', fontFamily:'Lato-Bold' }}>{screenwidth}You do not have any order open. Do you wish to create an Order?</Text>
  
                // </View>
                <Card style={{ height: 160, width: width-30, backgroundColor: 'white',alignSelf:'center',justifyContent:'center',borderRadius:20,marginTop:-30 }}>
                <Text style={{alignSelf:'center',justifyContent:'center',textAlign:'center',marginTop:10,fontFamily:'Lato-Bold',fontSize:22,fontWeight:'700'}}>No Active Order</Text>
                <Text style={{color:'#00AFA5',fontFamily:'Lato-Bold',fontSize:14,width:300,alignSelf:'center',textAlign:'center'}}></Text>
                <View style={{ flexDirection: 'row', marginTop: 0, }}>
                  <View style={{flexDirection:'column',width:120,alignItems:'center'}}>
                  <Text style={{  fontSize: 17, color: '#313841', fontFamily:'Lato-Bold',fontWeight:'700' }}>
                  0</Text>
                  <Text style={{ color: '#7A7F85', fontSize: 10, fontFamily: 'Lato-Bold' }}>Amount</Text>
  
                    </View>
                    <View style={{flexDirection:'column',width:100,alignItems:'center'}}>
                  <Text style={{  fontFamily:'Lato-Bold', fontSize: 17, color: '#313841',fontWeight:'700'}}>
                    0</Text>
                    <Text style={{ color: '#7A7F85', fontSize: 10, fontFamily: 'Lato-Bold' }}>Total Items</Text>
  
                    </View>
                    <View style={{flexDirection:'column',width:140,alignItems:'center'}}>
                  <Text style={{ fontFamily:'Lato-Bold', color:'#313841', fontSize: 17,fontWeight:'700' }}>
                    0
                  </Text>
                  <Text style={{ color: '#7A7F85', fontSize: 10, fontFamily: 'Lato-Bold' }}>Total Qty</Text>
  
                  </View>
                </View>
               
                <TouchableOpacity style={{marginHorizontal:10,marginTop:10,height:40,width:300,alignSelf:'center',alignSelf:'center'}}
                onPress={() =>{ this.props.navigation.navigate('customer', { From: 'NEW' ,TYPE:"" }) }}
                >
            <LinearGradient
              colors={['#1B1BD0', '#1B1BD0']}
              style={styles.signIn}>
              <Text style={styles.textSign}>Create an Order</Text>
              {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}
            </LinearGradient>
          </TouchableOpacity>
              </Card>
              }
              <ScrollView style={{height:590}}>
              <View style={{ flexDirection: 'row' ,backgroundColor:'#FFFFFF',alignSelf:'center',justifyContent:'center',marginTop:10}} >
              <Card style={{ height: screenwidth-10, width: screenwidth-10, backgroundColor: 'white',alignSelf:'center',justifyContent:'center',borderRadius:2 }}>
              <TouchableOpacity onPress={() =>{ this.props.navigation.navigate('customer', { From: 'NEW' ,TYPE:"" }) }}>
                 <Image transition={false} source={require('../components1/images/order1.png')} style={{ width: 40, height: 40 ,resizeMode:'stretch',alignSelf:'center',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY' }) }} >
                </Image>
                <Text style  ={{fontFamily:"Lato-Regular",fontWeight:'500',width:screenwidth-10,textAlign:'center'}}>Order</Text>
                </TouchableOpacity>
              </Card>
                {/* <TouchableOpacity onPress={() =>{ this.props.navigation.navigate('customer', { From: 'NEW' ,TYPE:"" }) }}>
                <Image transition={false} source={require('../components1/images/order.png')} style={{ width: screenwidth, height: screenwidth ,resizeMode:'stretch',alignSelf:'center',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY' }) }} >
                </Image>
                </TouchableOpacity> */}
              <Card style={{ height: screenwidth-10, width: screenwidth-10, backgroundColor: 'white',alignSelf:'center',justifyContent:'center',borderRadius:2 }}>
                <TouchableOpacity   onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY',TYPE:"RETURN"  }) }}>
                {/* <Image transition={false} source={require('../components1/images/history1.png')} style={{ width: screenwidth, height: screenwidth ,resizeMode:'stretch',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY' }) }} >
                </Image> */}
                 <Image transition={false} source={require('../components1/images/history1.png')} style={{ width: 40, height: 40 ,resizeMode:'stretch',alignSelf:'center',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY' }) }} >
                </Image>
                <Text style  ={{fontFamily:"Lato-Regular",fontWeight:'500',width:screenwidth-10,textAlign:'center'}}>History</Text>
               
                </TouchableOpacity>
                </Card>
                <Card style={{ height: screenwidth-10, width: screenwidth-10, backgroundColor: 'white',alignSelf:'center',justifyContent:'center',borderRadius:2 }}>
                <TouchableOpacity   onPress={() => { this.props.navigation.navigate('Orderlist') }}>
                {/* <Image transition={false} source={require('../components1/images/history1.png')} style={{ width: screenwidth, height: screenwidth ,resizeMode:'stretch',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY' }) }} >
                </Image> */}
                 <Image transition={false} source={require('../components1/images/completed1.png')} style={{ width: 40, height: 40 ,resizeMode:'stretch',alignSelf:'center',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY' }) }} >
                </Image>
                <Text style  ={{fontFamily:"Lato-Regular",fontWeight:'500',width:screenwidth-10,textAlign:'center'}}>Completed</Text>
               
                </TouchableOpacity>
                </Card>
               
                {/* <TouchableOpacity   onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY',TYPE:"RETURN"  }) }}>
                <Image transition={false} source={require('../components1/images/HistoryImage.png')} style={{ width: screenwidth, height: screenwidth-2 ,resizeMode:'stretch',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY' }) }} >
                </Image>
                </TouchableOpacity> */}
           </View>
              <View style={{ flexDirection: 'row', backgroundColor: '#FFFFFF',alignSelf:'center' }}>
              <Card style={{ height: screenwidth-10, width: screenwidth-10, backgroundColor: 'white',alignSelf:'center',justifyContent:'center',borderRadius:2 }}>
                <TouchableOpacity   onPress={() => { this.props.navigation.navigate('OrderGuide',{ From: '',TYPE:"PROMOTIONS"  }) }}>
                {/* <Image transition={false} source={require('../components1/images/history1.png')} style={{ width: screenwidth, height: screenwidth ,resizeMode:'stretch',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY' }) }} >
                </Image> */}
                 <Image transition={false} source={require('../components1/images/promotions1.png')} style={{ width: 40, height: 40 ,resizeMode:'stretch',alignSelf:'center',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY' }) }} >
                </Image>
                <Text style  ={{fontFamily:"Lato-Regular",fontWeight:'500',width:screenwidth-10,textAlign:'center'}}>Promotions</Text>
               
                </TouchableOpacity>
                </Card>
                <Card style={{ height: screenwidth-10, width: screenwidth-10, backgroundColor: 'white',alignSelf:'center',justifyContent:'center',borderRadius:2 }}>
                <TouchableOpacity   >
                {/* <Image transition={false} source={require('../components1/images/history1.png')} style={{ width: screenwidth, height: screenwidth ,resizeMode:'stretch',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY' }) }} >
                </Image> */}
                 <Image transition={false} source={require('../components1/images/inventory1.png')} style={{ width: 40, height: 40 ,resizeMode:'stretch',alignSelf:'center',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY' }) }} >
                </Image>
                <Text style  ={{fontFamily:"Lato-Regular",fontWeight:'500',width:screenwidth-10,textAlign:'center'}}>Inventory</Text>
               
                </TouchableOpacity>
                </Card>
                <Card style={{ height: screenwidth-10, width: screenwidth-10, backgroundColor: 'white',alignSelf:'center',justifyContent:'center',borderRadius:2 }}>
                <TouchableOpacity    onPress={() => { this.props.navigation.navigate('customer', { From: 'RETURN',TYPE:"RETURN"  }) }}>
                {/* <Image transition={false} source={require('../components1/images/history1.png')} style={{ width: screenwidth, height: screenwidth ,resizeMode:'stretch',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY' }) }} >
                </Image> */}
                 <Image transition={false} source={require('../components1/images/return1.png')} style={{ width: 40, height: 40 ,resizeMode:'stretch',alignSelf:'center',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY' }) }} >
                </Image>
                <Text style  ={{fontFamily:"Lato-Regular",fontWeight:'500',width:screenwidth-10,textAlign:'center'}}>Return</Text>
               
                </TouchableOpacity>
                </Card>
              {/* <TouchableOpacity   onPress={() => { this.props.navigation.navigate('Orderlist') }}>
              <Image transition={false} source={require('../components1/images/complted.png')} style={{ width: screenwidth, height: screenwidth ,resizeMode:'stretch',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY' }) }} >
               
              </Image>
              </TouchableOpacity>
          */}
              {/* <TouchableOpacity  onPress={() => { this.props.navigation.navigate('unsentscreen') }} >
              <Image transition={false} source={require('../components1/images/pending.png')} style={{ width: screenwidth, height: screenwidth-5 ,resizeMode:'stretch',marginTop:2}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY' }) }} >
               
              </Image>
              </TouchableOpacity>
              <TouchableOpacity   onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY',TYPE:"RETURN"  }) }}>
                <Image transition={false} source={require('../components1/images/HistoryImage.png')} style={{ width: screenwidth, height: screenwidth-5 ,resizeMode:'stretch',marginTop:2}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY' }) }} >
                 
                </Image>
                </TouchableOpacity> */}
           
          </View>
          <View style={{ flexDirection: 'row', backgroundColor: '#FFFFFF',alignSelf:'center' }}>
              {/* <TouchableOpacity    onPress={() => { this.props.navigation.navigate('customer', { From: 'NEW',TYPE:"RETURN" }) }}>
              <Image transition={false} source={require('../components1/images/returnorder.png')} style={{ width: screenwidth, height: screenwidth-10 ,resizeMode:'stretch',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY' }) }} >
               
              </Image>
              </TouchableOpacity>
         
              <TouchableOpacity  onPress={() => { this.props.navigation.navigate('OrderGuidelist') }} >
              <Image transition={false} source={require('../components1/images/inventory.png')} style={{ width: screenwidth, height: screenwidth-10 ,resizeMode:'stretch',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('OrderGuide') }} >
               
              </Image>
              </TouchableOpacity>

              <TouchableOpacity   onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY',TYPE:"RETURN"  }) }}>
                <Image transition={false} source={require('../components1/images/HistoryImage.png')} style={{ width: screenwidth, height: screenwidth-10 ,resizeMode:'stretch',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY' }) }} >
                 
                </Image>
                </TouchableOpacity> */}
                 <Card style={{ height: screenwidth-10, width: screenwidth-10, backgroundColor: 'white',alignSelf:'center',justifyContent:'center',borderRadius:2 }}>
                <TouchableOpacity onPress={() => { this.props.navigation.navigate('OrderGuide',{ From: '',TYPE:"PREBOOKINGS"  }) }}>
                {/* <Image transition={false} source={require('../components1/images/history1.png')} style={{ width: screenwidth, height: screenwidth ,resizeMode:'stretch',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY' }) }} >
                </Image> */}
                 <Image transition={false} source={require('../components1/images/prebookings.png')} style={{ width: 40, height: 40 ,resizeMode:'stretch',alignSelf:'center',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY' }) }} >
                </Image>
                <Text style  ={{fontFamily:"Lato-Regular",fontWeight:'500',width:screenwidth-10,textAlign:'center'}}>Pre-bookings</Text>
               
                </TouchableOpacity>
                </Card>
                <Card style={{ height: screenwidth-10, width: screenwidth-10, backgroundColor: 'white',alignSelf:'center',justifyContent:'center',borderRadius:2 }}>
                <TouchableOpacity   onPress={() => { this.props.navigation.navigate('unsentscreen') }}>
                {/* <Image transition={false} source={require('../components1/images/history1.png')} style={{ width: screenwidth, height: screenwidth ,resizeMode:'stretch',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY' }) }} >
                </Image> */}
                 <Image transition={false} source={require('../components1/images/Pending1.png')} style={{ width: 40, height: 40 ,resizeMode:'stretch',alignSelf:'center',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY' }) }} >
                </Image>
                <Text style  ={{fontFamily:"Lato-Regular",fontWeight:'500',width:screenwidth-10,textAlign:'center'}}>Pending</Text>
               
                </TouchableOpacity>
                </Card>
                <Card style={{ height: screenwidth-10, width: screenwidth-10, backgroundColor: 'white',alignSelf:'center',justifyContent:'center',borderRadius:2 }}>
                <TouchableOpacity >
                {/* <Icon name="md-settings" color='#FFFFFF' size={25}/>   */}
                {/* <Image transition={false} source={require('../components1/images/history1.png')} style={{ width: screenwidth, height: screenwidth ,resizeMode:'stretch',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY' }) }} >
                </Image> */}
                 <Image transition={false} source={require('../components1/images/more.png')} style={{ width: 40, height: 40 ,resizeMode:'stretch',alignSelf:'center',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY' }) }} >
                </Image> 

                <Text style  ={{fontFamily:"Lato-Regular",fontWeight:'500',width:screenwidth-10,textAlign:'center'}}>More</Text>
               
                </TouchableOpacity>
                </Card>
         
          </View>
          <TextTicker
          style={{ fontSize: 14, fontFamily:"Lato-Regular" }}
          duration={3000}
          loop
          bounce
          repeatSpacer={50}
          marqueeDelay={1000}
        >
          Super long piece of text is long. The quick brown fox jumps over the lazy dog.
        </TextTicker>
        
             </ScrollView>
             {/* <View style={styles.container}></View> */}
           
            </View>
          </View>
          
      </SafeAreaView>
  
    );
  
  }
  






}

const styles = StyleSheet.create({
cardContainer: {
  marginTop: 10,
  overflow: 'hidden',
  height: 100,
  width: 150,
  borderRadius: 10,
  backgroundColor: 'red',
  marginHorizontal: 5,
  elevation: 3,
  marginVertical: 10,

  shadowOffset: { width: 0, height: 0 },
  shadowRadius: 2,
  shadowOpacity: 0.4
},
DashBoardArrayViewContainer: {
  width: Dimensions.get('window').width / 3,
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  margin: 1,
  color:'red',
  backgroundColor:'white',
},
DashBoardIconView: {
    height: 30,
    width: 30
  },
  DashBoardTextView: {
    fontSize: 12,
    paddingHorizontal: 1,
    marginTop: 5,
    // fontFamily: Fonts.Poppins,
  },
shadowStyle: {
  marginTop: 10,
  overflow: 'hidden',
  height: 35,
  width: 100,
  borderRadius: 10,
  backgroundColor: 'red',
  marginHorizontal: 5,
  elevation: 3,
  marginVertical: 20,
  shadowColor: 'red',
  shadowOffset: { width: 80, height: 80 },
  shadowRadius: 10,
  shadowOpacity: 0.8,
  alignItems: 'center'
},
input: {
  width: 200,
  color: '#534F64',
  alignSelf: "center",
  marginTop: 10
},
submitButton: {
  padding: 10,
  margin: 15,
  height: 60,
},
container: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#ecf0f1',
  marginTop: 30
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
  padding: 100
},
text: {
  color: '#3f2949',
  marginTop: 10
},
textOrder: {
  color: '#00ACEA',
  fontSize: 27,
  marginHorizontal: -25,
  fontWeight: 'bold'
  // fontWeight:'bold'

},
textPrime: {
  color: '#34495A',
  fontSize: 27,
  marginHorizontal: 27,
  fontWeight: 'bold'
  // fontWeight:'bold'
},
RunningText: {
  color: '#DCDCDE',
  fontSize: 17,
  fontWeight: 'bold'
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
  fontFamily:'Lato-Bold',

  // Set border Radius.
  borderRadius: 25,

  //Set background color of Text Input.
  backgroundColor: "#00ACEA",
  fontFamily: 'Lato-Bold'
},
MainContainer: {

  flex: 1,
  paddingTop: 30,
  justifyContent: 'center',
  alignItems: 'center'

},

LinearGradientStyle: {
  height: 100,
  paddingLeft: 15,
  paddingRight: 15,
  borderRadius: 5,
  marginBottom: 20,
  borderEndColor: 'black',
  backgroundColor: 'red'
},
signIn: {
  width: 300,
  height: 40,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 10,
  flexDirection: 'row',
  alignSelf:'center'

},
textSign: {
    color: 'white',
    fontWeight: 'bold',
  },
buttonText: {
  fontSize: 18,
  textAlign: 'center',
  margin: 7,
  color: '#fff',
  backgroundColor: 'transparent'

},
button: {
  shadowColor: 'rgba(0,0,0, 1.0)', // IOS
  shadowOffset: { height: 10, width: 0 }, // IOS
  shadowOpacity: 0.53, // IOS
  shadowRadius: 13.97, //IOS
  backgroundColor: '#fff',
  elevation: 21, // Android
  height: 50,
  width: 100,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
},
});
export default withNavigation(HomeTab);