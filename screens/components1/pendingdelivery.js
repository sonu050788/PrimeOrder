
import React, { Component ,useEffect,useState} from 'react';
import { Text, View,Keyboard,StyleSheet,Dimensions,ImageBackground,Image,TextInput,TouchableOpacity,Alert,SafeAreaView,FlatList, ScrollView,AsyncStorage,ActivityIndicator} from 'react-native';
import { SearchBar } from 'react-native-elements';
import CommonDataManager from './CommonDataManager';
import { Icon } from 'react-native-elements';
import {default as UUID} from "uuid";
var orderid=[]
const Constants = require('../components1/Constants');
import LinearGradient from 'react-native-linear-gradient';
const GET_DATAURL=Constants.GET_URL;
const{height}=Dimensions.get("window");
const {width}=Dimensions.get("screen")
var RNFS = require('react-native-fs');
import CheckBox from '@react-native-community/checkbox';
// const [toggleCheckBox, setToggleCheckBox] = useState(false)

var orderpath = RNFS.DocumentDirectoryPath + '/ordersOffline.json';

let commonData = CommonDataManager.getInstance();
let orderArray=[];
class pendingdelivery extends Component {
    constructor(props) {
        super(props);

        this.state = {       
        value:"",
        isLoading: false,
        data: [],
        error: null,
        mainData :[],
        data: [],
        orderitemlist:[],
        screenHeight: height,
        searchmsg:'',
        checkedvalue:false
    }
    this.synccall=this.synccall.bind(this);
    this.arrayholder = [];
    }
   async componentDidMount() {
       let orderarray=commonData.getordderssArray();
        this.arrayholder=orderarray;
        console.log(orderarray,'+++++++++++++++')
        this.state.searchmsg=''
        
    }
componentWillMount(){
  this.synccall();
}
    searchFilterFunction = (text) => {  
       this.state.searchmsg=''
      this.setState({
        value: text,
      });
       if(text.length==0){
        this.setState({ mainData: this.arrayholder}); 
        Keyboard.dismiss();
        return;
       }
      const newData = this.state.mainData.filter(item => {      
        const itemData = `${item.orderid.toUpperCase()}${item.orderstatus.toUpperCase()}${item.type.toUpperCase()}${item.customerid.toUpperCase()} ${item.totalitems.toUpperCase()}${item.last_modified.toUpperCase()}`;
       
         const textData = text.toUpperCase();
          
         return itemData.indexOf(textData) > -1;    
      });
      this.setState({ mainData: newData }); 
     
     
    };
    componentWillUnmount(){
      commonData.resetHandler();
    }
gotoOrderItemScreen(item){
  if(item.orderstatus=='NEW'){
    this.getOrderItemListCall(item.orderid,item.orderstatus);
    return;
  }
    commonData.checknetwork()
    if(commonData.connection_Status=="ONLINE")
    this.props.navigation.navigate('ItemInvoice',{orderid:item.orderid,code:'OD'})
    else
    Alert.alert("Error","No network, Please check your internet connection")
  
}
 synccall(){
  var that = this;
  that.setState({ isLoading: true });
  var customer=that.props.navigation.getParam('custid', '')
  // fetch("http://192.168.9.14:8080/get_ldata_s.php", {
  fetch(GET_DATAURL, {
    method: "POST",
    body: JSON.stringify({
      "__module_code__": "PO_14",
      "__query__": "customerid='"+customer+"' && orderstatus='"+"SENT"+"'",
      "__delete__": 0,
    })
  }).then(function (response) {
    return response.json();
  }).then(function (result) {
   let  orderArray = result.entry_list;
  
    var json = JSON.stringify(orderArray);
    console.log('FILE WRITTEN!',json);
    // RNFS.writeFile(orderpath, json, 'utf8')
    //   .then((success) => {
    //     console.log('FILE WRITTEN!');
    //   })
    //   .catch((err) => {
    //     console.log(err.message);
    //   });
    let tempArray = commonData.gettypeArray(json,'PO_D14')
   
    that.setState({
      mainData: tempArray,
      data:tempArray,
      JSONResult: tempArray,
     
    });
  
   
    that.setState({
      isLoading: false,
      refreshing: false
    });
    that.forceUpdate();
  }).catch(function (error) {
    console.log("-------- error ------- " + error);
  });
 
  // that.readorders();
  that.forceUpdate();
}
readorders(){
  
  RNFS.readFile(orderpath, 'utf8')
      .then((contents) => {
        contentsOrder=contents
        // log the file contents
        console.log("writting files to orders.....................")
        console.log(contents);
        console.log("Json_parse");
        console.log(JSON.parse(contents));
        console.log("Reading Order array from json and use it throughout app using common data manager")
        let tempArray = commonData.gettypeArray(contents,'PO_14')
        commonData.setorderssArray(tempArray)
        commonData.setorderscount(Number(tempArray.length));
        this.setState({
          mainData: tempArray,
          data:tempArray,
          JSONResult: tempArray,
         
        });
      
        this.forceUpdate();
        console.log("temparay array")
        console.log(tempArray);

      })
      .catch((err) => {
        console.log(err.message, err.code);
      });
   
}

async getOrderItemListCall(oid,status) {
  var that = this;
  // that.makeRemoteRequest();
  that.state.isLoading=true;

  const FETCH_TIMEOUT = 1000;
  let didTimeOut = false;
  
//   // fetch("http://192.168.9.14:8080/get_data_s.php", {
//     new Promise(function(resolve, reject) {
//       const timeout = setTimeout(function() {
//           didTimeOut = true;
//           reject(new Error('Request timed out'));
//           Alert.alert("Error", "Coudnt Reach the Server,Try agin later")
//       }, FETCH_TIMEOUT);
  
//       fetch(GET_DATAURL, { 
//         method: "POST",
//                  body: JSON.stringify({
//                    __module_code__: "PO_08",
//                    __query__:"po_orderitems.orderid='"+ oid+"'",
//                      __offset__:0,
//                  })
        
//      }).then((response) => response.json())
//   .then(async (response) => {
//     clearTimeout(timeout);
//       if(!didTimeOut) {
//         that.state.isLoading=false;
//         console.log(result);
//         if(result){
//           var item =result.entry_list
//           if(status=='NEW')
//          that.props.navigation.navigate('SKU',{orderid:oid.value,code:'OL',json:result.entry_list})
//         }
//         console.log(":::::::::::orderItem List Array:::++++::::::for oid::::::::::::",oid)
//         console.log(result.entry_list)
//         that.setState({ 
//          orderitemlist: result.entry_list});
//         resolve(response);
//         } 
//       this.setState({ isLoading: false });
      
//     }).catch(function(err) {
//       console.log('Alert Message','Server Connection Failed')
//   })
//   .then(function() {
//     // Request success and no timeout
//     console.log('good promise, no timeout! ');
  
// })
// .catch(function(err) {
//     // Error: response error, request timeout or runtime error
//     console.log('promise error! ', err);
// });
//   }
//     )
    
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
console.log("this is for getting resonse from querying username and getting response")
console.log(result);
console.log(result.entry_list)
console.log(":::::::::::order List Array:::::::::::::::::::::")
commonData.isOrderOpen=true
var val= UUID.v4();
commonData.setOrderId(val)

//************************************************ */

let currentArra=[]
let uname= commonData.getusername()

for(var i=0;i<result.entry_list.length;i++){
  currentArra.push({ itemid: result.entry_list[i].name_value_list.productid.value, description: result.entry_list[i].name_value_list.description.value, price: result.entry_list[i].name_value_list.price.value, qty:result.entry_list[i].name_value_list.quantity.value, imgsrc: "",weight:result.entry_list[i].name_value_list.um_id.value});
 }
commonData.setContext('RP')
that.props.navigation.navigate('OrderItem',{"frm":"RP"})


commonData.setArray(currentArra)
//tmpArray.push({ itemid: itmArray[i].name_value_list.productid.value, description: itmArray[i].name_value_list.productdescription.value, price: itmArray[i].name_value_list.baseprice.value, qty: itmArray[i].name_value_list.size.value, imgsrc: this.state.itemImage,weight:itmArray[i].name_value_list.weight.value});
that.setState({ 
  data:result.entry_list,
 isLoading:false

})
//****************************************************** */
// that.props.navigation.navigate('OrderItem',{orderid:val,code:'OL',json:result.entry_list,TYPE:'CREATE'})
});
}
    
// getOrderItemListCall(oid,status) {
//   var that = this;
//   this.makeRemoteRequest();
//  // here we are quering po_user.username using post method ........
//  fetch(GET_DATAURL, { 
//    method: "POST",
//    body: JSON.stringify({
//      __module_code__: "PO_08",
//      __query__:"",
//        __offset__:0,
//    })ItemInvoice
//   }).then(function (response) {
//    return response.json();   
//   }).then(function (result) {
//     console.log(result);
//     if(result){
//       var item =result.entry_list
//       if(status=='NEW')
//      that.props.navigation.navigate('SKU',{orderid:oid.value,code:'OL',json:result.entry_list})
//     }
//     console.log(":::::::::::orderItem List Array:::++++::::::for oid::::::::::::",oid)
//     console.log(result.entry_list)
//     that.setState({ 
//      orderitemlist: result.entry_list});
//   }).catch(function (error) {
//     console.log("-------- error ------- " + error);
//   });
  
 
// }
   
    ArrowForwardClick=()=>{
        Alert.alert("Loading soon")
    }
   
    onContentSizeChange = (contentWidth, contentHeight) => {
      this.setState({ screenHeight: contentHeight });
    };
    gotoNextScreen=()=>{
      const filterarray=this.state.mainData.filter(item=>item.checked=="1")
      if(filterarray.length==0){
        Alert.alert("Message","Please choose the orders before confirming your delivery.");
        return;
      }else{
        Alert.alert(
          //title
          'Confirmation',
          //body
          'Only selected Orders will be Delivered.Do you wish to continue?',
          [
            { text: 'Yes', onPress: () => 	 this.props.navigation.navigate('OrderInvoice',{array:this.state.mainData}) },
            { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
          ],
          { cancelable: false }
          //clicking out side of alert will not cancel
        )
      
      
        }
     
    }
    render() {
      this.state.searchmsg=this.state.mainData.length+' Results'
      const { search } = this.state.value;
      const scrollEnabled = this.state.screenHeight > height;
        if (this.state.isLoading) {
            return (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' ,backgroundColor: 'rgba(52, 52, 52, 0.8)'}}>
              <ActivityIndicator />
               <Text style={{fontFamily:'Lato-Bold'}}>Loading Orders , Please wait</Text>

                </View>
            );
        }
        return (
          <View style={{backgroundColor:'#FFFFFF',flex:1}}>
          {/* <View style={{flexDirection:'row',marginTop:30}}>
          <TouchableOpacity style={{borderRadius:20, height:60,width:60, justifyContent:'center', alignItems:'center' }} onPress={()=>this.props.navigation.goBack()}>           
                 <Image transition={false} source={require('../components1/images/arrow.png')} style={{height:35,width:35,  resizeMode:"center", alignSelf:'center'}} />
          </TouchableOpacity>  
            <Text style={{  color: '#1B1BD0',backgroundColor:' #FFFFFF',fontSize: 20, height: 50,marginHorizontal:50,fontFamily:'Lato-Regular' ,fontWeight:'bold',fontSize:22,alignSelf:'center',textAlign:"center",justifyContent:'center'}}>Completed Orders</Text>
            <TouchableOpacity onPress={() =>this.synccall()} style={{marginTop:10,marginHorizontal: -20,}}>
      <Image transition={false} source={require('../components1/images/sync.png')} style={{height:25,width:25,resizeMode:'contain',alignSelf:'center'}}></Image>

      </TouchableOpacity>
             </View>  */}
             <View style={{flexDirection:'row',marginTop:30}}>
        <TouchableOpacity style={{borderRadius:20, height:60,width:width/3-10, justifyContent:'center', alignItems:'center' }} onPress={()=>this.props.navigation.goBack()}>           
                 <Image transition={false} source={require('../components1/images/arrow.png')} style={{height:35,width:35,  resizeMode:"contain", alignSelf:'center'}} />
          </TouchableOpacity> 
            <Text style={{ marginTop:10, color: '#1B1BD0',backgroundColor:' #FFFFFF',fontSize: 20,width:width/3+50, height: 50,fontFamily:'Lato-Regular' ,fontWeight:'bold',fontSize:17,alignSelf:'center',textAlign:"center",justifyContent:'center'}}>Assigned Orders</Text>
            <TouchableOpacity onPress={() =>this.synccall()} style={{marginTop:10,width:width/3-50}}>
             <Image transition={false} source={require('../components1/images/sync.png')} style={{height:25,width:25,resizeMode:'contain',alignSelf:'center'}}></Image>
            </TouchableOpacity>
      </View> 
            <View style={{flexDirection:'row',backgroundColor:'#FFFFFF',alignContent:'center',justifyContent:'center',width:'100%'}}> 
                <TextInput  placeholder="Enter Order #" 
                onChangeText={text => this.searchFilterFunction(text)}
                // onChangeText={(value) => this.setState({ value })}
                autoCorrect={false}
                value={this.state.value}
                style={{marginHorizontal:10, 
                    // width: 250,
                    width:width-150,
                    height:50,
                    color: '#534F64',
                    borderWidth: 1,
                    borderRadius:10,
                    // alignSelf:"center",
                    // Set border Hex Color Code Here.
                    borderColor: '#CAD0D6',
                    fontFamily:'Lato-Regular',
                    // alignSelf:"center",
                    marginTop: 10,
                    textAlign:'center'}}></TextInput>
                  <TouchableOpacity style={{alignSelf:'center',width:90,height:40,backgroundColor:'#ffffff',  shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.5, marginHorizontal:5,
shadowRadius: 2,borderRadius:10,
elevation: 4 }} onPress={() => this.searchFilterFunction('')}>
                   
              <Text style={styles.textSign}>Clear</Text>
             
                    </TouchableOpacity>  
                    
        </View>
        <View style={{backgroundColor:'#FFFFFF',height:40,marginLeft:20, flexDirection:"column"}}>
               {/* <Text style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:5,marginHorizontal:20}}></Text> */}
               <Text  style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:5,marginHorizontal:20}}>{this.state.searchmsg}</Text>
        </View>
        {/* <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                contentContainerStyle={styles.ScrollView}
                scrollEnabled={scrollEnabled}
                horizontal={true}
                onContentSizeChange={this.onContentSizeChange}>
              <FlatList
                  data={this.state.mainData}
                  renderItem={this.sampleRenderItem}
                  extraData={this.state.refresh}
                  
                  keyExtractor={(item, index) => toString(index)}
                  ItemSeparatorComponent={this.renderSeparator}

              />
             
          </ScrollView> */}
                <View style={{flexGrow:1,marginTop:-10,height:90}}>
                <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                contentContainerStyle={styles.scrollview}
                scrollEnabled={scrollEnabled}
                onContentSizeChange={this.onContentSizeChange}>
                <View style={{flexGrow:1,justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',marginTop:10,height:height-150}}>
                    <FlatList
                        data={this.state.mainData}
                        renderItem={this.sampleRenderItem}
                        extraData={this.state.refresh}
                        keyExtractor={(item, index) => toString(index,item)}
                        ItemSeparatorComponent={this.renderSeparator} 
                    />
                    </View>
                </ScrollView>
                <Text style={{fontFamily:'Lato-Regular',fontSize:10,alignSelf:'center',width:width-60}}>I hereby agree to deliver only the orders that are selected and the remaining orders will be collected later.</Text>
                <TouchableOpacity
						style={styles.ProceedbuttonStyle}
						onPress={() => this.gotoNextScreen()}>
						<Text style={{color:'#1B1BD0',fontFamily:'Lato-Bold'}}>Confirm Delivery</Text>
					</TouchableOpacity>
                </View>
          </View>
        );
    }
//     sampleRenderItem = ({ item }) => (
      
//       <TouchableOpacity onPress={()=>this.gotoOrderItemScreen(item)}>  
//   <View style={styles.flatliststyle}>
//   <ImageBackground source={require('../components1/images/itembg.png')} style={styles.flatrecord}>
//     <View style={{flexDirection:'row'}}>
//     <View style={{flexDirection:"row", width:70}}>
//             <TouchableOpacity style={{height: 180, width: 60,marginTop:20,marginHorizontal:45}}>
//                 <Image transition={false} source={require('../components1/images/right.png')} style={{ height: 40, width: 40, marginTop: 30,marginHorizontal:25, resizeMode: 'contain' }} />
//             </TouchableOpacity>
            
//             <Text  style={{color:'#1B1BD0',fontFamily:'Lato-Regular',fontSize:10,marginTop:100,marginHorizontal:-90,width:60,textAlign:'center'}}>{item.orderstatus}</Text>
//             <Image transition={false} source={require('./images/line.png')} style={{ height: 100, width: 60, marginTop: 33,marginHorizontal:68, resizeMode: 'contain' }} />
//             </View>
//             <View style={{marginHorizontal:80}}>
//               {(item.orderid!=undefined)?
//             <Text style={{marginHorizontal:-10,marginTop:30,fontSize:15, color: '#34495A',fontFamily:'Lato-Bold',fontSize:17}}>{item.orderid.substring(1, 8)}</Text>:
//              <Text style={{marginHorizontal:-10,marginTop:30,fontSize:15, color: '#34495A',fontFamily:'Lato-Bold',fontSize:17}}></Text>}
//             <Image transition={false} source={require('../components1/images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain',marginHorizontal:-10 }} />

//     {/* <Text style={{marginHorizontal:-10, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12}}>???{(item.value).split('.')[0]}.{(item.value).split('.')[1].substring(1, 2)}</Text> */}
//     <Text style={{marginHorizontal:-10, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12,marginTop:-20}}>{item.type}</Text>
//     <Text style={{marginHorizontal:-10, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12}}>{item.last_modified}</Text>
     
   
//       <Text style={{marginHorizontal:-10, color: '#1B1BD0',fontFamily:'Lato-Bold',fontSize:14,marginTop:-10}}>{item.customerid}</Text>
//       <View style={{flexDirection:'row'}}>
//       <Text style={{marginHorizontal:-10, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12}}>Total SKUs: {item.totalitems}</Text>
//       <Text style={{marginHorizontal:30, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12}}>Total price: {item.totalvalue}</Text>
//       </View>
//     </View>

//     </View>
//  </ImageBackground>
//  </View>
  
// </TouchableOpacity>
      
//     )
selectme=(itemdetails)=>{
  let checked=false;
  let temparray=[...this.state.mainData];
  var index = temparray.indexOf(itemdetails,0);
  value=temparray[index].checked;
if(value=="1")
{
  temparray.splice(index,1);
  itemdetails.checked="0";
  checked=false;
  this.state.checkedvalue=false;
  
}else{
  temparray.splice(index,1);
  itemdetails.checked="1";
  checked=true;
}
this.state.mainData=[];
temparray.push({'orderid': itemdetails.orderid,
'id': itemdetails.id,
'record': itemdetails.record,
'orderstatus':itemdetails.orderstatus,
'type':itemdetails.type,
'totalvalue':itemdetails.totalvalue,
'date_modified':itemdetails.date_modified,
 'aknowledgementnumber':itemdetails.aknowledgementnumber,
 'customerid':itemdetails.customerid,
 'po_number':itemdetails.po_number,
 'comments':itemdetails.comments,
 'location':itemdetails.location,
 'totalitems':itemdetails.totalitems,
 'checked':itemdetails.checked,
'last_modified':itemdetails.last_modified})

this.state.mainData=temparray;
console.log("Maindataaaaaaaaa",this.state.mainData);
  this.forceUpdate();
  return checked;
}

 sampleRenderItem = ({ item,index }) => (
      
      // <TouchableOpacity onPress={()=>this.gotoOrderItemScreen(item)}>  
  <View style={styles.flatliststyle}>
  <ImageBackground source={require('../components1/images/itembg.png')} style={styles.flatrecord}>
    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
   
            <View style={{alignItems:'flex-start',justifyContent:'center'}}>
              
            
              <View style={{width:width-20, flexDirection:'row'}}>
            <Text style={{marginHorizontal:0,marginTop:30,fontSize:15, color: '#34495A',fontFamily:'Lato-Bold',fontSize:17}}>{item.orderid.substring(1, 8)}</Text>
            {item.checked=="1"?
             <CheckBox
             style={{margintop:0,marginHorizontal:200}}
             disabled={false}
             value={true}
             onValueChange={(newValue) => this.selectme(item)}
           />
          
           :
           <CheckBox
             disabled={false}
                style={{margintop:0,marginHorizontal:200}}
             value={false}
             onValueChange={(newValue) => this.selectme(item)}
           />

              }
            </View>
             <View style={{flexDirection:'row',height:10,width:width-20,alignSelf:'center'}}>
             <Image transition={false} source={require('../components1/images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain',marginHorizontal:0}} />
             <TouchableOpacity onPress={()=>this.gotoOrderItemScreen(item)} style={{height:20,paddingLeft:190,margintop:50}}><Image transition={false} source={require('../components1/images/invoice.png')} style={{width:20,height:20}}></Image></TouchableOpacity>
             </View>
            <Text style={{marginHorizontal:30-width,width:20,height:10,borderRadius:10, backgroundColor: '#1B1BD0',fontFamily:'Lato-Regular',fontSize:12,marginTop:0}}>{item.type}</Text>

    {/* <Text style={{marginHorizontal:-10, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12}}>???{(item.value).split('.')[0]}.{(item.value).split('.')[1].substring(1, 2)}</Text> */}
    <Text style={{marginHorizontal:0, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12,marginTop:-20}}>{item.type}</Text>
    <Text style={{marginHorizontal:0, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12,marginTop:-10}}>{item.last_modified}</Text>
     
   
      <View style={{flexDirection:'row',width:width-40,height:20}}>
    
               <Text style={{marginHorizontal:0, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12}}>Total SKUs: {item.totalitems}</Text>
      <Text style={{marginHorizontal:30, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12}}>Total price: {item.totalvalue}</Text>
      {/* {item.checked=="1"?
             <CheckBox
             style={{margintop:20,marginHorizontal:50}}
             disabled={false}
             value={true}
             onValueChange={(newValue) => this.selectme(item)}
           />
          
           :
           <CheckBox
             disabled={false}
                style={{margintop:20,marginHorizontal:50}}
             value={false}
             onValueChange={(newValue) => this.selectme(item)}
           />

              } */}
      </View>
      
    </View>
    
    </View>
 </ImageBackground>
 </View>
  
// </TouchableOpacity>
      
    )
}

export default pendingdelivery;

const styles=StyleSheet.create({
  scrollview:{
    // flexGrow:1,
    // height:height-480
    // justifyContent: "space-between",
    // padding: 10,
  },
    flatliststyle: {
    // marginTop: -12,
    height: 160,
    width:width+50,
    backgroundColor:'#FFFFFF' ,
    alignSelf:'center',
    marginVertical: 0,
    resizeMode:"contain"
    },
    flatrecord: {
      height: 120,
      width:width+50,
      backgroundColor:'#FFFFFF' ,
      alignSelf:'center',
      resizeMode:"contain"
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
      fontFamily:'Lato-Bold',
      alignSelf:'center',
      marginTop:10
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
      ProceedbuttonStyle: {
            
        justifyContent: 'center',
        alignItems: 'center',
    alignSelf:'center',
   
        height: 40,
    width:width-40,
        // backgroundColor: '#1B1BD0',
    backgroundColor:'#ffffff',
    borderRadius:5,
    borderWidth:1,
    
    borderColor:'#1B1BD0',
        marginTop: 10,
    },
      textSignplus: {
          color: '#1B1BD0',
          fontWeight: 'bold',
          fontSize:27,
          fontFamily:'Lato-Bold'
        },
})