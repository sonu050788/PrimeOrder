



import React, { Component } from 'react';
import Carousel from 'react-native-banner-carousel';
import { Text, View,Dimensions, FlatList,ActivityIndicator, Modal,TextInput,StyleSheet,AsyncStorage, Button, AppRegistry, ScrollView, Linking, Alert, TouchableOpacity, Image, TouchableNativeFeedbackBase } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { ItemArrayAdded } from '../components1/SKU'
import CommonDataManager from './CommonDataManager';
import { Card, Row } from 'native-base'
import { withNavigation } from "react-navigation";
import NetInfo from "@react-native-community/netinfo";
var RNFS = require('react-native-fs');
const{height}=Dimensions.get("window");
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons'; 
import TextTicker from 'react-native-text-ticker'
let commonData = CommonDataManager.getInstance();
// import HSNZ from "react-native-marquee";
//FB#24
let screenwidth= Dimensions.get('window').width;
let screenheight= Dimensions.get('window').height;
const BannerWidth = screenwidth-20;
const BannerHeight = screenheight/4-20;
const{width}=Dimensions.get("screen")
const connection_error='Could not Sync With the Server.Try again later'
let connnctionFailed=false
const Constants = require('../components1/Constants');
if(screenwidth>375){
  screenwidth=120;
}else{
 screenwidth=110;
}
import Map from "./Map";
 class MyDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
  arrayHolder:[{target:"40",from:"29/06/2022",to:"22/07/2022",status:"COMPLETED",Achieved:"34",bgcolor:"#FFC0CB"},{target:"40",from:"29/06/2022",to:"22/07/2022",status:"COMPLETED",Achieved:"40",bgcolor:'#C3FDB8'},{target:"90",from:"29/06/2022",to:"22/07/2022",status:"COMPLETED",Achieved:"34",bgcolor:'#43C6DB'}],
  refresh:true,
  loading:false,
    }
  }
   async reset(){
    await AsyncStorage.removeItem('isLogin')
    await AsyncStorage.removeItem('Username')

   }
   getcolorcode=(value)=>{
    let PINK="#CD1422";
    let BLUE="#2514CD";
    let GREEN="#1E8449";
    let ORANGE="#FF5733";
     let colorcode=PINK;
     if(value>100)
     colorcode=BLUE;
     else if(value==100)
     colorcode=GREEN;
     else if(value>50 && value<100)
     colorcode=ORANGE;
     return colorcode;
   }
   componentWillMount(){
    async function requestLocationPermission() {
      try {
        const granted = await PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          'title': 'Ordo App Permission',
          'message': 'Ordo App needs access to your Location '
        }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.forceUpdate();
          
        } else {

          Alert.alert("Location permission denied");

        }
       } catch (err) {
        // alert("Location permission err", err);
        console.warn(err);
      }
    }
    requestLocationPermission();
    this.setState({loading:true});
    this.getDashboardDetails();
   }
  logout=()=>{
    this.reset();
    commonData.setusername('')
    this.forceUpdate();
   
    this.props.navigation.navigate("LoginScreen")  
  }
  getstatusfor=(value)=>{
    console.log(value,"value");
    value=value*100;
    let status="Follow up"
    if(value>100)
    status="Excellent";
    else if(value==100)
    status="Achieved";
    else if(value>50 && value<100)
    status="Not Achieved"
    return status;
  }
  SignItemsView = ({ item, index }) => (
    <View style={styles.flatliststyle1}>  
      <View style={{ flexDirection: "row", borderRadius:4, width:width-60 ,justifyContent:'center',alignItems:'center', backgroundColor:"#ffffff",alignSelf:'center' ,height:45,shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.5, marginHorizontal:5,
  shadowRadius: 2,borderRadius:10,
  elevation: 4 }} >
      <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'200',fontFamily:'Lato-Bold',fontSize:11, width:(width-60)/3,textAlign:'left'}}>{item.mothdate}</Text>
       <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'200',fontFamily:'Lato-Bold',fontSize:11,width:(width-60)/4,textAlign:'center'}}>{item.Achieved}/{item.target}</Text>
       <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'200',fontFamily:'Lato-Bold',textAlign:'center',fontSize:11,width:(width-60)/3,color:this.getcolorcode(Number(item.Achieved)/Number(item.target)*100)}}>{item.status}</Text>
     
       {/* <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'200',fontFamily:'Lato-Bold',fontSize:12, width:(width-60)/3,marginHorizontal:20}}>{item.mothdate}</Text>
       <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',textAlign:'center',fontWeight:'200',fontFamily:'Lato-Bold',fontSize:12,width:(width-60)/4,marginHorizontal:2}}>{item.Achieved}/{item.target}</Text>
       <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'200',fontFamily:'Lato-Bold',fontSize:12,width:(width-60)/3,marginHorizontal:2,color:this.getcolorcode(Number(item.Achieved)/Number(item.target)*100)}}>{item.status}</Text> */}

      </View>
    </View>
     
    )
    getmonth=(dateval)=>{
     
      let date = new Date(dateval); // 2020-06-21.
      let longMonth = date.toLocaleString('en-us', { month: 'long' }); /* June */
      let year = dateval.split("-")[0]
      let month =longMonth.split(" ")[1]
      console.log("Date&&**********",longMonth);
      return longMonth+"-"+year;
    }
    getDashboardDetails=()=>{
      var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
let uname = commonData.getusername();
var raw = JSON.stringify({"__module_code__":"PO_15","__query__":"assigned_sales_rep='"+uname+"'","__order_by__":"valid_to DESC"});
var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://143.110.178.47/primeorder/get_data_s.php", requestOptions)
  .then(response => response.json())
  .then(result => {console.log(result,"_)))))))))))))))))))))))_))");
    let temparray=[];
    let arrayHolder=[];

    for(let i=0;i<result.entry_list.length;i++){
      if(i==3)break;
      let Achieved=result.entry_list[i].name_value_list.achieved.value;
      let targetscore=result.entry_list[i].name_value_list.target_score.value;
      let score=Achieved/targetscore;
      temparray.push({target:result.entry_list[i].name_value_list.target_score.value,from:result.entry_list[i].name_value_list.valid_from.value,to:result.entry_list[i].name_value_list.valid_to.value,status:this.getstatusfor(Number(score)),Achieved:result.entry_list[i].name_value_list.achieved.value,bgcolor:this.getcolorcode(Number(targetscore)-Number(Achieved)),mothdate:this.getmonth(result.entry_list[i].name_value_list.valid_from.value)});
    }
  this.setState({arrayHolder:temparray,loading:false});
  this.forceUpdate();
  })
  .catch(error => console.log('error', error));

    }
  render() {
    let PINK="#CD1422";
    let BLUE="#2514CD";
    let GREEN="#1E8449";
    let ORANGE="#FF5733";
   if(this.state.loading==true){
     return(  <View style={{ flex: 1,justifyContent:'center', backgroundColor:'#FFFFFF'}}>
     <ActivityIndicator
            animating = {true}
            color = {'#1B1BD0'}
            size = "large"/>
          
     <Text style={{alignSelf:'center',color:'#21283d'}}> Loading,Please wait</Text>
      </View>);
   }
   
    return (
      <SafeAreaView>
      <View style={{ backgroundColor: '#ffffff' }}>
        
           {/* <View style={{width:width-20, alignItems:'flex-end',flexDirection:'row-reverse',backgroundColor:'#ffffff'}}> */}
          
            
            {/* <View style={{height:50,backgroundColor:'#000000',marginTop:5,width:width-20,alignItems:'center'}}> */}
          <Image transition={false} source={require('../components1/images/OrDo.png')} style={{ marginTop: 10,height:50,width:100,resizeMode:"cover" ,alignSelf:'center'}} ></Image>
           {/* </View> */}
           <View style={{flexDirection:'row',marginTop:0}}>
        <TouchableOpacity style={{borderRadius:20, height:60,width:width/3-20, justifyContent:'center', alignItems:'center' }} onPress={()=>this.props.navigation.goBack()}>           
                 <Image transition={false} source={require('../components1/images/arrow.png')} style={{height:35,width:35,  resizeMode:"contain", alignSelf:'center'}} />
          </TouchableOpacity> 
          <Text style={{width:width/2-10,alignSelf:'center',textAlign:'center',fontFamily:'Lato-Bold',fontSize:20}}>My Insights<Text style={{fontFamily:"Lato-Bold",fontSize:12}}>{"\n"}(Sales Dashboard)</Text></Text>

          </View>
        <View style={{marginTop:0,height:screenheight/2+2,flexDirection:'column',backgroundColor:'#ffffff',alignSelf:'center',width:width-20,alignSelf:'center',alignItems:'center'
 }}>
               <View style={{padding:10, flexDirection: 'row' ,backgroundColor:'#FFFFFF',alignSelf:'center',alignitems:'space-between',justifyContent:'space-between'}} >
               <View style={styles.recoredbuttonStyle}>
                  {/* <TouchableOpacity onPress={() =>{ this.props.navigation.navigate('customer', { From: 'NEW' ,TYPE:"NEW" }) }}> */}
                  {/* <Image transition={false} source={require('../components1/images/order1.png')} style={{ width: 30, height: 30 ,resizeMode:'stretch',alignSelf:'center',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'NEW' }) }} >
                  </Image> */}
                  <Text style  ={{fontFamily:"Lato-Bold",height:(screenwidth-15)/2+10,textAlignVertical:'center',fontSize:36,color:'#1B1BD0',textAlignVertical:'center',width:screenwidth-40, alignSelf:'center',textAlign:'left'}}>0</Text>
                  <Text style  ={{fontFamily:"Lato-Bold",fontSize:13,color:'#707070',width:screenwidth-40,alignSelf:'center',textAlign:'left'}}>Pending Deliveries</Text>
                  {/* </TouchableOpacity> */}
               </View>
               <View style={styles.recoredbuttonStyle}>
                 {/* <TouchableOpacity    onPress={() => { this.props.navigation.navigate('customer', { From: 'RETURN',TYPE:"RETURN"  }) }}> */}
                  {/* <Image transition={false} source={require('../components1/images/return1.png')} style={{ width: 30, height: 30 ,resizeMode:'stretch',alignSelf:'center',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'RT' }) }} >
                 </Image> */}
                <Text style  ={{fontFamily:"Lato-Bold",height:(screenwidth-15)/2+10,textAlignVertical:'center',fontSize:36,color:'#1B1BD0',width:screenwidth-40, alignSelf:'center',textAlign:'left'}}>{commonData.getpendingcount()}</Text>
                 <Text style  ={{fontFamily:"Lato-Bold",fontSize:13,color:'#707070',width:screenwidth-40,alignSelf:'center',textAlign:'left'}}>Pending Orders</Text>
                 {/* </TouchableOpacity> */}
                
                </View>
                <View style={styles.recoredbuttonStyle}>
                 
                {/* <TouchableOpacity onPress={() => { this.props.navigation.navigate('customer',{ From: 'OG',TYPE:"OG"  }) }}>                 */}
                 {/* <Image transition={false} source={require('../components1/images/prebookings.png')} style={{ width: 30, height: 30 ,resizeMode:'stretch',alignSelf:'center',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'OG' }) }} >
                 </Image> */}
                  <Text style  ={{fontFamily:"Lato-Bold",fontSize:36,textAlignVertical:'center',height:(screenwidth-15)/2+10,color:'#1B1BD0',width:screenwidth-40, alignSelf:'center',textAlign:'left'}}>{commonData.getordderssArray().length}</Text>
                 <Text style  ={{fontFamily:"Lato-Bold",color:'#707070',fontSize:13,width:screenwidth-40,alignSelf:'center',textAlign:'left'}}>Completed Orders</Text>
                 {/* </TouchableOpacity> */}
                </View>
            </View>
            <View style={{ flexDirection: 'row', backgroundColor: '#FFFFFF',alignSelf:'center' ,marginTop:0}}>
               <View style={styles.recoredbuttonStyle}>
               {/* <Text style={{backgroundColor:"#c94c4c",color:'white',width:20,height:20,borderRadius:10,textAlign:'center',marginHorizontal:(screenwidth-25),marginTop:-32,fontSize:8,fontFamily:'Lato-Regular',textAlignVertical:'center'}}>{commonData.getUnsentOrders().length>100?commonData.getUnsentOrders().length:"100+"}</Text> */}

               {/* <TouchableOpacity   onPress={() => { this.props.navigation.navigate('unsentscreen') }}> */}
                  {/* <Image transition={false} source={require('../components1/images/Pending1.png')} style={{ width: 30, height: 30 ,resizeMode:'stretch',alignSelf:'center',marginTop:-1}}   >
                 </Image> */}
                <Text style  ={{fontFamily:"Lato-Bold",fontSize:36,textAlignVertical:'center',height:(screenwidth-15)/2+10,color:'#1B1BD0',width:screenwidth-40, alignSelf:'center',textAlign:'left'}}>0</Text>
                 <Text style  ={{fontFamily:"Lato-Bold",fontSize:13,color:'#707070',width:screenwidth-40,alignSelf:'center',textAlign:'left'}}>Completed Deliveries</Text>
                 {/* </TouchableOpacity> */}
                
              </View>
              <View style={styles.recoredbuttonStyle}>
              {/* <Text style={{backgroundColor:"#c94c4c",color:'white',width:20,height:20,borderRadius:10,textAlign:'center',marginHorizontal:(screenwidth-25),marginTop:-32,fontSize:8,fontFamily:'Lato-Regular',textAlignVertical:'center'}}>{commonData.getordderssArray().length>100?commonData.getorderitemArray().length:"100+"}</Text> */}

              {/* <TouchableOpacity   onPress={() => { this.props.navigation.navigate('Orderlist') }}> */}
                  {/* <Image transition={false} source={require('../components1/images/completed1.png')} style={{ width: 30, height: 30 ,resizeMode:'stretch',alignSelf:'center',marginTop:-1}}   >
                  </Image> */}
                  <Text style  ={{fontFamily:"Lato-Bold",fontSize:36,textAlignVertical:'center',height:(screenwidth-15)/2+10,color:'#1B1BD0',width:screenwidth-40, alignSelf:'center',textAlign:'left'}}>0</Text>
                  <Text style  ={{fontFamily:"Lato-Bold",fontSize:13,color:'#707070',width:screenwidth-40,alignSelf:'center',textAlign:'left'}}>Credit Holds</Text>
                  {/* </TouchableOpacity> */}
               
              </View>           
              <View style={styles.recoredbuttonStyle}>
              {/* <TouchableOpacity   onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY',TYPE:"HISTORY"  }) }}> */}
                  {/* <Image transition={false} source={require('../components1/images/history1.png')} style={{ width: 30, height: 30 ,resizeMode:'stretch',alignSelf:'center',marginTop:-1}}   >
                  </Image> */}
                  <Text style  ={{fontFamily:"Lato-Bold",fontSize:36,textAlignVertical:'center',height:(screenwidth-15)/2+10,color:'#1B1BD0',width:screenwidth-40, alignSelf:'center',textAlign:'left'}}>0</Text>
                  <Text style  ={{fontFamily:"Lato-Bold",fontSize:13,color:'#707070',width:screenwidth-40,alignSelf:'center',textAlign:'left'}}>Scheduled Deliveries</Text>
                  {/* </TouchableOpacity> */}
                 </View>
              
         </View>
         <View style={{ flexDirection: 'column', backgroundColor: '#FFFFFF',alignSelf:'center' ,marginTop:10}}>
         <Text style={{width:width-60,marginTop:10,alignSelf:'center',fontFamily:'Lato-Bold'}}>Targets vs Achievements (3 months)</Text>
         {/* <View style={{height:20,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
          <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'200',fontFamily:'Lato-Bold',fontSize:12, width:40,marginHorizontal:20}}>Target</Text>
       <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'200',fontFamily:'Lato-Bold',fontSize:12,width:60,marginHorizontal:2}}>Achieved</Text>
       <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'200',fontFamily:'Lato-Bold',fontSize:12,width:100,marginHorizontal:2}}>Status</Text>
       </View>
              */}
         <View style={styles.targetviewstyle}>
         <View style={{height:40,marginTop:-10,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#ffffff',width:width-60,alignSelf:'center',shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.5, marginHorizontal:5,
  shadowRadius: 2,borderRadius:10,
  elevation: 4 }}>
          <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'bold',fontFamily:'Lato-Bold',fontSize:11, width:(width-60)/3,textAlign:'left',color:'#1B1BD0'}}>Month-Year</Text>
       <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'bold',fontFamily:'Lato-Bold',fontSize:11,width:(width-60)/4,textAlign:'center',color:'#1B1BD0'}}>Target {"\n"}vs{"\n"} Achievements</Text>
       <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'bold',fontFamily:'Lato-Bold',textAlign:'center',fontSize:11,width:(width-60)/3,color:'#1B1BD0'}}>Status</Text>
       </View>
             
              
              {/* <ScrollView style={{ backgroundColor: '#FFFFFF',flexGrow:1,marginTop:10}} 
                scrollEnabled={true}
                onContentSizeChange={this.onContentSizeChange}> */}
                {/* <View style={{flexGrow:1,width:width-70,alignSelf:'center',justifyContent:"space-between",backgroundColor: 'red', width: width-20, 
  height: (height/3)-120}}> */}
          <FlatList
                    style={{marginTop:10}}
                        data={this.state.arrayHolder}
                        renderItem={this.SignItemsView}
                        extraData={this.state.refresh}
                        keyExtractor={(item, index) => toString(index,item)}
                        ItemSeparatorComponent={this.renderSeparator} 
                    />
                    {/* </View> */}
                {/* </ScrollView> */}
             
        </View>
      
        <View style={{flexDirection:'column',width:width-60,backgroundColor:'#ffffff',height:60,alignSelf:'center',marginTop:5}}> 
        <View style={{flexDirection:'row'}}><Text style={{height:20,width:170,fontFamily:"Lato-Regular"}}>Progress {">"}100%</Text><Text style={{width:15,height:15,backgroundColor:BLUE,marginHorizontal:10}}></Text></View>
        <View style={{flexDirection:'row'}}><Text style={{height:20,width:170,fontFamily:"Lato-Regular"}}>Progress 100%</Text><Text style={{width:15,height:15,backgroundColor:GREEN,marginHorizontal:10}}></Text></View>
        <View style={{flexDirection:'row'}}><Text style={{height:20,width:170,fontFamily:"Lato-Regular"}}>Progress 50%-99%</Text><Text style={{width:15,height:15,backgroundColor:ORANGE,marginHorizontal:10}}></Text></View>
        <View style={{flexDirection:'row'}}><Text style={{height:20,width:170,fontFamily:"Lato-Regular"}}>Progress {"<"}50%</Text><Text style={{width:15,height:15,backgroundColor:PINK,marginHorizontal:10}}></Text></View>

          {/* <Text style={{height:10}}>Progress 0-70</Text> <Text style={{height:10, width:10}}></Text> */}
          {/* <Text style={{height:10}}>Progress 71-99</Text> <Text style={{height:10,width}}></Text> */}
          {/* <Text style={{height:10}}>Progress Above 99</Text> <Text style={{height:10,width:10}}></Text> */}
        </View>
        </View>
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
    marginTop: 10,
    fontFamily:'Lato-Bold'
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
    alignSelf:'center',marginTop:-10,
    borderRadius:4, 
    shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.5, marginHorizontal:5,
  shadowRadius: 2,
  elevation: 4 ,
  fontFamily:'Lato-Bold'
  },
  textSign: {
      color: '#1B1BD0',
      fontFamily:"Lato-Bold",
      fontWeight: 'bold',
      backgroundColor:'white'
      
    },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    margin: 7,
    color: '#fff',
    backgroundColor: 'transparent'
  
  },
  badgeStyle: { 
    position: 'absolute',
    top: -4,
    right: -4 
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
  recoredbuttonStyle:{
    borderRadius:4, 
    shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.5, marginHorizontal:5,
  shadowRadius: 2,
  elevation: 4 ,
  height: screenwidth-15, 
  width: screenwidth-15,
   backgroundColor: 'white',
   alignSelf:'center',
  //  justifyContent:'center',
   borderRadius:15 
  }, targetviewstyle:{
  //   borderRadius:4, 
  //   shadowColor: '#000',
  // shadowOffset: { width: 0, height: 2 },
  // shadowOpacity: 0.5, marginHorizontal:5,
  // shadowRadius: 2,
  // elevation: 4 ,
  marginTop:20,
  width: width-20, 
  height: (height/3)-40,
   backgroundColor: 'white',
   alignSelf:'center',
  //  justifyContent:'center',
   borderRadius:15 
  },
  flatliststyle1: {
      
    height: 50,
    // padding:10,
    alignContent:'center',
    width: width -20,
    // backgroundColor: 'red',
    alignSelf: 'center',
    resizeMode: "contain",
    
  },
  });
export default MyDashboard;