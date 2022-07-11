


import React, { Component } from 'react';
import { Text,ImageBackground, View,Keyboard, StyleSheet,Dimensions,Image, 
  TouchableOpacity, Alert, ScrollView, FlatList, Platform, Linking, PermissionsAndroid, AsyncStorage ,ActivityIndicator} from 'react-native';

import { SafeAreaView } from 'react-navigation';
import { TextInput } from 'react-native';
import { CameraKitCameraScreen, } from 'react-native-camera-kit';

import CommonDataManager from './CommonDataManager';
import LinearGradient from 'react-native-linear-gradient';

let orderfromHistory=[]
let contextvalue=''
var RNFS = require('react-native-fs');
var currentPath = RNFS.DocumentDirectoryPath + '/currentOrder.json';
var orderpath = RNFS.DocumentDirectoryPath + '/ordersOffline.json';
var inventorypath = RNFS.DocumentDirectoryPath + '/inventoryOffline.json';
let commonData = CommonDataManager.getInstance();
let Scannedvalue = ''
let isFromQty = false
let CurrentorderArray = []
const{height}=Dimensions.get("window");
const {width}=Dimensions.get("screen")
const Constants = require('../components1/Constants');
var imgsrc= require('./images/itemImage/IRG-14.jpg')
const GET_DATAURL= Constants.GET_URL;
const SET_DATAURL= Constants.SET_URL;
class AddProduct extends Component {
  UnsentArray=[]
  constructor(props) {
    super(props);
    this.state = {
      baseUrl: Constants.BASE_URL,
      QR_Code_Value: '',
      Start_Scanner: false,
      ItemArray: [],
      itemID:'',
      description: '',
      onHand:'0',
      MOQ:'0',
      LastOrdered: '',
      itemImage: require('../components1/images/noItem.png'),
      arrayHolder:[],
      textInput_Holder: '',
      itemVariable: '',
      qty: 0,
      TotalItem: 0,
      TotalPrice: 0,
      name: '',
      ABC: '',
      refresh: false,
      loading:false,
      screenheight:height
    }
    this.itemList = [];
  }

 
  deleteItemById = id => {
    let temp =[...commonData.getinventoryItemsArray()];
    for (var i = 0; i < temp.length; i++) {
      if (temp[i].itemid == id) {
        
        temp.splice(i, 1)
      }
    }
    this.state.itemID = ''
    commonData.setinventoryItemsArray(temp);
    // this.state.itemImage=require('../components1/images/noItem.png')
    this.forceUpdate();
  }
  
  ReloadItems() {
    this.setState({
      loading: false,
    });
  
    RNFS.readFile(inventorypath, 'utf8')
      .then((contents) => {
       
       commonData.setinventoryItemsArray(contents);
        this.forceUpdate();
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });
   
   
    if(commonData.getinventoryItemsArray().length>0)
     this.joinData();
  }
  componentWillMount = () => {
    const { navigation } = this.props;
    this.state.From=this.props.navigation.getParam('From','')
    this.focusListener = navigation.addListener("didFocus", () => {
      // The screen is focused
      // Call any action
    
      this.ReloadItems();
    
   
    });
    this.focusListener = navigation.addListener("willBlur", () => {
    });

  }
  componentWillUnmount(){
    this.state.itemID="";
    this.closeCamera();
  }
  saveItem = () => {
 var that=this;
    if(commonData.getinventoryItemsArray().length==0)
    {
      Alert.alert("Warning","There are no items to Upload.Please add to continue.");
      return;
    }
    var ItemArray =[...commonData.getinventoryItemsArray()];
    for(var i=0;i<ItemArray.length;i++){
      console.log("itemArray",ItemArray[i].id,"**********")
  
        fetch(SET_DATAURL, {
      method: 'POST',
      body: JSON.stringify({
        __module_code__: "PO_06",
        __query__: "id='"+ItemArray[i].id+"'",
        __name_value_list__:{
          "id":ItemArray[i].id,
         "productid":ItemArray[i].itemid,
         "productdescription":ItemArray[i].description,
         "name":ItemArray[i].description,
         "baseprice":ItemArray[i].base_price,
         "qty": ItemArray[i].qty,
         "upc": ItemArray[i].UPC,
         "category": ItemArray[i].category,
         "subcategory": ItemArray[i].sub_cat,
         "unitofmeasure": ItemArray[i].uom,
         "pack": 10,
         "size":ItemArray[i].size,
         "weight":ItemArray[i].weight,
         "extrainfo1":ItemArray[i].exta1,
         "stock_c":ItemArray[i].stock
        }
      }
  )
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
      console.log("Added Item to Server")
     Alert.alert("Message","Successfully Uploaded Items to the server");
     var ItemArray =[];
     commonData.setinventoryItemsArray(ItemArray);
 that.state.itemID=""
 that.forceUpdate();
 that.synccall();

    }).catch(function (error) {
      console.log("-------- error ------- " + error);
    });
    

  }
    
    
       

}

  async joinData(){
    Keyboard.dismiss();
    var json = JSON.stringify(ItemArray);
if(inventorypath){
     
  await RNFS.unlink(inventorypath);
  console.log("file deleted", inventorypath);
   }
    this.searchForItem();
    // this.props.navigate('AddItemToList');
  }
  
  updateArray = () => {

  }
  
  
 
  async DeleteOrder() {
    if(commonData.getinventoryItemsArray().length==0)
    {
      Alert.alert("Warning","No items to be deleted.");
      return;
    }
    var ItemArray =[];
    if(inventorypath){
     
      await RNFS.unlink(inventorypath);
      console.log("file deleted", inventorypath);
       }
    commonData.setinventoryItemsArray(ItemArray);
this.state.itemID=""
this.forceUpdate();
  // Alert.alert("Order deleted Successfully")
  }

  synccall(){
   
    var that = this;
 
    fetch(GET_DATAURL, {
      method: "POST",
      body: JSON.stringify({
        "__module_code__": "PO_06",
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
      console.log("The previous order data which come from the server here",result)
      var json = JSON.stringify(result.entry_list);
      console.log(json, "this is for orders list array")
      let tempArray = commonData.gettypeArray(json,'PO_06');
      commonData.setSkuArray(tempArray)
     
    }).catch(function (error) {
      console.log("-------- error ------- " + error);
    });
    this.readorders();
  }
  
  
  
  refreshData() {
    this.setState({ refresh: !this.state.refresh })
    this.forceUpdate();
  }
 
  openLink_in_browser = () => {

    Linking.openURL(this.state.QR_Code_Value);

  }
  onQR_Code_Scan_Done = (QR_Code) => {
    let skuList = commonData.getSkuArray();
    this.setState({ QR_Code_Value: QR_Code });
    for (i = 0; i < skuList.length; i++) {
      if(QR_Code==skuList[i].itemid||QR_Code==skuList[i].upc){
        this.setState({ itemID: skuList[i].itemid });
       
      }
    }
    Scannedvalue = QR_Code;
    this.joinData()
    this.setState({ Start_Scanner: false,QR_Code:"" });
  }
  closeCamera = () => {
    this.setState({ Start_Scanner: false });
  }
  
  invaliditems = () => {
    Alert.alert('Please enter the item ID')
  }
  onContentSizeChange=(contentwidth, contentheight)=>{
    this.setState({screenheight:contentheight})
  }
  open_QR_Code_Scanner = () => {

    var that = this;

    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA, {
            'title': 'Camera App Permission',
            'message': 'Camera App needs access to your camera '
          }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {

            that.setState({ QR_Code_Value: '' });
            that.setState({ Start_Scanner: true });
          } else {

            alert("CAMERA permission denied");

          }
         } catch (err) {
          alert("Camera permission err", err);
          console.warn(err);
        }
      }
      requestCameraPermission();
    } else {
      that.setState({ QR_Code_Value: '' });
      that.setState({ Start_Scanner: true });
    }
  }
  // productListfunction=(item)=>{
   
  //   this.state.description=item.description
  //   this.state.itemID=item.itemid
  //   this.state.qty=item.qty
  //   this.state.itemImage=item.imgsrc
  //   this.forceUpdate();
  // }
  render() {
    const scrollEnabled=this.state.screenheight>height;
    if (this.state.loading==true) {
      return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' ,backgroundColor: 'rgba(52, 52, 52, 0.8)'}}>
              <ActivityIndicator />
              <Text style={{fontFamily:'Lato-Bold'}}>Please wait,</Text>
              <Text style={{fontFamily:'Lato-Bold'}}>While we are Uploading</Text>
          </View>
      );
  }
    if (!this.state.Start_Scanner) {
      return (
          <View style={{ backgroundColor: '#FFFFFF',flex:1}}>
                   <View style={{flexDirection:'row',marginTop:30}}>
         <TouchableOpacity style={{borderRadius:20, height:60,width:60, justifyContent:'center', alignItems:'center' }} onPress={()=>{this.state.itemID="";commonData.setinventoryItemsArray("");this.props.navigation.goBack()}}>           
                  <Image transition={false} source={require('../components1/images/arrow.png')} style={{height:35,width:35,  resizeMode:"center", alignSelf:'center'}} />
           </TouchableOpacity> 
             <Text style={{  color: '#1B1BD0',backgroundColor:' #FFFFFF',fontSize: 20,width:width-90, height: 50,fontFamily:'Lato-Regular' ,fontWeight:'bold',fontSize:22,alignSelf:'center',textAlign:"center",justifyContent:'center'}}>Stock Management</Text>
       </View> 
              {/* <View style={{ alignSelf:'center',marginTop:0, backgroundColor: '#FFFFFF',height: 50, flexDirection:'row',alignItems:'center',justifyContent:'space-between' }}> */}
              <View style={{ alignSelf:'center',alignItems:'center',marginTop:-10, backgroundColor: '#FFFFFF',height: 50,width:width-50, flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:20 }}>
            <TouchableOpacity onPress={() => 
                  Alert.alert(
                    //title
                    'Confirmation',
                    //body
                    'Do you want to send an order?',
                    [
                      { text: 'Yes', onPress: () => this.saveItem() },
                      { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
                    ],
                    { cancelable: false }
                    //clicking out side of alert will not cancel
                  ) }>
              <Text style={{backgroundColor:'white',height:30,width:120,textAlign:'center',textAlignVertical:'center',fontFamily:'Lato-Bold',fontSize:12,borderRadius:8,shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.7, marginHorizontal:5,
shadowRadius: 5,
elevation: 9 }}>UPLOAD ITEMS</Text>
            </TouchableOpacity>
            <TouchableOpacity
             onPress={() => 
              Alert.alert(
                //title
                'Confirmation',
                //body
                'Do you want to delete all items?',
                [
                  { text: 'Yes', onPress: () => this.DeleteOrder() },
                  { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
                ],
                { cancelable: false }
                //clicking out side of alert will not cancel
              ) }>
              <Text style={{backgroundColor:'white',height:30,width:120,textAlign:'center',textAlignVertical:'center',fontFamily:'Lato-Bold',fontSize:12,borderRadius:8,shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.5, marginHorizontal:5,
shadowRadius: 2,
elevation: 9 }}>DELETE ITEMS</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{
                color:'red',
                width: 40,
                
                height:40,
              }}
                onPress={() => 
                  this.props.navigation.navigate('AddItemToList')
                    //clicking out side of alert will not cancel
                  }>
                    
                       <LinearGradient
              colors={['#ffffff', '#ffffff']}
              style={styles.signInplus}>
              <Text style={styles.textSignplus}>+</Text>
               </LinearGradient>
                 </TouchableOpacity>

            </View>
            <View style={{ height: 50,backgroundColor:'#FFFFFF' }}>
              <View style={{ marginTop:1,alignSelf:'center', backgroundColor: '#FFFFFF',width:380,height: 100, flexDirection:'row',alignItems:'center',justifyContent:'space-evenly',flex:1 }}>

                {this.state.QR_Code_Value.includes("http") ?
                  <TouchableOpacity
                    onPress={this.openLink_in_browser}
                    style={styles.button}>
                    <Text style={{ color: '#FFF', fontSize: 14 ,fontFamily:'Lato-Bold'}}>Open Link in default Browser</Text>
                  </TouchableOpacity> : null
                }
                <TouchableOpacity onPress={() => this.open_QR_Code_Scanner() } style={{ marginTop: 10}}>
                  <Image transition={false} source={require('./images/barcode.png')} style={{ height: 36, width: 50 ,marginHorizontal:-10,marginTop:-10}}></Image>
                </TouchableOpacity>
                <TextInput placeholder="Enter the Product ID"
                  placeholderTextColor='#dddddd'
                  onChangeText={(itemID) => this.setState({ itemID:itemID })}
                  // value={this.state.text}
                  autoCompleteType='off'
                  autoCorrect={false}
                  style={{
                    // Setting up Hint Align center.
                    textAlign: 'center',
                    // Setting up TextInput height as 50 pixel.
                    height: 40,
                    // Set border width.
                    borderWidth: 1,
                    // Set border Hex Color Code Here.
                    borderColor: '#1B1BD0',
                    // Set border Radius.
                    borderRadius: 5,
                    //Set background color of Text Input.
                    backgroundColor: "#FFFFFF",
                    width: width-150,
                    fontStyle: 'italic',
                    marginTop: -1,
                    fontFamily:'Lato-Regular'}}>{this.state.itemID}</TextInput>
                   <TouchableOpacity onPress={()=>this.searchForItem()} style={{ marginTop: 0,height: 30, width: 30 }}>
                  <Image transition={false} source={require('../components1/images/find.png')} style={{ height: 30, width: 30 ,resizeMode:'contain'}}></Image>
                </TouchableOpacity>
              </View>
              </View>
              <View style={{height:42,width:width-30,alignSelf:'center',backgroundColor:'#ffffff',flexDirection:'column'}}>
              <Text style={{fontFamily:'Lato-Bold',fontSize:12}}>Instructions:</Text>
                    <View style={{flexDirection:'row'}}>
                   <Text style={{width:4,height:4,borderRadius:6,backgroundColor:"black"}}></Text>
                   <Text style={{height:12,fontFamily:'Lato-regular',fontSize:9}}> Scan upc or enter item id to edit</Text>
                

                  </View>
                  <View style={{flexDirection:'row'}}>
                  <Text style={{width:4,height:4,borderRadius:6,backgroundColor:"black"}}></Text>
                  <Text style={{height:12,fontFamily:'Lato-regular',fontSize:9,textAlignVertical:'center'}}> Click on + button to add new item</Text>
                 
                  </View>
              </View>
            <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                contentContainerStyle={styles.ScrollView}
                horizontal={true}
                scrollEnabled={scrollEnabled}
                onContentSizeChange={this.onContentSizeChange}>
                <View style={{flexGrow:1,justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',marginTop:10}}>
                <FlatList
                  data={commonData.getinventoryItemsArray()}
                  extraData={this.state.refresh}
                  renderItem={this.sampleRenderItem}
                  keyExtractor={(item, index) => toString(index)}
                  ItemSeparatorComponent={this.renderSeparator} />
                  </View>
              </ScrollView>
          </View>
      );
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor:'black' }}>
        <View style={{ height: 40, backgroundColor: 'black', flexDirection: 'row-reverse' }}>
          <TouchableOpacity onPress={this.closeCamera} style={{ marginVertical: 5, height: 30, width: 70, backgroundColor: '#FF7D6B', borderRadius: 25 }}><Text style={{ textAlign: 'center', textAlignVertical: 'center' }}>cancel</Text></TouchableOpacity>
        </View>
        <CameraKitCameraScreen
          showFrame={true}
          scanBarcode={true}
          laserColor={'#FF3D00'}
          frameColor={'#00C853'}
          colorForScannerFrame={'black'}
          onReadCode={event =>
            this.onQR_Code_Scan_Done(event.nativeEvent.codeStringValue)
          }
        />

      </SafeAreaView>
    );
  }


searchForItem=()=>{
  
  //Get all the items from Products Table
  /*Check if the the entered item is present in the Product Table
  2. If present get the description and the item details of the itemid and add it to the list

*/

  let skuList = commonData.getSkuArray();
  var found = false;

  let itemdetial= skuList.filter(item=>item.itemid.toLowerCase()==this.state.itemID.toLowerCase());
  if(itemdetial.length>0)
  {
    
    this.props.navigation.navigate('AddItemToList',{itemid:itemdetial[0].itemid,desc:itemdetial[0].description,onHand:itemdetial[0].stock,itemImage:"", qty:itemdetial[0].qty,from:'Inventory',price:itemdetial[0].base_price,upc:itemdetial[0].upc,weight:itemdetial[0].weight,itmdetails:itemdetial[0],id:itemdetial[0].id});
  
  }
  return;
  for (var i = 0; i < skuList.length; i++) {
    var itemIdEnteredUpCase=this.state.itemID.toUpperCase()
    var itemEnteredLow=this.state.itemID.toLowerCase()
    if ((itemIdEnteredUpCase)== skuList[i].itemid || (itemEnteredLow)== skuList[i].itemid ||Scannedvalue == skuList[i].upc) {
      found = true;
      indexvalue=i;
      this.props.navigation.navigate('AddItemToList',{itemid:skuList[i].itemid,desc:skuList[i].description,onHand:skuList[i].stock,itemImage:"", qty:skuList[i].qty,from:'Inventory',price:skuList[i].base_price,upc:skuList[i].upc,weight:skuList[i].weight,itmdetails:skuList[i]});
      return;
      // if (Scannedvalue == skuList[i].upc)
      //   this.state.itemID = skuList[i].itemid
     
    }
    // if(found==true){
    //   this.props.navigation.navigate('AddItemToList',{itemid:skuList[i].itemid,desc:skuList[i].description,onHand:skuList[i].stock,itemImage:"", qty:skuList[i].qty,from:'Inventory',price:skuList[i].base_price,upc:skuList[i].upc,weight:skuList[i].weight,itmdetails:skuList[i]});
  
    // break;
    // }
  }



 
  if(found==true){
    var description = skuList[indexvalue].description
    var itemImage=skuList[indexvalue].imgsrc
   var price = skuList[indexvalue].price
   var weight=skuList[indexvalue].weight
   var qty = skuList[indexvalue].qty
   Scannedvalue=skuList[indexvalue].upc
  
  var ItemArray =[];
  ItemArray=[...commonData.getinventoryItemsArray()];
  let present= false;
  var tempArray=[...ItemArray]
  for(var j=0;j<tempArray.length;j++){
    if(tempArray[j].itemid.toUpperCase()==this.state.itemID.toUpperCase()){
      // present= true;
      // break;
      ItemArray.splice(j,1);
    }
  }
  //Check if the Item is present in the added List
  // if(present== false){
 
  ItemArray.push({itemid:this.state.itemID,description:description,
  mfd:'123',category:'biscuits',
  qty:qty,
sub_cat:'sweets',class:'',UPC:Scannedvalue,
moq:'10',qty_onhand:'10',
base_price:price,selling_price:price,
cost1:'0',cost2:'0',
uom:'0',size:'100',
weight:weight,pack:'',
exta1:'',exta2:'',exta3:'',
exta4:'',exta5:''
});
commonData.setinventoryItemsArray(ItemArray);


// }
}
found=false;
this.forceUpdate();
}

sampleRenderItem = ({ item, index }) => (
  <TouchableOpacity style={styles.flatliststyle} onPress={() => this.props.navigation.navigate('AddItemToList',
  {itemid:item.itemid,desc:item.description,onHand:item.stock,itemImage:item.imgsrc, qty:item.qty,from:'Inventory',price:item.base_price,upc:item.upc,weight:item.weight,itmdetails:item})}>
  
    <ImageBackground source={require('./images/itembg.png')} style={styles.flatrecord}>
      <View style={{flexDirection:'row'}}>

      <View style={{flexDirection:"row"}}>

      <TouchableOpacity style={{height: 100, width: 80,marginHorizontal:39,marginTop:27}} >
          <Image transition={false} source={imgsrc} style={{ height: 80, width: 80, marginTop: 10,marginHorizontal:0, resizeMode: 'contain' }} />
      </TouchableOpacity>
      <Text  style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:120,marginHorizontal:-100}}>{item.itemid}</Text>
      <Image transition={false} source={require('./images/line.png')} style={{ height: 100, width: 80, marginTop: 33,marginHorizontal:83, resizeMode: 'contain' }} />
      </View>
      <View style={{marginHorizontal:-110,}}>
        <Text style={{color:'#7A7F85',borderBottomColor:'#7A7F85',fontFamily:'Lato-Regular',marginTop:23}}>Net wt: {Number(item.weight)} gms</Text>
        <Image transition={false} source={require('./images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain' }} />
        <Text style={{color:'#34495A',fontWeight:"500",fontFamily:'Lato-Bold',fontSize:14,marginTop:0,width:190}}>{item.description}</Text>
        <Text style={{color:'#34495A',fontFamily:'Lato-Regular',fontSize:12,marginTop:10}}>{item.stock} - On Hand</Text>
      </View>
      <Text style={{color:'#FF8DB8',borderBottomColor:'#7A7F85',fontWeight:'900',fontFamily:'Lato-Bold',marginTop:27,marginHorizontal:84}}>₹{item.base_price}</Text>
     <View style={{height: 20, width: 20, marginTop:27,marginHorizontal:-70}}>
       <TouchableOpacity onPress={() => Alert.alert(
          //title
          'Confirmation',
          //body
          'Do you want to delete the selected Item?',
          [
            { text: 'Yes', onPress: () => this.deleteItemById(item.itemid) },
            { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
          ],
          { cancelable: false }
          //clicking out side of alert will not cancel
        )}>
      <Image transition={false} source={require('./images/minus2.png')} style={{ height: 20, width: 20, resizeMode: 'contain' }} />
      </TouchableOpacity>
      </View>
   
      </View>
   </ImageBackground>
   {/* </TouchableOpacity> */}
   {/* </View> */}
   </TouchableOpacity>
 
)
}
const styles = StyleSheet.create({
  ScrollView:{
    flexGrow:1,
  },
  MainContainer: {
    flex: 1,
    paddingTop: (Platform.OS) === 'ios' ? 20 : 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  QR_text: {
    color: '#000',
    fontSize: 19,
    padding: 8,
    marginTop: 12
  },
  content: {
    flexGrow: 1,
    justifyContent: "space-between",
    padding: 10,
    
    
  },
  button: {
    backgroundColor: '#2979FF',
    alignItems: 'center',
    padding: 12,
    width: 300,

  },
  
  flatliststyle: {
      marginTop: -12,
      height: 200,
      width:width+30,
      backgroundColor:'#FFFFFF' ,
      marginHorizontal: -30,
      alignSelf:'center',
      marginVertical: -40,
      resizeMode:"contain"
    },
    flatrecord: {
      // marginTop: -1,
      height: 180,
      width:width+30,
      backgroundColor:'#FFFFFF' ,
      // marginHorizontal: -30,

      alignSelf:'center',
      // marginVertical: -30,
      resizeMode:"stretch"
      },
  image: {
    height: 30,
    width: 30,
    marginHorizontal: 30,
    marginTop: 30

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
});
export {orderfromHistory}
export default AddProduct;