
import React, { Component,createRef } from 'react';
import { Text,Button,ImageBackground, View,Keyboard, StyleSheet,Dimensions,Image, 
  TouchableOpacity,TouchableHighlight, Alert, ScrollView, FlatList, Platform, Linking, PermissionsAndroid, AsyncStorage ,ActivityIndicator} from 'react-native';
  import {
    Dropdown }
    from 'react-native-material-dropdown';
import { SafeAreaView } from 'react-navigation';
// import { TextInput } from 'react-native';
import { TextInput } from 'react-native-paper';
import { CameraKitCameraScreen, } from 'react-native-camera-kit';
import {ItemArray,ItemArrayAdded } from '../components1/SKU'
import { Card } from 'native-base'
import CommonDataManager from './CommonDataManager';
import SignatureCapture from 'react-native-signature-capture';
import Toast from 'react-native-simple-toast';
let orderfromHistory=[]
let contextvalue=''
var RNFS = require('react-native-fs');
var offerpath = RNFS.DocumentDirectoryPath + '/OffersOffline.json';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'native-base';

var currentPath = RNFS.DocumentDirectoryPath + '/currentOrder.json';
var orderpath = RNFS.DocumentDirectoryPath + '/ordersOffline.json';
let commonData = CommonDataManager.getInstance();
let Scannedvalue = ''
let isFromQty = false
let CurrentorderArray = []
const{height}=Dimensions.get("window");
const {width}=Dimensions.get("screen")
const Constants = require('../components1/Constants');
const Configuration=require('../components1/Configuration');
var image_scr="../components1/Constants";
const GET_DATAURL= Constants.GET_URL;
const SET_DATAURL= Constants.SET_URL;
let data = [{
  value: 'Return',
}, {
  value: 'New',
}, {
  value: 'History',
}];
class OrderItem extends Component {
  UnsentArray=[]
  constructor(props) {
    super(props);
    this.state = {
      headertype:'',
      headernumber:'',
      headercomments:'',
      headerref:'',
      headeraddress:'',
      SignitatureCapture:false,
      baseUrl: Constants.BASE_URL,
      QR_Code_Value: '',
      Start_Scanner: false,
      ItemArray: [],
      itemID:'',
      description: '',
      couponcode:'',
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
      isloading:false,
      screenheight:height,
      headers:false,
      offerArray:[],
      offerValue:"",
      offertype:"",
      signinitemsarray:[],totalsavings:0,
      dragged:false
    }
    this.itemList = commonData.getSkuArray();
  }
//Order Header Implementation
changedValue=(text, index)=>{
 
  if(index==0)
  this.setState({
   headernumber:text,
   })
   else if(index==1)
   this.setState({
    headerref:text,
     })
     else if(index==2)
   this.setState({
   headercomments:text,
   })
   else if(index==3)
   this.setState({
   headeraddress:text,
   })
   
 }
 save=()=>{
   //Save header function
   Alert.alert("Message", "Order Headers Saved Successfully");
   commonData.setPOComments(this.state.headercomments);
   commonData.setPOType(this.state.headernumber);
   commonData.setPOnumber(this.state.headertype);
   console.log("hii",this.state.headercomments);
   console.log("hii",this.state.headernumber);
   console.log("hii",this.state.headertype);
   this.setState({headers:false});
   this.forceUpdate();
 }
 loadOffers(){
  RNFS.readFile(offerpath, 'utf8')
  .then((contents) => {
    // log the file contents
    
    this.state.offerArray = JSON.parse(contents)
   
  })
  .catch((err) => {
    console.log(err.message, err.code);
  });
}
getitemval=(id)=>{
  
  var product_id="";
  var temparray=commonData.getSkuArray();
  for(var k=0;k<temparray.length;k++){
   
    if(id==temparray[k].id){
      console.log("vghhghhh",temparray[k]);
      product_id=temparray[k].itemid;
      break;
    }
  }
  return product_id;
}
getofferforId=(id)=>{
  this.state.totalsavings=0;
  if(id==""){
    
    Toast.show('No Coupon code Selected', Toast.LONG)
    return;
  }
  
  var value=""
  let type=""
  let product_id="";
  let minQty=0;
  for(let i=0;i<this.state.offerArray.length;i++){
 
   if(id==this.state.offerArray[i].Code){
      value=Number(this.state.offerArray[i].OfferVAl);
      type=this.state.offerArray[i].type;
      console.log("this.state.offerArray[i]",this.state.offerArray[i])
      product_id=this.getitemval(this.state.offerArray[i].product_id);
    }

  }
   this.setState({offerValue:value,offertype:type});
 if(type=='Q'){
 
   
      let price=0;
      for(var j=0;j<this.state.arrayHolder.length;j++){
        if(product_id==this.state.arrayHolder[j].itemid){
         
        price=Number(this.state.arrayHolder[j].price)*value/100*Number(this.state.arrayHolder[j].qty);
     
       this.state.totalsavings=price;
       let discountvalue=Number(this.state.arrayHolder[j].price)*Number(this.state.arrayHolder[j].qty)*value/100;
      
        // price=Number(this.state.arrayHolder[j].price)-price;
        
       
        
        Toast.show('Congratulations Discount Applied', Toast.LONG)
        this.state.signinitemsarray.splice(j,1);
        this.state.signinitemsarray.push({itemid:this.state.arrayHolder[j].itemid,description:this.state.arrayHolder[j].description,qty:this.state.arrayHolder[j].qty,price:discountvalue})
       this.state.arrayHolder[j].price=discountvalue;
        commonData.setCouponDetails("");
        this.state.couponcode="";
        this.calculaterunningTotals();
        this.forceUpdate();
        break;
        }
      }
    
  

 }else{
   let p=commonData.getTotalPrice().split('₹')[1]
  var price=Number(p);
  price=p-price*value/100;
  Toast.show('Congratulations Discount Applied', Toast.LONG)
  commonData.setRunningTotals(price,commonData.getTotalQty(),commonData.getTotalItems());
 }
 this.forceUpdate();

}
 cancel=()=>{
   //Close header pop up
   var that =this;

   that.setState({headers:false,headeraddress:"",headercomments:"",headernumber:"",headernumber:""});
   that.forceUpdate();
 }
//**************************************** */
  readCurrentOrder(currentpath) {
    // write the fil

    RNFS.readFile(currentpath, 'utf8')
      .then((contents) => {
        // log the file contents
        console.log("Reading files from orders.....................")
        console.log(contents);
        console.log("Json_parse");
        CurrentorderArray = JSON.parse(contents)
        console.log('...............', CurrentorderArray);

      })
      .catch((err) => {
        console.log(err.message, err.code);
      });

  }
  deleteItms=(id)=>{
    this.state.From= commonData.getContext();
    if(this.state.From=='OG'){
    Alert.alert("You cannot delete items from the Current order.")
    return;
    }
    this.deleteItemById(id);
  }
  deleteItemById = id => {
    let temp=this.state.ItemArray
    for (var i = 0; i < temp.length; i++) {
      if (this.state.arrayHolder[i].itemid == id) {
        this.state.arrayHolder[i].qty = 0
        this.state.ItemArray[i].qty = 0
        this.state.ItemArray.splice(i, 1)
        this.state.arrayHolder.splice(i, 1)
      }
    }
    this.state.itemID = ''
    this.state.qty = 0
    this.state.itemImage=require('../components1/images/noItem.png')
    this.state.description=''
    this.refreshData();
    this.calculaterunningTotals()
    this.forceUpdate();
  }
  resignView() {
    commonData.getContext('')
    commonData.setArray(this.state.arrayHolder)
    console.log(commonData.getSkuArray())
    this.state.From=''
  }
  ReloadItems() {
    this.setState({
      loading: false,
      signinitemsarray:[]
    });
    let frm= this.props.navigation.getParam('frm','')
   
    this.loadOffers();
    let skuarray=commonData.getSkuArray();
  this.state.From= commonData.getContext()
  let TYPE=this.props.navigation.getParam('TYPE','')
  if(this.state.From=='HISTORY'|| TYPE=='RETURN'){

    
    const itmArray=commonData.getCurrentArray();

    for(let k=0;k<itmArray.length;k++){
      for(let j=0;j<skuarray.length;j++){
        if(itmArray[k].itemid==skuarray[j].itemid && Number(skuarray[j].stock)>0){
        itmArray[k].stock=skuarray[j].stock;
        itmArray[k].noofdays=skuarray[j].noofdays;
        itmArray[k].price=Number(skuarray[j].price);
        itmArray[k].weight=Number(skuarray[j].weight);
        itmArray[k].id=Number(skuarray[j].id);
        itmArray[k].upc=skuarray[j].upc;
        break;
        }
      }
    }
    this.state.arrayHolder=[...itmArray]
    orderfromHistory=[...itmArray]
    commonData.setArray(orderfromHistory)
    this.state.ItemArray = itmArray
    this.state.orderid = commonData.getOrderId()
    contextvalue=commonData.getContext()
    CurrentorderArray=[...orderfromHistory]
    this.state.itemID = ''
    this.state.qty = '0'
    this.state.description = ''
    this.state.MOQ='0'
    this.state.onHand='0'
    this.state.LastOrdered='--',
    this.state.itemImage=require('../components1/images/noItem.png')
    this.calculaterunningTotals();
    this.forceUpdate()
  }else if(this.state.From=='OG' || this.state.From=='RP'||commonData.getContext()=='RP'){
    const itmArray=commonData.getCurrentArray();
   
   
    for(let k=0;k<itmArray.length;k++){
      for(let j=0;j<skuarray.length;j++){
        if(itmArray[k].itemid==skuarray[j].itemid){
          console.log(skuarray[j].stock+"skuarray[j].stockskuarray[j].stockskuarray[j].stock");
          if(Number(skuarray[j].stock)>0){
        itmArray[k].stock=skuarray[j].stock;
        itmArray[k].noofdays=skuarray[j].noofdays;
        itmArray[k].price=Number(skuarray[j].price);
        itmArray[k].weight=Number(skuarray[j].weight);
        itmArray[k].id=skuarray[j].id;
        itmArray[k].description=skuarray[j].description;
        itmArray[k].upc=skuarray[j].upc;
        break;
          } 
        }
      }
    }
    this.state.arrayHolder=[...itmArray]
    this.state.arrayHolder=this.state.arrayHolder.filter(item=>Number(item.stock)>0)
    // orderfromHistory=[...itmArray]
    orderfromHistory=this.state.arrayHolder.filter(item=>Number(item.stock)>0)

    commonData.setArray(orderfromHistory)
    this.state.ItemArray = orderfromHistory
   itmArray=orderfromHistory;
    this.state.orderid = commonData.getOrderId()
    contextvalue=commonData.getContext()
    CurrentorderArray=[...orderfromHistory]
    this.state.itemID = ''
    this.state.qty = '0'
    this.state.description = ''
    this.state.MOQ='0'
    this.state.onHand='0'
    this.state.LastOrdered='--',
    this.state.itemImage=require('../components1/images/noItem.png')
    this.calculaterunningTotals();
    this.forceUpdate()
  }
  else if(this.state.From=='UN'){
    const itmArray=commonData.getCurrentArray();
    for(let k=0;k<itmArray.length;k++){
      for(let j=0;j<skuarray.length;j++){
        if(itmArray[k].itemid==skuarray[j].itemid){
        itmArray[k].stock=skuarray[j].stock;
        itmArray[k].noofdays=skuarray[j].noofdays;
        itmArray[k].price=Number(skuarray[j].price);
        itmArray[k].weight=Number(skuarray[j].weight);
        itmArray[k].id=skuarray[j].id;
        itmArray[k].upc=skuarray[j].upc;
        break;
        }
      }
    }
    this.state.arrayHolder=[...itmArray]
    console.log('hi i am array holder', this.state.arrayHolder)
    orderfromHistory=[...itmArray]
    commonData.setArray(orderfromHistory)
    this.state.ItemArray = itmArray
    this.state.orderid = commonData.getOrderId()
    contextvalue=commonData.getContext()
    CurrentorderArray=[...orderfromHistory]
    commonData.isOrderOpen=true
    this.state.itemID = ''
    this.state.qty = '0'
    this.state.description = ''
    this.state.MOQ='0'
    this.state.onHand='0'
    this.state.LastOrdered='--',
    this.state.itemImage=require('../components1/images/noItem.png')
    this.calculaterunningTotals();
    this.forceUpdate()
  }
  else{
    if(this.state.From=='PREV'){
      // //Save the Order  
      this.saveorderShow();
      commonData.isOrderOpen=true
      commonData.setContext('')
      commonData.setArray('')
      this.state.arrayHolder=[]
      this.state.ItemArray=[]
    }
    
    if (commonData.isOrderOpen == true) {     
      this.state.orderid = commonData.getOrderId()
      if(this.state.From=='ID'){
        commonData.setContext('')
        let tempItemArrayAdded = commonData.getCurrentArray();
        this.state.arrayHolder = [...tempItemArrayAdded]
        this.state.ItemArray = tempItemArrayAdded
      }else{
      for (var i = 0; i < this.state.arrayHolder.length; i++) {
        if (this.state.arrayHolder[i].itemid == this.state.itemID) {
          this.state.qty =Number(this.state.arrayHolder[i].qty);
          this.state.price = this.state.arrayHolder[i].price
        }
      }
      let tempItemArrayAdded = ItemArrayAdded
      this.state.arrayHolder = [...tempItemArrayAdded]
      this.state.ItemArray = tempItemArrayAdded
    }  
  } else {
      this.state.ItemArray = []
      this.state.arrayHolder = []
    }
    this.state.itemID = ''
    this.state.qty = '0'
    this.state.description = ''
    this.state.MOQ='0'
    this.state.onHand='0'
    this.state.LastOrdered='--',
    this.state.itemImage=require('../components1/images/noItem.png')
    this.calculaterunningTotals()
    this.forceUpdate()
  }
  }
  componentWillMount = () => {
    const { navigation } = this.props;
    this.state.From=this.props.navigation.getParam('From','')
    this.focusListener = navigation.addListener("didFocus", () => {
      // The screen is focused
      // Call any action
      
      this.setState({couponcode:commonData.getCouponDetails()})
      contextvalue=this.props.navigation.getParam('From','')
      this.ReloadItems();
      this.calculaterunningTotals()
    });
    this.focusListener = navigation.addListener("willBlur", () => {
      this.resignView();
    });

  }
  saveorderShow = () => {
    
      this.newsaveorder();
      this.DeleteCurrentOrder();
      
       if(this.state.From!='PREV'){
       this.props.navigation.navigate('HomeTab')
     }

}
DeleteFunction =async ()=> {
  var that=this;
  let path1=this.props.navigation.getParam('PATH1')
  if(path1){
    console.log(path1,"RENDER CALL 22 new smile,...................")
    await RNFS.unlink(path1);
    console.log("file deleted", path1);
     }
     that.props.navigation.navigate('OrderSent',{"TYPE":""})
}

  joinData = () => {
   
    Keyboard.dismiss()  
    this.state.From= commonData.getContext();
    if(this.state.From=='OG'){
    Alert.alert("You cannot add items to the Current order.")
    return;
    }
   
    let TYPE=this.props.navigation.getParam('TYPE','')
    if(TYPE=="RETURN" && commonData.isOrderOpen==true){
      let temparray=commonData.getCurrentArray();
      const filteredData =  temparray.filter(item => item.itemid == this.state.itemID);
      if(filteredData.length==0){
        Alert.alert("Warning","Please add items from the return Order item list.")
        return;
      }
    
     
      
    }
   
    this.itemList = commonData.getSkuArray()
    var qty = 0, price = 0;
    var weight=0;
    var hand=0;
    if (commonData.isOrderOpen == false) {
      Alert.alert("Alert",'You do not have an order open.')
      Keyboard.dismiss()
      this.forceUpdate();
      return;
    }
    //UPC Check
 
    if (this.state.itemID == null)
      return;
    // var i = 0;
    var found = false;
  
    var index=-1;
    for(var i1=0;i1<this.itemList.length;i1++){
      var itemIdEnteredUpCase=this.state.itemID.toUpperCase();
      var itemEnteredLow=this.state.itemID.toLowerCase()
      var entereditemid=this.state.itemID;
      if(itemIdEnteredUpCase==entereditemid.toUpperCase()||itemEnteredLow==entereditemid.toLowerCase()){
        index=i1;
        found=true;
        hand=this.itemList[i1].stock
       
        
        this.state.description = this.itemList[i1].description
        this.state.itemImage=this.itemList[i1].imgsrc
        price = this.itemList[i1].price
         weight=this.itemList[i1].weight
         
          if(Number(hand)>0){
          if (this.itemList[i1].qty != null || this.itemList[i1].qty >= 0) {
            this.state.qty = Number(this.itemList[i1].qty) + 1;
          }
          }
         
        break;
      }

    }
   
    for (var i = 0; i < this.state.arrayHolder.length; i++) {
      if (this.state.arrayHolder[i].itemid == this.state.itemID) {
        qty = Number(this.state.arrayHolder[i].qty) + 1;
     
       
        if(qty>=hand){
          Alert.alert("Warning","Quantity cannot exceed the available on Hand count");
          qty=hand;
          this.state.arrayHolder[i].qty=qty;
        }
          this.state.ItemArray[i].imgsrc=this.state.arrayHolder[i].imgsrc
          this.state.ItemArray[i].qty = qty
          this.state.ItemArray[i].weight= Number(this.state.arrayHolder[i].weight)
          this.state.ItemArray[i].stock = hand
          this.state.ItemArray[i].price = price
          this.state.ItemArray[i].itemid = this.state.arrayHolder[i].itemid
          this.state.ItemArray[i].id=this.state.arrayHolder[i].id
      }
    }
    if (found) {
      if (isFromQty == false)
        this.state.qty = qty
        else
        this.state.qty=0
      if ((this.state.qty == 0 || this.state.qty == -1)) {
         this.state.qty = 1;
        this.state.ItemArray.push({ itemid: this.state.itemID, description: this.state.description, price: price, qty: this.state.qty, imgsrc: this.state.itemImage,weight:weight,stock:hand});
       }
       this.setState.arrayHolder=[...this.state.ItemArray]
       this.state.refresh=false;
      commonData.setArray([...this.state.ItemArray])
      contextvalue=commonData.getContext()
      if(contextvalue.length==0){
        let tempItemArrayAdded = ItemArrayAdded
        this.state.arrayHolder = [...tempItemArrayAdded]
        this.state.ItemArray = tempItemArrayAdded
      }else{
        this.state.arrayHolder = [...this.state.ItemArray]
        commonData.setArray(this.state.ItemArray)
        console.log(commonData.getCurrentArray(), "this.state.itemarray")
        commonData.setContext('')
      }   
      this.refreshData()
      this.calculaterunningTotals();
      this.forceUpdate();
    } else {
      Alert.alert("Alert",'Invalid Itemid')
      Keyboard.dismiss()
      this.state.description = ''
      this.state.qty = 0
      this.state.itemID = ''
      this.state.itemImage=require('../components1/images/noItem.png')
      this.forceUpdate();

    }
    
  }
  newsaveorder=()=>{
    console.log("my orders are saving here.................")
    var oid = commonData.getOrderId()
    let uname=commonData.getusername();
    let custid=commonData.getActiveCustomerID();
    let address=commonData.getActiveAdress();
    let cname=commonData.getcustomerName();
    let cqty=commonData.getTotalPrice();

    console.log(cqty, "oid-----cqty");
    var filename = 'UN_'+oid+'CNID-'+custid+'Nme-'+cname+'ADD-'+address+'LNT-'+this.state.ItemArray.length.toString()+'cntP-'+cqty+'.json'
    var dir = RNFS.DocumentDirectoryPath + '/unsent_folder' + '/'+ uname+'/';
    var path = dir + filename;
    RNFS.mkdir(dir,{NSURLIsExcludedFromBackupKey:true});
    var json = JSON.stringify(this.state.ItemArray);
    RNFS.writeFile(path, json, 'utf8')
      .then((success) => {
        console.log('FILE WRITTEN!');
        console.log(path,"file wriiteen...........path is here.......")
      })
      .catch((err) => {
        console.log(err.message);
      });
}

  GetItem(item) {

    Alert.alert(item);

  }
  updateArray = () => {

  }
  calculaterunningTotals() {
    console.log('m inside calculate running')
    let Qtyval = 0
    let PriceVal = 0
    let ItemVAl = this.state.arrayHolder.length
   
    for (var i = 0; i < ItemVAl; i++) {
      Qtyval = Qtyval + Number(this.state.arrayHolder[i].qty)
      if (this.state.arrayHolder[i].price != null)
        PriceVal = PriceVal + (Number(this.state.arrayHolder[i].qty) * Number(this.state.arrayHolder[i].price))
    }
    this.state.TotalPrice = PriceVal
    this.state.TotalQty = Qtyval
    this.state.TotalItem = ItemVAl
    commonData.setRunningTotals(PriceVal, Qtyval, ItemVAl)
    this.forceUpdate();
    
    
  }
  DeletefromOrderItems() {
    var that = this;
    var oid = commonData.getOrderId()

    const url= SET_DATAURL;
    console.log("url:" + url);
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        __module_code__: "PO_14",
        __query__: "po_orders.orderid= '" + oid + "'",
        __name_value_list__:{
          modified_by_name: "Support Primesophic",
          delete: 1,
        }
      })
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
      console.log("this is deleting order items")
      console.log(result);
      that.DeleteOrder();
      Alert.alert("Order Deleted succesfully")
      if(that.state.From!='PREV'){
        that.props.navigation.navigate('HomeTab')
     }

    }).catch(function (error) {
      console.log("-------- error ------- " + error);
    });

  }
  DeleteCurrentOrder() {
    
    let temp = this.state.arrayHolder;
    for (var i = 0; i < this.state.arrayHolder.length; i++) {
      for(var j=0;j<this.state.ItemArray.length;j++){
      if (this.state.arrayHolder[i].itemid == this.state.ItemArray[j].itemid) {
        this.state.ItemArray[j].qty = 0
      }
      }
    }
    const filteredData =  this.state.ItemArray.filter(item => item.qty == 0);
    for(var i=0;i<filteredData.length;i++){
      this.deleteItemById(filteredData[i].itemid)
    }
      commonData.isOrderOpen=false
      commonData.setArray( '')
  }
  DeleteOrder() {
    this.DeleteCurrentOrder();
    this.DeleteFunction()
 if(this.state.From!='PREV'){
     this.props.navigation.navigate('HomeTab')
   }   
  }
  synccall(){
    let variable=commonData.getusername();
    var that = this;
 
    fetch(GET_DATAURL, {
      method: "POST",
      body: JSON.stringify({
      "__module_code__": "PO_14",
      "__query__": "created_by_name = '" + variable + "'",
      "__delete__": 0,
    })
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
      orderArray = result.entry_list;
      console.log("The previous order data which come from the server here",result)
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
        // mainData: result.entry_list,
        // JSONResult: result.entry_list,
        loading: false,
        refreshing: false
      });
    }).catch(function (error) {
      console.log("-------- error ------- " + error);
    });
    that.readorders();
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
          console.log("temparay array")
          console.log(tempArray);
          this.state.isloading=false;
        })
        .catch((err) => {
          console.log(err.message, err.code);
        });

  }
  SignandProceed=()=>{
    this.setState({SignitatureCapture:true});
   
  }
  sendOrderFunction = () => {
    this.setState({  isloading: true });
    let TYPE=this.props.navigation.getParam('TYPE','')

    var createduser = commonData.getUserID()
    let uname=commonData.getusername();
    var custid=commonData.getActiveCustomerID()
    var modified_by_name='usr-01'
    var last_modified=commonData.getCurrentDate()
    var po_number= commonData.getPOnumber()
    var OHtype=commonData.getPOType()
    var po_number=commonData.getPOnumber()
    var comments= commonData.getPOComments()
    var email=commonData.getemail();
    var token=commonData.getFBToken();
    let totalitems=this.state.arrayHolder.length;
    var that = this
    var url =SET_DATAURL
       fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        __module_code__: "PO_14",
        __query__: "po_orders.orderid='"+that.state.orderid+"'",
        __name_value_list__:{
          "orderstatus": "SENT",
          "orderid":this.state.orderid,
          "storeid":custid,
          "createdby":createduser,
          "customerid":custid,
          "lastmodifiedby":custid,
          "totalvalue":this.state.TotalItem,
          "value":this.state.TotalPrice,
          "comments":comments,
          "type":OHtype,
          "po_number":po_number,
          "lastmodified":last_modified,
          "assigned_user_name":createduser,
          "name":custid+"Orders"+this.state.orderid,
          "aknowledgementnumber":"",
          "customerorderstatus":"READY TO DISPATCH",
          "isreadytosend":"1",
          "location":"Mangalore",
          "cust_email":email,
          "fbtoken":token,
          "totalitem":totalitems,
          "username":uname


        }
      })
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
     
      
      that.setState({isloading:false});
      that.sendItems()
     

    }).catch(function (error) {
      console.log("-------- error ------- " + error);
    });
    
  }
  saveHeaders=()=>{
    //Save the Order Headers Locally
    //Dec 16th 2021
    commonData.setPOComments("Comments From txtfield Comments");
    commonData.setPOnumber("Text from txt PO Number");
    commonData.setPOType("Text from PO Type text field");
    //****Code Ends */
  }
  sendItems=()=>{
    var createduser = commonData.getUserID()
    var date_entered=commonData.getCurrentDate()
    var that = this
    var url =SET_DATAURL
    let TYPE=this.props.navigation.getParam('TYPE','')
   let return_id="";
   let return_qty=0;
    let custname=commonData.getcustomerName();
    
    for (var i = 0; i < that.state.arrayHolder.length; i++) {
      var that = this;
      let id=that.state.arrayHolder[i].id;
      let qty= Number(that.state.arrayHolder[i].qty);
      let stock =Number(that.state.arrayHolder[i].stock)-qty;
      if(TYPE=="RETURN"){
        return_id=oid;
        oid=that.state.arrayHolder[i].orderid;
        return_qty=that.state.arrayHolder[i].rqty;
        stock=Number(return_qty)+Number(that.state.arrayHolder[i].stock);
        if(stock<0)
        stock=stock*-1;
        Alert.alert(return_qty.toString());
       
      }else{
        if(qty>that.state.arrayHolder[i].stock){
          // Alert.alert("Warning",that.state.arrayHolder[i].itemid+" has reached maximum qty limit.Item wil be set to the maximum stock available.")
          // qty=qty-that.state.arrayHolder[i].stock;
          if(qty==0)
           continue;
          //  that.updateitemStock(id,qty);
        }

      }
      that.updateitemStock(id,stock);
     
     
     
      //in this method we are setting the username user has typed and store it in the set_data_s.php url.     
      console.log("url:" + url);
      var oid = commonData.getOrderId()
      that.setState({
        isloading: true,
      });
      fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          "__module_code__": "PO_08",
          "__name_value_list__":{
            modified_by_name: "Support Primesophic",
            productid: that.state.arrayHolder[i].itemid,
            orderid: oid,
            quantity: qty,
            price:this.state.arrayHolder[i].price,
            um_id:0,
            description:this.state.arrayHolder[i].description,
            created_by:createduser,
            lastmodified:date_entered,
            custname:custname,
            type:TYPE,
            return_qty:return_qty,
            return_id:return_id
          }
        })
      }).then(function (response) {
        return response.json();
      }).then(function (result) {
        console.log("this is sending order items")
        console.log(result);
        that.setState({
          isloading: false,
        });
        that.synccall();
        that.setState({
          loading: false,
        });

      }).catch(function (error) {
        console.log("-------- error ------- " + error);
      });
    }
    
    that.DeleteCurrentOrder();
    that.DeleteFunction();
   

    
  }

  refreshData() {
    this.setState({ refresh: !this.state.refresh })
    commonData.writedata(currentPath, this.state.arrayHolder)
    this.calculaterunningTotals()
    this.forceUpdate();
  }
  increment() {
    this.AddorDelete('+')
  }
  updateitemStock=(id,stock)=>{
  
    var url =SET_DATAURL
    fetch(url, {
   method: 'POST',
   body: JSON.stringify({
     __module_code__: "PO_06",
     __query__: "po_products.id='"+id+"'",
     __name_value_list__:{
       "id": id,
       "stock_c":stock
     }
   })
 }).then(function (response) {
   return response.json();
 }).then(function (result) {
  console.log("item deleted",id,stock) }).catch(function (error) {
   console.log("-------- error ------- " + error);
 });
  }
  AddorDelete(type){
    if(commonData.isOrderOpen==false){
      Alert.alert('Alert','You do not have an order open.');
      return;
    }
    if (this.state.itemID == null||this.state.itemID.length==0){
      Alert.alert('Alert','Please enter the item id')
      Keyboard.dismiss()
      return;
    }
    let TYPE=this.props.navigation.getParam('TYPE','')
    if(TYPE=="RETURN"&& type=="+"){
      Alert.alert('Warning','You cannot exceed the Ordered quantity value.')
      Keyboard.dismiss()
      return;
    }
    this.itemList = commonData.getSkuArray();
    for(var i=0;i<this.state.arrayHolder.length;i++){
      if(this.state.arrayHolder[i].itemid==this.state.itemID){
        var itemIdEnteredUpCase=this.state.itemID.toUpperCase()
        var itemEnteredLow=this.state.itemID.toLowerCase()
        if ((itemIdEnteredUpCase)== this.state.arrayHolder[i].itemid || (itemEnteredLow)== this.state.arrayHolder[i].itemid) {
          if (this.state.qty <=0) {
            this.state.qty = 1;
          }
          this.state.ItemArray[i].imgsrc=this.state.arrayHolder[i].imgsrc
          if(type=='-')
          this.state.ItemArray[i].qty = this.state.qty-1
          else{
            this.state.qty=this.state.qty+1
          if(this.state.ItemArray[i].stock<this.state.qty)
            {
              Alert.alert("Warning","Qty has exceeded the on hand quantity.It will be set to maximum available quantity.")
              this.state.qty=this.state.ItemArray[i].stock;
            }
            this.state.ItemArray[i].qty = this.state.qty;
          }
         
          this.state.ItemArray[i].price = this.state.arrayHolder[i].price
          this.state.ItemArray[i].itemid = this.state.arrayHolder[i].itemid
          this.state.ItemArray[i].weight= Number(this.state.arrayHolder[i].weight)
          this.state.qty=this.state.ItemArray[i].qty
          if(this.state.qty==0||this.state.ItemArray[i].qty==0)
          {
            this.state.ItemArray.splice(i,1)
            this.state.arrayHolder.splice(i,1)
            this.state.itemID = ''
            this.state.qty = 0
            this.state.itemImage=require('../components1/images/noItem.png')
            this.state.description=''
            // break;
          }
        }
      }
          this.state.arrayHolder =[...this.state.ItemArray]
          commonData.setArray([...this.state.ItemArray])
        this.forceUpdate()
      this.refreshData()
  
    }
  }
  decrement = () => {
    this.AddorDelete('-')

  }
  openLink_in_browser = () => {

    Linking.openURL(this.state.QR_Code_Value);

  }
  onQR_Code_Scan_Done = (QR_Code) => {
    this.setState({ QR_Code_Value: QR_Code });
    for (i = 0; i < this.itemList.length; i++) {
      if(QR_Code==this.itemList[i].itemid||QR_Code==this.itemList[i].upc){
        this.setState({ itemID: this.itemList[i].itemid });
      }
    }
    Scannedvalue = QR_Code;
    this.joinData()
    this.setState({ Start_Scanner: false });
  }
  closeCamera = () => {
    this.setState({ Start_Scanner: false });
  }
  searchItem = () => {
    this.props.navigation.navigate('SKU');
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
  componentWillReceiveProps() {
    console.log('rerender here')
    //this.yourFunction()
    // this.setState({})
    
}
  productListfunction=(item)=>{
   
    this.state.description=item.description
    this.state.itemID=item.itemid
    this.state.qty=item.qty
    this.state.itemImage=item.imgsrc
    this.forceUpdate();
  }

  render() {
   
    const scrollEnabled=this.state.screenheight>height;
    let screenwidth= Dimensions.get('window').width;
    let screenheight= Dimensions.get('window').height;
    var price=commonData.getTotalPrice().split("₹")[1];
    var totalsavings=0;
    var gst=Number(price)*18/100;
    var grandtotal=Number(gst)+Number(price);
    const saveSign = () => {
      sign.current.saveImage();
  };

	const closeSign = () => {
    this.setState({SignitatureCapture:false});
  };
  const _onDragEvent=() =>{
    // This callback will be called when the user enters signature
    this.state.dragged=true;
   console.log("dragged");
}
	const saveSign1 = () => {
    if(this.state.dragged==false){
      Alert.alert("Warning","Please sign to continue.");
      return;
    }
		sign.current.saveImage();
    // Alert.alert("Message","");
    this.setState({SignitatureCapture:false});
    this.sendOrderFunction();
	};

	const resetSign1 = () => {
		sign.current.resetImage();
	};


  const _onSaveEvent = (result) => {
		//result.encoded - for the base64 encoded png
		//result.pathName - for the file path name
		alert('Signature Captured Successfully');
		console.log(result.encoded);
	};
  const resetSign = () => {
      analytics().logEvent('ClearSignitureBtnClicked', {
          content_type: 'ClearSigniture',
          content_id: JSON.stringify(commonData.token),
          items: [{ name: 'ClearSigniture' }]
      })
      sign.current.resetImage();
      this.setState({dragged:false});
      this.forceUpdate();
  };


    const sign = createRef();
    if (this.state.SignitatureCapture == true) {
      this.state.signinitemsarray=[...this.state.arrayHolder];
      return (
            <View style={styles.container}>
     
    <TouchableOpacity style={styles.backStyle} onPress={() => {
							closeSign();
						}}>
    <Image transition={false}  source={require('../components1/images/close_btn.png')} style={{width: 30,height:30,alignSelf:'center' }} > 
          </Image> 
    </TouchableOpacity>
        <View style={{ flexDirection: 'row',alignSelf:'center', marginTop:10 , width:width-20,backgroundColor:'#ffffff'}} >
        
        <Text style={styles.titleStyle}>
			Order Review 
				</Text>
        <Image transition={false}  source={require('../components1/images/OrDo.png')} style={{ marginTop: 10, marginHorizontal: width-260 ,width: 100,height:40,alignSelf:'center' }} > 
          </Image> 
      
          </View>
     
        
        <Text style={{color:'#34495A',fontSize:11,borderBottomColor:'#7A7F85',fontFamily:'Lato-Bold',marginHorizontal:20}}>{commonData.getActiveCustName()} </Text>
      <Text style={{color:'#34495A',fontSize:10,borderBottomColor:'#7A7F85',fontFamily:'Lato-Regular',marginHorizontal:20}}>{commonData.getActiveAdress()}</Text>
      <Text style={{color:'#34495A',fontSize:10,borderBottomColor:'#7A7F85',fontFamily:'Lato-Regular',marginHorizontal:20}}>GSTIN: {Configuration.GSTIN}</Text>

                <View style={{flexGrow:0.25, height:900,backgroundColor: '#ffffff'}}>
                <View style={{ flexDirection: "row",justifyContent:'center',alignItems:'center',  marginTop:10,backgroundColor:'#d5d5d5',width:width-10,alignSelf:'center' }} >
   
                <Text style={{color:'#34495A',fontSize:11,borderBottomColor:'#7A7F85',fontWeight:'900',fontFamily:'Lato-Bold', width:width/2.5,marginHorizontal:20}}>Description</Text>
      <Text style={{color:'#34495A',fontSize:11,borderBottomColor:'#7A7F85',fontWeight:'900',fontFamily:'Lato-Bold',width:width/4.5,marginHorizontal:2}}>Qty</Text>
      <Text style={{color:'#34495A',fontSize:11,borderBottomColor:'#7A7F85',fontWeight:'900',fontFamily:'Lato-Bold',width:width/3.5,marginHorizontal:2}}>Price</Text>
</View>
<View style={{height:130}}>
              
              <ScrollView style={{ backgroundColor: '#FFFFFF',flexGrow:1}} 
                contentContainerStyle={styles.scrollview}
                scrollEnabled={scrollEnabled}
                onContentSizeChange={this.onContentSizeChange}>
                <View style={{flexGrow:1,justifyContent:"space-between",padding:5,backgroundColor: '#FFFFFF',marginTop:0,height:height-290}}>
                    <FlatList
                        data={this.state.signinitemsarray}
                        renderItem={this.SignItemsView}
                        extraData={this.state.refresh}
                        keyExtractor={(item, index) => toString(index,item)}
                        ItemSeparatorComponent={this.renderSeparator} 
                    />
                    </View>
                </ScrollView>
             </View>
             <View style={{flexDirection:'row',height:30,width:width-10,alignSelf:'center',marginTop:30,alignItems:'center',paddingBottom:10}}>
<View style={styles.parent}>
          <TextInput


label="Coupon Code"
//  placeholder="Enter Coupon Code"              
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
underlineColorAndroid="#dddddd"
onChangeText={(value) => this.setState({couponcode:value})}
clearButtonMode="always"
ref={username => { this.textInput = username }}
style={{
backgroundColor:'white',
width:width-170,
color: 'red',

}}
value={this.state.couponcode}
          />
          <TouchableOpacity
            style={styles.closeButtonParent}
            onPress={() => this.setState({couponcode:""})}
          >
            <Image
              style={styles.closeButton}
              source={require("./images/minus2.png")}
            />
          </TouchableOpacity>
        </View>
<TouchableOpacity onPress={()=>this.getofferforId(this.state.couponcode)} style={{width:100,height:40,borderWidth:1,borderColor:'#1B1BD0',backgroundColor:'#FFFFFF',borderRadius:5,marginTop:-10}}><Text style={{textAlign:'center',textAlignVertical:'center',color:'#1B1BD0',height:40}}>APPLY</Text></TouchableOpacity>
</View>           
                    <View style={{height:400,backgroundColor:'#ffffff'}}>
                        <View style={{height:30,flexDirection:'column',width:width-30,alignself:'center'}}>
                        <Text style={{ width:width-30,fontFamily:'Lato-Regular',fontSize:11,textAlign:'right'}}>Sub-Total :{commonData.getTotalPrice()}</Text>
                        <Text style={{width:width-30,fontFamily:'Lato-Regular',fontSize:11,textAlign:'right'}}>GST(18%) : ₹{gst}</Text>
                        <Text style={{width:width-30,fontFamily:'Lato-Regular',fontSize:11,textAlign:'right'}}>Saving : ₹0</Text>
                  
                    <Text style={{ width:width-30,textAlign:'right',fontFamily:'Lato-Bold',fontSize:12,textAlign:'right'}}>GRAND TOTAL : {grandtotal}</Text>
                   
                    </View>
<Text style={{ marginHorizontal: 30 ,marginTop:20,fontFamily:"Lato-Regular",fontSize:10}}>SIGN BELOW</Text>
                    <SignatureCapture
                        style={styles.signature}
                        ref={sign}
                        onSaveEvent={_onSaveEvent}
                        onDragEvent={_onDragEvent}
                        showNativeButtons={false}
                        showBorder={true}
                        minStrokeWidth={0.1}
                        strokeColor={'black'}
                        maxSize={150}
                        backgroundColor="#f5f5f5"
                        showTitleLabel={true}
                        viewMode={'portrait'}
                    />
                    	<TouchableOpacity
						style={styles.buttonStylereset}
						onPress={() => {
							resetSign1();
						}}>
					
            <Text style={{width:100, color:'red',height:30,textAlign:'center',textDecorationLine: 'underline',
            textShadowColor: 'rgba(0, 0, 0, 0.25)',
  textShadowOffset: {width: -1, height: 1},
  textShadowRadius: 10
  }}>Clear Signature</Text>
					</TouchableOpacity>
                   
			
					<TouchableHighlight
						style={styles.ProceedbuttonStyle}
						onPress={() => {
							saveSign1();
						}}>
						<Text style={{color:'#1B1BD0',fontFamily:'Lato-Bold'}}>Confirm Order</Text>
					</TouchableHighlight>
          </View>
				</View>
                    <View  >
                    
                         </View>

                </View>
      );
    }
    if(this.state.headers){
      return(        
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <View style={{width:screenwidth-20,height:450, backgroundColor:'#ffffff',alignItems:'center'}}>
      <Card 
              style={[styles.signIn,styles.shadowProp]}>
              <Text style={{height:40,width:screenwidth-20,backgroundColor:'#ffffff',fontFamily:'Lato-Regular',fontSize:20,color:'#1B1BD0',textAlignVertical:'center',textAlign:'center'}}>Order Headers</Text>
              {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}
            </Card>
      {/* <Text style={{height:60,width:screenwidth-20,backgroundColor:'#ffffff',fontFamily:'Lato-Regular',fontSize:20,color:'#1B1BD0',textAlignVertical:'center',textAlign:'center'}}>Order Headers</Text> */}
      {/* <View style={{flexDirection:'row'}}> */}
      {/* <Text style={{height:40,width:screenwidth/2-70,fontSize:14,color:'grey',fontFamily:'Lato-Regular',marginTop:10,textAlign:'left',textAlignVertical:'center'}}>PO Number</Text> */}

      <TextInput
       label="PO Number"
               
       type="outlined"
          placeholderTextColor='#dddddd'
          underlineColor='#dddddd'
         
          activeUnderlineColor='#dddddd'
          outlineColor="#dddddd"
          selectionColor="#dddddd"
          autoCompleteType='off'
          autoCorrect={false}
          // style={{
          //   // Setting up Hint Align center.
          //   textAlign: 'center',
          //   fontSize:12,
          //   fontFamily:'Lato-Regular',
          //   marginTop:-2,
          //   // Setting up TextInput height as 50 pixel.
          //   // height: 37,
          //   // Set border width.
          //   // borderWidth: 1,
          //   // // Set border Hex Color Code Here.
          //   // borderColor: '#d5d5d5',
          //   // // Set border Radius.
          //   // borderRadius: 5,
          //   //Set background color of Text Input.
          //   backgroundColor: "#FFFFFF",
          //   width: width-110,
          //   fontStyle: 'italic',
          //   // marginTop: -1,
          //   marginHorizontal:-20,
          //   flex:0.49,
          //   fontFamily:'Lato-Regular'}}
// placeholder=" PO Number"
// autoCompleteType="off"
keyboardType="default"
// autoCapitalize="none"
underlineColorAndroid="transparent"
onChangeText={username => this.changedValue(username,0)}
clearButtonMode="always"
ref={username => { this.textInput = username }}
// autoCorrect={false}
style={{

backgroundColor:'white',
width:screenwidth-60,
// height: 40,
color: '#534F64',
// borderWidth: 1,
// borderColor:'#f0f0f0',
// fontFamily: 'Lato-Regular',
marginTop: 10,
// textAlign: 'center',
// borderRadius:10
}}
value={this.state.headernumber}
/>
<TextInput
       label="Reference #"
               
       type="outlined"
          placeholderTextColor='#dddddd'
          underlineColor='#dddddd'
         
          activeUnderlineColor='#dddddd'
          outlineColor="#dddddd"
          selectionColor="#dddddd"
          autoCompleteType='off'
          autoCorrect={false}
          // style={{
          //   // Setting up Hint Align center.
          //   textAlign: 'center',
          //   fontSize:12,
          //   fontFamily:'Lato-Regular',
          //   marginTop:-2,
          //   // Setting up TextInput height as 50 pixel.
          //   // height: 37,
          //   // Set border width.
          //   // borderWidth: 1,
          //   // // Set border Hex Color Code Here.
          //   // borderColor: '#d5d5d5',
          //   // // Set border Radius.
          //   // borderRadius: 5,
          //   //Set background color of Text Input.
          //   backgroundColor: "#FFFFFF",
          //   width: width-110,
          //   fontStyle: 'italic',
          //   // marginTop: -1,
          //   marginHorizontal:-20,
          //   flex:0.49,
          //   fontFamily:'Lato-Regular'}}
// placeholder=" PO Number"
// autoCompleteType="off"
keyboardType="default"
// autoCapitalize="none"
underlineColorAndroid="transparent"
onChangeText={username => this.changedValue(username,1)}
clearButtonMode="always"
ref={username => { this.textInput = username }}
// autoCorrect={false}
style={{

backgroundColor:'white',
width:screenwidth-60,
// height: 40,
color: '#534F64',
// borderWidth: 1,
// borderColor:'#f0f0f0',
// fontFamily: 'Lato-Regular',
marginTop: 10,
// textAlign: 'center',
// borderRadius:10
}}
value={this.state.headerref}
/>
<TextInput
       label="Comments"
               
       type="outlined"
          placeholderTextColor='#dddddd'
          underlineColor='#dddddd'
         
          activeUnderlineColor='#dddddd'
          outlineColor="#dddddd"
          selectionColor="#dddddd"
          autoCompleteType='off'
          autoCorrect={false}
          // style={{
          //   // Setting up Hint Align center.
          //   textAlign: 'center',
          //   fontSize:12,
          //   fontFamily:'Lato-Regular',
          //   marginTop:-2,
          //   // Setting up TextInput height as 50 pixel.
          //   // height: 37,
          //   // Set border width.
          //   // borderWidth: 1,
          //   // // Set border Hex Color Code Here.
          //   // borderColor: '#d5d5d5',
          //   // // Set border Radius.
          //   // borderRadius: 5,
          //   //Set background color of Text Input.
          //   backgroundColor: "#FFFFFF",
          //   width: width-110,
          //   fontStyle: 'italic',
          //   // marginTop: -1,
          //   marginHorizontal:-20,
          //   flex:0.49,
          //   fontFamily:'Lato-Regular'}}
// placeholder=" PO Number"
// autoCompleteType="off"
keyboardType="default"
multiline={true}
// autoCapitalize="none"
underlineColorAndroid="transparent"
onChangeText={username => this.changedValue(username,2)}
clearButtonMode="always"
ref={username => { this.textInput = username }}
// autoCorrect={false}
style={{

backgroundColor:'white',
width:screenwidth-60,
// height: 40,
color: '#534F64',
// borderWidth: 1,
// borderColor:'#f0f0f0',
// fontFamily: 'Lato-Regular',
marginTop: 10,
// textAlign: 'center',
// borderRadius:10
}}
value={this.state.headercomments}
/>
<TextInput
       label="Customer Address"
               
       type="outlined"
          placeholderTextColor='#dddddd'
          underlineColor='#dddddd'
         
          activeUnderlineColor='#dddddd'
          outlineColor="#dddddd"
          selectionColor="#dddddd"
          autoCompleteType='off'
          autoCorrect={false}
          // style={{
          //   // Setting up Hint Align center.
          //   textAlign: 'center',
          //   fontSize:12,
          //   fontFamily:'Lato-Regular',
          //   marginTop:-2,
          //   // Setting up TextInput height as 50 pixel.
          //   // height: 37,
          //   // Set border width.
          //   // borderWidth: 1,
          //   // // Set border Hex Color Code Here.
          //   // borderColor: '#d5d5d5',
          //   // // Set border Radius.
          //   // borderRadius: 5,
          //   //Set background color of Text Input.
          //   backgroundColor: "#FFFFFF",
          //   width: width-110,
          //   fontStyle: 'italic',
          //   // marginTop: -1,
          //   marginHorizontal:-20,
          //   flex:0.49,
          //   fontFamily:'Lato-Regular'}}
// placeholder=" PO Number"
// autoCompleteType="off"
keyboardType="default"
// autoCapitalize="none"
underlineColorAndroid="transparent"
onChangeText={username => this.changedValue(username,3)}
clearButtonMode="always"
ref={username => { this.textInput = username }}
// autoCorrect={false}
style={{

backgroundColor:'white',
width:screenwidth-60,
// height: 40,
color: '#534F64',
// borderWidth: 1,
// borderColor:'#f0f0f0',
// fontFamily: 'Lato-Regular',
marginTop: 10,
// textAlign: 'center',
borderRadius:10
}}
multiline={true}
value={this.state.headeraddress}
/>
{/* <TextInput
       label="PO Number"
               
       type="outlined"
          placeholderTextColor='#dddddd'
          underlineColor='#dddddd'
         
          activeUnderlineColor='#dddddd'
          outlineColor="#dddddd"
          selectionColor="#dddddd"
          autoCompleteType='off'
          autoCorrect={false}
          // style={{
          //   // Setting up Hint Align center.
          //   textAlign: 'center',
          //   fontSize:12,
          //   fontFamily:'Lato-Regular',
          //   marginTop:-2,
          //   // Setting up TextInput height as 50 pixel.
          //   // height: 37,
          //   // Set border width.
          //   // borderWidth: 1,
          //   // // Set border Hex Color Code Here.
          //   // borderColor: '#d5d5d5',
          //   // // Set border Radius.
          //   // borderRadius: 5,
          //   //Set background color of Text Input.
          //   backgroundColor: "#FFFFFF",
          //   width: width-110,
          //   fontStyle: 'italic',
          //   // marginTop: -1,
          //   marginHorizontal:-20,
          //   flex:0.49,
          //   fontFamily:'Lato-Regular'}}
// placeholder=" PO Number"
// autoCompleteType="off"
keyboardType="default"
// autoCapitalize="none"
underlineColorAndroid="transparent"
onChangeText={username => this.changedValue(username,3)}
clearButtonMode="always"
ref={username => { this.textInput = username }}
// autoCorrect={false}
style={{

backgroundColor:'white',
width:screenwidth-60,
// height: 40,
color: '#534F64',
borderWidth: 1,
borderColor:'#f0f0f0',
// fontFamily: 'Lato-Regular',
marginTop: 10,
// textAlign: 'center',
borderRadius:10
}}
value={this.state.headernumber}
 />  */}
<View style={{flexDirection:'row',width:width-80,alignSelf:'center',backgroundColor:'#ffffff',height:60,marginTop:20,justifyContent:'space-between'}}>
   
<View style={{width:(width-80)/2,height:60}}>
<Card style={{ height: 40, width: 120, backgroundColor: 'white',alignSelf:'center',justifyContent:'center',borderRadius:8}}>
             <TouchableOpacity    onPress={()=>this.save()}>
            
            <Text style  ={{fontFamily:"Lato-Regular",height: 40,width:120,textAlign:'center',color: 'green',
    // fontFamily:"Lato-Bold",
    textAlignVertical:'center',
    // fontWeight: 'bold',
    backgroundColor:'white'}}>SAVE</Text>
              </TouchableOpacity>
             </Card>
{/* <TouchableOpacity onPress={()=>this.save()} >
                <LinearGradient
              colors={['#ffffff', '#ffffff']}
              style={styles.headersave}>
              <Text style={styles.sendview}>SAVE</Text>
            </LinearGradient>
            </TouchableOpacity> */}
</View>
<View style={{width:(width-80)/2,height:60}}>
<Card style={{ height: 40, width: 120, backgroundColor: 'white',alignSelf:'center',justifyContent:'center',borderRadius:8}}>
             <TouchableOpacity    onPress={()=>this.cancel()}>
            
            <Text style  ={{fontFamily:"Lato-Regular",height: 40,width:120,textAlign:'center',color: 'red',
    // fontFamily:"Lato-Bold",
    textAlignVertical:'center',
    // fontWeight: 'bold',
    backgroundColor:'white'}}>CANCEL</Text>
              </TouchableOpacity>
             </Card>
{/* <TouchableOpacity onPress={()=>{this.cancel()}}>
                <LinearGradient
              colors={['#ffffff', '#ffffff']}
              style={styles.headersave}>
              <Text style={styles.deleteview}>CANCEL</Text>
            </LinearGradient>
            </TouchableOpacity> */}
</View>
</View>
{commonData.isOrderOpen==false?
<Text style={{fontFamily:'Lato-Regular',color:'red'}}>There is no Active order to save the headers.</Text>:undefined}
      </View>
      </View>);
    }
    if (this.state.isloading==true) {
      return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' ,backgroundColor: 'rgba(52, 52, 52, 0.8)'}}>
              <ActivityIndicator />
              <Text style={{fontFamily:'Lato-Regular'}}>Please wait,</Text>
              <Text style={{fontFamily:'Lato-Regular'}}>While we are Processing your order</Text>
          </View>
      );
  }
    if (!this.state.Start_Scanner) {
      return (
          <View style={{ backgroundColor: '#FFFFFF',flex:1}}>
            <View style={{ flexDirection: 'row', backgroundColor: '#FFFFFF' ,marginHorizontal:5,alignContent:'center',justifyContent:'center'}}>
              <Text style={{ alignSelf: "center",justifyContent:'center', color: '#1B1BD0', fontSize: 20,fontWeight:"700",marginTop: 40,fontFamily:'Lato-Regular' }}>My Cart</Text>
              </View>
              {/* <View style={{ alignSelf:'center',marginTop:0, backgroundColor: '#FFFFFF',height: 50, flexDirection:'row',alignItems:'center',justifyContent:'space-between' }}> */}
              <View style={{ alignSelf:'center',marginTop:0, backgroundColor: '#FFFFFF',height: 50, flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:20,width:width-30,backgroundColor:'white' }}>
           
                  <TouchableOpacity style={{marginTop:0}} onPress={this.searchItem} >
              {/* <Image transition={false} source={require('./images/search.png')} style={{ height: 40, width: 40, marginHorizontal: 10,marginTop: -14}}></Image> */}
              <Card 
              style={[styles.signInplus,styles.shadowProp]}>
              <Text style={styles.textSignplus}>+</Text>
          </Card>
            </TouchableOpacity>

              <TouchableOpacity style={{
                color:'#ffffff',
                // marginLeft:-10,
             
                
              }}
                onPress={() =>{{(commonData.isOrderOpen==true)?this.setState({headers:true}):Alert.alert("Warning","There is no active order")}}}>
                     <Image transition={false} source={require('./images/header.png')} style={{ width: 34, height: 40,resizeMode:"contain"}}></Image>
                {/* <Text style={{ width: 100, height: 40, textAlign: 'center', textAlign: 'center', marginTop: -5,color:'white' }}>SEND</Text> */}
                </TouchableOpacity>
                <TouchableOpacity style={{
                color:'red',
                // marginLeft:0
              }}
                onPress={() => this.state.arrayHolder.length > 0 ?
                  Alert.alert(
                    //title
                    'Confirmation',
                    //body
                    'Do you want to send an order?',
                    [
                      { text: 'Yes', onPress: () => this.SignandProceed() },
                      { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
                    ],
                    { cancelable: false }
                    //clicking out side of alert will not cancel
                  ) : Alert.alert('Please add items to the order')}>
                     {/* <Image transition={false} source={require('./images/send.png')} style={{ width: 74, height: 40, marginTop: -14,resizeMode:"contain"}}></Image> */}
                {/* <Text style={{ width: 100, height: 40, textAlign: 'center', textAlign: 'cener', marginTop: -5,color:'white' }}>SEND</Text> */}
                {/* <LinearGradient
              colors={['#ffffff', '#ffffff']} */}
              <Card
              style={[styles.signIn,styles.shadowProp]}>
              <Text style={styles.sendview}>SEND</Text>
              {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}
            </Card>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.state.arrayHolder.length > 0 ?
                  Alert.alert(
                    //title
                    'Confirmation',
                    //body
                    'Order will be saved locally , Saved orders will not be recieved by the office unless send button is pressed. Do you wish to continue?\n\nDisclaimer: Orders saved locally will be lost if you uninstall the application. ',
                    [
                      { text: 'Yes', onPress: () => this.saveorderShow() },
                      { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
                    ],
                    { cancelable: false }
                    //clicking out side of alert will not cancel
                  ) : Alert.alert('Please add items to the order')} >
                {/* <Image transition={false} source={require('./images/save.png')} style={{ width: 74, height: 40, marginTop: -14,resizeMode:"contain"}}></Image> */}
                <Card
              style={styles.signIn}>
              <Text style={styles.saveview}>SAVE</Text>
              {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}
            </Card>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => commonData.isOrderOpen&&this.state.arrayHolder.length > 0 ?
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
                  ) : (commonData.isOrderOpen==false ?Alert.alert("Warning",'There is no Active order'):Alert.alert("Warning",'There are no Items in your cart to Delete'))}>
                     
                <Card
              style={styles.signIn}>
              <Text style={styles.deleteview}>DELETE</Text>
            </Card>
              </TouchableOpacity>
                
            </View>
            {/* <View style={{ height: 50,backgroundColor:'red' }}> */}
              <View style={{ marginTop:0,alignSelf:'center', backgroundColor: '#FFFFFF',width:width-10,height: 50, flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>

                {this.state.QR_Code_Value.includes("http") ?
                  <TouchableOpacity
                    onPress={this.openLink_in_browser}
                    style={styles.button}>
                    <Text style={{ color: '#FFF', fontSize: 14,fontFamily:'Lato-Regular' }}>Open Link in default Browser</Text>
                  </TouchableOpacity> : null
                }
                <TouchableOpacity  onPress={() => commonData.isOrderOpen ? this.open_QR_Code_Scanner() : Alert.alert('There is no Active order')} style={{ marginTop: 10,marginHorizontal:5,flex:0.15}}>
                  <Image transition={false} source={require('./images/barcode.png')} style={{ height: 36, width: 50 ,marginTop:-10}}></Image>
                </TouchableOpacity>
              
                <TextInput 
                label="Product ID"
               
               type="outlined"
                  placeholderTextColor='#dddddd'
                  underlineColor='#dddddd'
                 
                  activeUnderlineColor='#dddddd'
                  outlineColor="#dddddd"
                  selectionColor="#dddddd"
                  autoCompleteType='off'
                  autoCorrect={false}
                  style={{
                    // Setting up Hint Align center.
                    textAlign: 'center',
                    fontSize:12,
                    fontFamily:'Lato-Regular',
                    marginTop:-2,
                    // Setting up TextInput height as 50 pixel.
                    // height: 37,
                    // Set border width.
                    // borderWidth: 1,
                    // // Set border Hex Color Code Here.
                    // borderColor: '#d5d5d5',
                    // // Set border Radius.
                    // borderRadius: 5,
                    //Set background color of Text Input.
                    backgroundColor: "#FFFFFF",
                    width: width-110,
                    fontStyle: 'italic',
                    // marginTop: -1,
                    marginHorizontal:-20,
                    flex:0.49,
                    fontFamily:'Lato-Regular'}}
                    onChangeText={(itemID) => this.setState({ itemID })}
                    value={this.state.text}
                    >{this.state.itemID}</TextInput>
                     <TouchableOpacity onPress={this.joinData} style={{ marginTop: 0,flex:0.25 }}>
                {/* <Image transition={false} source={require('../components1/images/additems.png')} style={{ height: 40, width: 100, marginHorizontal: 0, resizeMode: 'contain' }}></Image> */}
                <Card 
              style={[styles.signIn,styles.shadowProp]}>
              <Text style={styles.textSign}>+ADD</Text>
              {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}
            </Card>
              </TouchableOpacity>
                
              </View>
               <Text style={{ color: '#34495A',fontFamily:'Lato-Regular', fontWeight: 'bold', marginTop: 5, marginHorizontal: 25 ,height:30}}>Order Totals:</Text>
              <View style={{flexDirection:'row',marginTop:-10,marginHorizontal:5,backgroundColor:'#FFFFFF'}}> 
                  <Text style={{marginHorizontal:20,color:'#34495A',fontFamily:'Lato-Regular'}}>
                    Items: {this.state.TotalItem}
                  </Text>
                  <Text style={{marginHorizontal:60,color:'#34495A',fontFamily:'Lato-Regular'}}>
                    Qty: {Number(this.state.TotalQty)}
                  </Text>
                  <Text style={{marginHorizontal:10,color:'#34495A',fontFamily:'Lato-Regular'}}>
                    Price: ₹{this.state.TotalPrice}
                  </Text>
              </View> 
            {/* <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                contentContainerStyle={styles.ScrollView}
                horizontal={true}
                scrollEnabled={scrollEnabled}
                onContentSizeChange={this.onContentSizeChange}>
                <View style={{flexGrow:1,justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',marginTop:10}}>
                <FlatList
                  data={this.state.arrayHolder}
                  extraData={this.state.refresh}
                  renderItem={this.sampleRenderItem}
                  keyExtractor={(item, index) => toString(index)}
                  ItemSeparatorComponent={this.renderSeparator} />
                  </View>
              </ScrollView> */}
               <View style={{flexGrow:1,marginTop:0,height:610}}>
                <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                contentContainerStyle={styles.scrollview}
                scrollEnabled={scrollEnabled}
                onContentSizeChange={this.onContentSizeChange}>
                <View style={{flexGrow:1,justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',marginTop:0,height:height-300}}>
                    <FlatList
                        data={this.state.arrayHolder}
                        renderItem={this.sampleRenderItem}
                        extraData={this.state.refresh}
                        keyExtractor={(item, index) => toString(index,item)}
                        ItemSeparatorComponent={this.renderSeparator} 
                    />
                    </View>
                </ScrollView>
                </View>
          </View>
      );
    }
    this.resignView();
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


AddItem = (Qty,itemid,type) => {
   this.state.itemID=itemid
   this.state.qty=Qty
   this.AddorDelete(type)
}
SignItemsView = ({ item, index }) => (
<View style={styles.flatliststyle1}>  
  <View style={{ flexDirection: "row",justifyContent:'center',alignItems:'center', backgroundColor:'#ffffff',width:width-10,alignSelf:'center' ,height:40}} >
   <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'200',fontFamily:'Lato-Bold',fontSize:12, width:width/2.5,marginHorizontal:20}}>{item.description}</Text>
   <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'200',fontFamily:'Lato-Bold',fontSize:12,width:width/4.5,marginHorizontal:2}}>{Number(item.qty)}</Text>
   <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'200',fontFamily:'Lato-Bold',fontSize:12,width:width/3.5,marginHorizontal:2}}>₹{Number(item.price)}</Text>
  </View>
</View>
 
)
sampleRenderItem = ({ item, index }) => (
        
  <View style={styles.flatliststyle}>
    <ImageBackground source={require('./images/itembg.png')} style={styles.flatrecord}>
      <View style={{flexDirection:'row'}}>
      <View style={{flexDirection:"row",backgroundColor:'#ffffff',width:110}}>
      <TouchableOpacity style={{height: 80, width: 80,marginHorizontal:19,marginTop:27}} onPress={() => this.props.navigation.navigate('Itemdetails',
                 {storeID:item.itemid,desc:item.description,onHand:item.extrainfo1,itemImage:require('./images/itemImage/IRG-14.jpg'), qty:item.qty,from:'SKU',price:item.price,upc:item.upc,weight:item.weight})}>
          <Image source={require('./images/itemImage/IRG-14.jpg')} style={{ height: 80, width: 80, marginTop: 10,marginHorizontal:10, resizeMode: 'contain' }} />
      </TouchableOpacity>
      <Text  style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:120,marginHorizontal:-80}}>{item.itemid}</Text>
      <Image source={require('./images/line.png')} style={{ height: 100, width: 80, marginTop: 33,marginHorizontal:73, resizeMode: 'contain' }} />
      </View>
      <View style={{marginHorizontal:10,flexDirection:'column'}}>
        <Text style={{color:'#7A7F85',borderBottomColor:'#7A7F85',fontFamily:'Lato-Regular',marginTop:23}}>Net wt: {Number(item.weight)} {item.unitofmeasure}</Text>
        <Image source={require('./images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain' }} />
        <Text style={{color:'#34495A',fontWeight:"500",fontFamily:'Lato-Bold',fontSize:14,marginTop:0,width:190,height:35}}>{item.description}</Text>
        {(Number(item.stock)>0)?<Text style={{color:'#1D8815',fontFamily:'Lato-Regular',fontSize:12,marginTop:10}}>{item.stock} - On Hand</Text>:<Text style={{color:'#1D8815',fontFamily:'Lato-Regular',fontSize:12,marginTop:10}}>Out of stock!!</Text>}
        <Text style={{color:'grey',fontFamily:'Lato-Bold',fontSize:12,marginTop:0}}>{item.noofdays} days Older</Text>
        </View>
        <View style={{height: 20, width: 20,marginHorizontal:-10,flexDirection:'column',alignItems:'center'}}>
      {/* <View style={{height: 20, width: 20, marginTop:27,marginHorizontal:-80}}> */}
       <TouchableOpacity style={{marginTop:30,marginHorizontal:90}} onPress={() => Alert.alert(
          //title
          'Confirmation',
          //body
          'Do you want to delete the selected Item?',
          [
            { text: 'Yes', onPress: () => this.deleteItms(item.itemid) },
            { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
          ],
          { cancelable: false }
          //clicking out side of alert will not cancel
        )}>
      <Image transition={false} source={require('./images/minus2.png')} style={{ height: 20, width: 20, resizeMode: 'contain' }} />
      </TouchableOpacity>
      <Text style={{color:'#000000',borderBottomColor:'#000000',fontWeight:'100',textAlign:'center',fontFamily:'Lato-Bold',width:60,marginTop:20}}>₹{Number(item.price)}</Text>

      {/* </View> */}
      </View>
      <View style={{ width: 120, height: 40, flexDirection: 'row',marginTop:88,marginHorizontal:-80, borderRadius: 5, borderColor: 'grey', backgroundColor: '#ffffff' }}>
              <TouchableOpacity onPress={()=>{this.AddItem(Number(item.qty),item.itemid,'-')}} style={{ width: 30, height: 40 }}>
                  {/* <Image source={require('./images/minus.png')} style={{ width: 30, height: 30, marginTop: 12, marginHorizontal: 6 }}></Image> */}
                  <Text style={{ textAlign: 'center', textAlignVertical: 'center',borderWidth: 1,
              borderColor: '#CAD0D6', alignContent: 'center', alignSelf: 'center', fontWeight: 'bold', 
             fontSize: 16,borderRadius:8, width: 40, height: 30,marginTop:11,marginHorizontal:10}}>-</Text>
             
              </TouchableOpacity>
              <Text style={{ textAlign: 'center', textAlignVertical: 'center',borderWidth: 1,
              borderColor: '#CAD0D6', alignContent: 'center', alignSelf: 'center', fontWeight: 'bold', 
             fontSize: 12,borderRadius:8, width: 40, height: 30,marginTop:12,marginHorizontal:10}}>{Number(item.qty)}</Text>
              <TouchableOpacity onPress={()=>{this.AddItem(Number(item.qty),item.itemid,'+')}} style={{ width: 30, height: 40 }} >
                  {/* <Image source={require('./images/add.png')} style={{ width: 30, height: 30, marginTop: 12,marginHorizontal:-7}}></Image> */}
                  <Text style={{ textAlign: 'center', textAlignVertical: 'center',borderWidth: 1,
              borderColor: '#CAD0D6', alignContent: 'center', alignSelf: 'center', fontWeight: 'bold', 
             fontSize: 16,borderRadius:8, width: 40, height: 30,marginTop:11,marginHorizontal:10}}>+</Text>
             
              </TouchableOpacity>
          </View>
      </View>
   </ImageBackground>
   </View>
      
 
)


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    height: 500,
  },
  ScrollView: {
    flexGrow: 1,
  },
  scrollview:{
    // flexGrow:1,
    // height:height-480
    // justifyContent: "space-between",
    // padding: 10,
  },
    flatliststyle: {
    marginTop: -12,
    height: 200,
    width:width-30,
    backgroundColor:'#FFFFFF' ,
    alignSelf:'center',
    marginVertical: -40,
    resizeMode:"contain"
    },
    flatrecord: {
      height: 180,
      width:width-30,
      backgroundColor:'#FFFFFF' ,
      alignSelf:'center',
      resizeMode:"contain"
      },
  button1:{
    backgroundColor: "#00C851",
    
    width: "25%",
    height:45,
    
    textAlign:"center",
    alignItems:"center",
    justifyContent:"center",
    fontSize:17,
    borderRadius:10
    
    
    
  },
  signature: {
    flex: 0,
    borderColor: '#ffffff',
    borderWidth: 1,
    color: '#ffffff',
    width: '85%',
    height:80,
    marginHorizontal: 30
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
    // padding: 12,
    // marginHorizontal:40,
    width: 60,

  },
  backStyle:{
   
      fontSize: 20,
      width:30,
      height:30,
      marginHorizontal:width-60,
      // borderWidth:2.0,
      borderRadius:15,
      marginTop:5,
      textAlign:'center',
      textAlignVertical:'center',
      fontWeight:'bold',
      fontFamily:'Lato',
      backgroundColor:'#ffffff',
  },
  	titleStyle: {
		fontSize: 20,
    width:140,
    textAlign:'center',
    textAlignVertical:'center',
    fontWeight:'bold',
    fontFamily:'Lato',
		backgroundColor:'#ffffff',
		// margin: 10,
   
	},
  titleStyle1: {
    fontSize:10,
		color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'900',fontFamily:'Lato-Bold',margin:10
	},
  flatliststyle2: {
    marginTop: -12,
    height: 200,
    width: width - 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: -30,
    alignSelf: 'center',
    marginVertical: -40,
    resizeMode: "contain"
  },
  flatliststyle1: {
    
    height: 30,
    alignContent:'center',
    width: width -20,
    // backgroundColor: 'red',
    alignSelf: 'center',
    resizeMode: "contain"
  },
  flatrecord1: {
    // marginTop: -1,
    height: 180,
    width: width + 30,
    backgroundColor: '#FFFFFF',
    // marginHorizontal: -30,

    alignSelf: 'center',
    // marginVertical: -30,
    resizeMode: "stretch"
  },
  flatrecord: {
    // marginTop: -1,
    height: 180,
    width: width + 30,
    backgroundColor: '#FFFFFF',
    // marginHorizontal: -30,

    alignSelf: 'center',
    // marginVertical: -30,
    resizeMode: "stretch"
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
		margin: 0,
	},
  signIn: {
   
    width: 70,
    height: 35,
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
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headersave: {
  
    width: 120,
    height: 35,
    // borderColor:'#1B1BD0',
    borderRadius:8,
    // borderWidth:1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    alignSelf:'center',
//     shadowColor: '#000',
// shadowOffset: { width: 0, height: 2 },
// shadowOpacity: 0.5,
// shadowRadius: 2,
// elevation: 4 ,
  
  },
  textSign: {
      color: '#1B1BD0',
      // fontWeight: 'bold',
      fontFamily:'Lato-Regular'
    },
  deleteview:{
    color: 'red',
   
    //  fontWeight: 'bold',
     fontFamily:'Lato-Regular'
  },
  sendview:{
    color: 'green',
    //  fontWeight: 'bold',
     fontFamily:'Lato-Regular'
  },
  saveview:{
    color: '#800080',
    //  fontWeight: 'bold',
     fontFamily:'Lato-Regular'
  },
  buttonStyle: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: 30,
		backgroundColor: '#eeeeee',
		margin: 10,
	},
  buttonStylereset: {
    width:"85%",
		justifyContent: 'center',
		alignItems: 'center',
		height: 30,
    
		marginHorizontal:width-160,
		// margin: 10,
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
      fontFamily:'Lato-Regular'
    },
  image: {
    height: 30,
    width: 30,
    marginHorizontal: 30,
    marginTop: 30

  },
  parent: {
    // marginLeft: 25,
    // marginRight: 25,
    borderColor: "gray",
    borderRadius: 5,
    // borderWidth: 1,
    flexDirection: "row",
    // justifyContent: "space-between",
    backgroundColor:'white',
    borderRadius:10,
    width: width-150,
marginHorizontal:10,
paddingRight:10,
marginTop:-10,
height:50,
color: '#534F64',
borderWidth: 1,
borderColor:'white',
borderBottomColor:'#dddddd'
// borderColor:'#d5d5d5',
  },
  textInput: {
    height: 40,
    width: width-170,
    fontFamily:'Lato-Regular',


textAlign: 'center',


  },
  closeButton: {
    height: 16,
    width: 16,
    marginHorizontal:0
  },
  closeButtonParent: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
    marginTop:-20
  },
});
export { orderfromHistory }
export default OrderItem;