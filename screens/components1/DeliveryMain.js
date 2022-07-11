import React from "react";
import { Component } from "react";
import { View,FlatList,Alert,ImageBackground,SafeAreaView,Text,StyleSheet ,Dimensions,Image,TouchableOpacity,ActivityIndicator,ScrollView} from "react-native";
import { Card } from "native-base";
import Icon from 'react-native-vector-icons/Ionicons'; 
const{height}=Dimensions.get("window");
const {width}=Dimensions.get("screen")
import CommonDataManager from './CommonDataManager';
let commonData = CommonDataManager.getInstance();
const Constants = require('../components1/Constants');
const GET_DATAURL=Constants.GET_URL;
import {ScrollableTabView} from '@valdio/react-native-scrollable-tabview'
import Timeline from 'react-native-timeline-flatlist'
import Toast from 'react-native-simple-toast';
function uniqueByKey(array, key) {
  return [...new Map(array.map((x) => [x[key], x])).values()];
}
class DeliveryMain extends Component{
   constructor(props) {
      super(props);
      this.renderDetail = this.renderDetail.bind(this)

    this.data = [],
      this.state={
         pastorders:[],
         pendingorders:[],
         isLoading:false,
         ispastdeliverypressed:false,
         isprevdeliveryPressed:false,
         screenHeight:height,
         loadingorders:false
      }
   }
    //execute callback in order to stop the refresh animation. 
  _onRefresh = (callback) => {
   // networkRequest().then(response => callback(response))    
   this.getpendingOrders();
 } 
 gettotalitems=(custid,array)=>{
   var count=0;
   for(var i=0;i<array.length;i++){
     if(array[i].customerid==custid)
     count++;
   }
   return count;
 }
   getpendingOrders(){
      // "__query__": "username='"+variable+"'",
      let variable=commonData.getusername();
      var that = this;
      that.setState({ isLoading: true,loadingorders:true });
      fetch(GET_DATAURL, {
        method: "POST",
        body: JSON.stringify({
          "__module_code__": "PO_14",
          "__query__": "",
          "__delete__": 0,
        })
      }).then(function (response) {
        return response.json();
      }).then(function (result) {
        
       let  orderArray = result.entry_list;
       var json = JSON.stringify(orderArray);
       let tempArray = commonData.gettypeArray(json,'PO_14')
       console.log("tempArray",tempArray);
       let pendingarray=tempArray.filter(item=>item.orderstatus=="SENT");
       let pastarray=tempArray.filter(item=>item.orderstatus=="DELIVERED");
       console.log("pending",pendingarray);
       console.log("*********************************************************");
      
       var ordertemparray=[];
       const unique = [...new Set(pendingarray.map(item => item.customerid))];
        console.log(unique,"past");
        let counter =0;
       for(var i=0;i<unique.length;i++){
         var count=0;
        pendingarray.map(item=>{if(item.customerid==unique[i]) count++})
        ordertemparray.push({"time":i,title:unique[i],description:"Total Orders: "+count,lineColor:'#009688',icon: require('../components1/images/Customerimages/cust1.png'),imageUrl:""})

       }

       that.data=[];
       that.data=[...ordertemparray];
       
        that.setState({
          isLoading: false,
          pendingorders:pendingarray,
          pastorders:pastarray,
          loadingorders:false
        });
       
        Toast.show('Orders Loaded', Toast.LONG)
      }).catch(function (error) {
        console.log("-------- error ------- " + error);
      });
      that.forceUpdate();
   }
   
   gotoOrderItemScreen(item){
   
      this.getOrderItemListCall(item.orderid,item.orderstatus);
     
    
  }
  async getOrderItemListCall(oid,status) {
  var that = this;
  // that.makeRemoteRequest();
  that.state.isLoading=true;

  const FETCH_TIMEOUT = 1000;
  let didTimeOut = false;
  
fetch(GET_DATAURL, { 
  method: "POST",
           body: JSON.stringify({
             __module_code__: "PO_08",
             __query__:"po_orderitems.orderid='"+ oid+"' && quantity>0",
               __offset__:0,
           })
  
}).then(function (response) {
return response.json();   
}).then(function (result) {

that.props.navigation.navigate('ItemInvoice',{orderid:oid,code:'OD'})

});
}
   sampleRenderItem = ({ item }) => (
      
      <TouchableOpacity onPress={()=>this.gotoOrderItemScreen(item)}>  
  <View style={styles.flatliststyle}>
  <ImageBackground source={require('../components1/images/itembg.png')} style={styles.flatrecord}>
    <View style={{flexDirection:'row'}}>
    <View style={{flexDirection:"row", width:70}}>
            <TouchableOpacity style={{height: 180, width: 60,marginTop:20,marginHorizontal:45}}>
                <Image transition={false} source={require('../components1/images/right.png')} style={{ height: 40, width: 40, marginTop: 30,marginHorizontal:25, resizeMode: 'contain' }} />
            </TouchableOpacity>
            
            <Text  style={{color:'#1B1BD0',fontFamily:'Lato-Regular',fontSize:10,marginTop:100,marginHorizontal:-90,width:60,textAlign:'center'}}>{item.orderstatus}</Text>
            <Image transition={false} source={require('./images/line.png')} style={{ height: 100, width: 60, marginTop: 33,marginHorizontal:68, resizeMode: 'contain' }} />
            </View>
            <View style={{marginHorizontal:80}}>
              {(item.orderid!=undefined)?
            <Text style={{marginHorizontal:-10,marginTop:30,fontSize:15, color: '#34495A',fontFamily:'Lato-Bold',fontSize:17}}>{item.orderid.substring(1, 8)}</Text>:
             <Text style={{marginHorizontal:-10,marginTop:30,fontSize:15, color: '#34495A',fontFamily:'Lato-Bold',fontSize:17}}></Text>}
            <Image transition={false} source={require('../components1/images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain',marginHorizontal:-10 }} />

    {/* <Text style={{marginHorizontal:-10, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12}}>₹{(item.value).split('.')[0]}.{(item.value).split('.')[1].substring(1, 2)}</Text> */}
    <Text style={{marginHorizontal:-10, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12,marginTop:-20}}></Text>
    <Text style={{marginHorizontal:-10, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12,marginTop:0}}>{item.last_modified}</Text>
     
   
      <Text style={{marginHorizontal:-10, color: '#1B1BD0',fontFamily:'Lato-Bold',fontSize:14,marginTop:0}}>{item.customerid}</Text>
      <View style={{flexDirection:'row'}}>
      <Text style={{marginHorizontal:-10, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12}}>Total SKUs: {item.totalitems}</Text>
      <Text style={{marginHorizontal:30, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12}}>Total price: {item.totalvalue}</Text>
      </View>
    </View>

    </View>
 </ImageBackground>
 </View>
  
</TouchableOpacity>
      
    );
  onContentSizeChange = (contentWidth, contentHeight) => {
   this.setState({ screenHeight: contentHeight });
 };
 renderDetail(rowData, sectionID, rowID) {
  let title = <Text style={[styles.title]}>{rowData.title}</Text>
  var desc = null
  if(rowData.description)
    desc = (
      <View style={styles.descriptionContainer}>
        {/* <Image source={{uri: rowData.imageUrl}} style={styles.image}/> */}
        <Text style={[styles.textDescription]}>{rowData.description}</Text>
      </View>
    )

  return (
    <View style={{flex:1}}>
      <TouchableOpacity onPress={()=>this.props.navigation.navigate("pendingdelivery",{ custid: rowData.title})}>
      {title}
      {desc}
      </TouchableOpacity>
    </View>
  )
}
   pastdeliverypressed(){
      this.state.ispastdeliverypressed=true;
      this.state.ispendingdeliveryPressed=false;
      this.forceUpdate();
      this.props.navigation.navigate('PastDelivery');
   }
   pendingdeliveryPressed(){
      this.state.ispastdeliverypressed=false;
      this.state.ispendingdeliveryPressed=true;
      this.forceUpdate();
      this.props.navigation.navigate('pendingdelivery');

   }
   componentDidMount(){
      
   }
   componentWillMount(){
    const { navigation } = this.props;

    this.focusListener = navigation.addListener("didFocus", () => {
      // The screen is focused
      // Call any action
      this.getpendingOrders();
    });
    this.focusListener = navigation.addListener("willBlur", () => {
      
    });

   
   }
   async reset(){
    await AsyncStorage.removeItem('isLogin')
    await AsyncStorage.removeItem('Username')
    await AsyncStorage.removeItem('ordoid')

   }
   logout=()=>{
   
    console.log("after output")
    this.reset();
    commonData.setusername('')
    this.forceUpdate();
   
    this.props.navigation.navigate("LoginScreen")  
  }
    render(){
      var message=this.data.length+" records"
      if(this.data.length==0)
      message="No pending Orders"
      const scrollEnabled = this.state.screenHeight > height;
       return( <SafeAreaView style={{flex:1,backgroundColor:"white"}}>
       
                <View style={{width:width,flexDirection:'row',height:70,backgroundColor:'white',borderBottomColor:'grey',shadowColor:'000',shadowRadius:1,alignSelf:'center'}}>
                {/* <View style={{width:width-100,backgroundColor:"white"}}></View> */}
                {/* <View style={{width:100,backgroundColor:'white'}}>
                <Image transition={false} source={require('../components1/images/OrDo.png')} style={{height:75,width:100,  resizeMode:"center", alignSelf:'center'}} />
                </View> */}
                      <View style={{width:(width) ,flexDirection:'row',alignself:'center',alignitems:'center',backgroundColor: 'white',justifyContent:'center',marginTop:10}}>
      <View style={{width:(width)/2-30,backgroundColor:'#ffffff'}}>
<Image transition={false} source={require('../components1/images/OrDo.png')} style={{ height:50,width:100,resizeMode:"cover" }} ></Image>
</View>
<View style={{width:(width)/2-30,flexDirection:'row-reverse',backgroundColor:'#ffffff',height:60}}>
<TouchableOpacity style={{padding:10,height:40,backgroundColor:'#ffffff'}} onPress={() =>
              Alert.alert(
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
    <Icon name="md-log-out" color='#1B1BD0' size={25}/>  
    {/* <FontAwesomeIcon icon="log-out" color='#1B1BD0' size={25} /> */}
               </TouchableOpacity>
           
                     {/* <TouchableOpacity style={{padding:10,height:40,alignitems:"center"}} onPress={() =>{ this.props.navigation.navigate('MyDashboard') }}>
               <Icon name="md-information-circle" color='#1B1BD0' size={25}/>  
                     </TouchableOpacity> */}
                     <TouchableOpacity style={{padding:10,height:40}} onPress={() =>this.getpendingOrders()}>
               <Icon name="md-sync" color='#1B1BD0' size={25}/>  
                     </TouchableOpacity>
</View>
        
                               
           
        </View> 
                
                </View>
               
       
       <ScrollableTabView
        refreshControlStyle={{backgroundColor: 'red'}}
        pullToRefresh={this._onRefresh}
      >
        <ScrollView tabLabel="Assigned Deliveries" >
        <View style={{flexGrow:1,marginTop:10,height:500}}>
                <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                contentContainerStyle={styles.scrollview}
                scrollEnabled={scrollEnabled}
                onContentSizeChange={this.onContentSizeChange}>
                <View style={{flexGrow:1,justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',marginTop:0,height:500}}>
                  <Text style={{fontFamily:"Lato-Regular",fontSize:12,width:width-60,alignSelf:'center'}}>{message}</Text>
                  {
                    this.state.loadingorders==false?
                     <Timeline
              data={this.data}
              circleSize={20}
          circleColor='#1B1BD0'
          innerCircle={'icon'}
          lineColor='#1B1BD0'
          timeContainerStyle={{minWidth:0, marginTop: 0}}
          timeStyle={{textAlign: 'center',width:0, borderColor:'#1B1BD0',borderWidth:0, color:'#1B1BD0',fontFamily:"Lato-Regular", borderRadius:13}}
          descriptionStyle={{color:'gray'}}
          
          
          isUsingFlatlist={true}
          renderDetail={this.renderDetail}/>: <ActivityIndicator />
                  }
                    </View>
                </ScrollView>
                </View>
          
         
        </ScrollView>
        <ScrollView tabLabel="Completed Deliveries" >
        <View style={{flexGrow:1,marginTop:-10,height:500}}>
                <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                contentContainerStyle={styles.scrollview}
                scrollEnabled={scrollEnabled}
                onContentSizeChange={this.onContentSizeChange}>
                <View style={{flexGrow:1,justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',marginTop:-10,height:height-200}}>
                    <FlatList
                        data={this.state.pastorders}
                        renderItem={this.sampleRenderItem}
                        extraData={this.state.refresh}
                        keyExtractor={(item, index) => toString(index,item)}
                        ItemSeparatorComponent={this.renderSeparator} 
                    />
                    </View>
                </ScrollView>
                </View>
        </ScrollView>
   
      </ScrollableTabView>
      <View><Text style={{fontFamily:"Lato-Regular",fontSize:12,alignSelf:'center',width:width,textAlign:'center'}}>©2022 PrimeSophic. All rights reserved.</Text></View>
            </SafeAreaView>);
    }

}
export default(DeliveryMain);
const styles=StyleSheet.create({
   scrollview:{
     // flexGrow:1,
     height:height-200
     // justifyContent: "space-between",
     // padding: 10,
   },
     flatliststyle: {
     marginTop: -12,
     height: 200,
     width:width+50,
     backgroundColor:'#FFFFFF' ,
     alignSelf:'center',
     marginVertical: -40,
     resizeMode:"contain"
     },
     flatrecord: {
       height: 180,
       width:width+50,
       backgroundColor:'#FFFFFF' ,
       alignSelf:'center',
       resizeMode:"stretch"
       },
     image: {
         height: 30,
         width: 30,
         marginHorizontal: 30,
         marginTop: 30,
         resizeMode: 'contain'
 
     },
     heading:{
 
     },
     MainContainer: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
       backgroundColor : '#F5F5F5'
     },
    
     TouchableOpacityStyle:{
    
      height: 40, width: 40,marginTop: 15
     },
     signIn: {
       width: 90,
       height: 48,
       // borderColor:'#1B1BD0',
       borderRadius:8,
       // borderWidth:1,
       justifyContent: 'center',
       alignItems: 'center',
       borderRadius: 10,
       flexDirection: 'row',
       alignSelf:'center',
       shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.5, marginHorizontal:5,
   shadowRadius: 2,
   elevation: 4 ,
     
     },
     textSign: {
         color: '#1B1BD0',
         fontWeight: 'bold',
         fontFamily:'Lato-Bold'
       },
       signInplus: {
         width: 40,
         height: 40,
         // borderColor:'#1B1BD0',
         borderRadius:8,
         // borderWidth:1,
         justifyContent: 'center',
         alignItems: 'center',
         borderRadius: 10,
         flexDirection: 'row',
         alignSelf:'center',
         shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.5, marginHorizontal:5,
     shadowRadius: 2,
     elevation: 4 ,
       
       },
       textSignplus: {
           color: '#1B1BD0',
           fontWeight: 'bold',
           fontSize:27,
           fontFamily:'Lato-Bold'
         },
         title:{
           color:"black",
           fontFamily:'Lato-Bold',
           fontWeight:"500",
           fontSize:14,
           marginTop:0
         },
          shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
         textDescription:{
           color:"#a5a5a5",
           fontFamily:'Lato-Regular',
           fontSize:14
         }
 })