'use strict';




var React = require('react-native');
var {
  AsyncStorage,
} = React;
var RNFS = require('react-native-fs');
import {images} from '../components1/images/images'
import NetInfo from "@react-native-community/netinfo";
import moment from 'moment';
import { getDeviceNameSync } from 'react-native-device-info';
// const GET_DATAURL='http://192.168.9.14:8080/get_data_s.php'
const Constants = require('../components1/Constants');
export default class CommonDataManager {
  _Username=""
  SharedItemArray=[]
    static myInstance = null;
    connection_Status = "ONLINE"
    offercount="0";
    pendingcount="0";
    completedcount="0";
    skucount="0";
    storescount="0";
    orderscount="0";
    _filename=[]
    context=''
    _userID = "";
    _ActiveCustomerID="";
    sessionid=''
uid="";
    _ActiveCustName="";
    _TotalItems="";
    _TotalQty="";
    _TotalPrice="";
    _ActiveAddress=""
    _OrderId=""
    logintype=""
    _CurrentArray=[]
    _LoadArray = []
  _StoreArray = []
  _OffersArray=[]
  _OrderArray = []
  _SkuArray =[]
  _UnsentArray=[]
  _unsentfilelist=[]
  orderitemArray=[]
    isOrderOpen=false
    loggedin=false
    isRegistered=false
    inventoryItems=[]
    _PH_POtype=""
    _PH_PONumber=""
    _PH_Comments=""
    _codeDetails="";
    token="";
    email="";
    currentfile="";
    /**
     * @returns {CommonDataManager}
     */
    static getInstance() {
        if (CommonDataManager.myInstance == null) {
            CommonDataManager.myInstance = new CommonDataManager();
        }

        return this.myInstance;
    }
    getPOnumber(){
      return this._PH_PONumber;
    }
    setPOnumber(value){
      this._PH_PONumber=value;
    }
    getoffercount(){
      return this.offercount;
    }
    setoffercount(value){
      this.offercount=value;
    }
    getpendingcount(){
      return this.pendingcount;
    }
    setpendingcount(value){
      this.pendingcount=value;
    }
    getcompletedcount(){
      return this.completedcount;
    }
    setcompletedcount(value){
      this.completedcount=value;
    }
    getskucount(){
      return this.skucount;
    }
    setskucount(value){
      this.skucount=value;
    }
    getstorescount(){
      return this.storescount;
    }
    setstorescount(value){
      this.storescount=value;
    }
    getorderscount(){
      return this.orderscount;
    }
    setorderscount(value){
      this.orderscount=value;
    }
    getPOType(){
      return this._PH_POtype;
    }
    setPOType(value){
      this._PH_POtype=value;
    }
    getPOComments(){
      return this._PH_Comments;
    }
    setPOComments(value){
      this._PH_Comments=value;
    }
    getusername(){
      return this._Username;
    }
    setusername(name){
      this._Username=name;
    }
    getFBToken(){
      return this.token;
    }
    setFBToken(token){
      this.token=token;
    }
    getemail(){
      return this.email;
    }
    setemail(email){
      this.email=email;
    }
    getLoginType(){
      return this.logintype;
    }
    setLoginType(name){
      this.logintype=name;
    }
    getCouponDetails(){
      return this._codeDetails;
    }
    setCouponDetails(code){
      this._codeDetails=code;
    }
    getsessionId(){
      return this.sessionid;
    }
   getuid()
   {
     return this.uid;
   }
   setuid(id){
     this.uid=id;
   }
    setsessionId(Id){
      this.sessionid=Id;
    }
    setArray(array){
      this._CurrentArray=array
     
    }
    setContext(str){
      this.context=str
    }
    getContext() {
      return this.context;
    }
    setItemArray(array){
      this.SharedItemArray=array
    }
    getCurrentArray() {
      return this._CurrentArray;
    }
   getItemArray(){

     return this.SharedItemArray;
   }
   getcurrentfile(){
     return this.currentfile;
   }
   setcurrentfile(name){
     this.currentfile=name;
   }
   setstoresArray(array) {
    this._StoreArray = array;
  }
  getstoresArray() {
    return this._StoreArray;
  }
  setoffersArray(array) {
    this. _OffersArray = array;
  }
  getoffersArray() {
    return this._OffersArray;
  }
  setinventoryItemsArray(array) {
    this.inventoryItems = array;
  }
  getinventoryItemsArray() {
    return this.inventoryItems;
  }
  setorderssArray(array) {
    let sortedarray= array.sort((a, b) => (a.date_modified < b.date_modified) ? 1 : -1)

    this._OrderArray = array;
  }
  setSkuArray(array) {
    this._SkuArray = array;
    this.SharedItemArray=array
  }
  getSkuArray() {
    return this._SkuArray;
  }
  getordderssArray() {
    return this._OrderArray;
  }
    getUserID() {
        return this._userID;
    }
    getOrderId() {
      return this._OrderId;
  }
  getfunction(contents){
    console.log("function which call here for saving my orders")
    console.log(contents,"contents lenghthgghggg....................")
    let tempArray=[]
    for (var i=0;i<contents.length;i++)
    {
     tempArray.push({
       'itemid':contents[i].itemid,
       'description':contents[i].description,
       'price':contents[i].price,
       'qty':contents[i].qty,
       'upc':contents[i].upc,
       'imgsrc':contents[i].imgsrc

      })
     console.log(tempArray, "temp here")
   }
  return tempArray;
  }
  
  getorderitemArray(){
    return this.orderitemArray
  }
  setorderitemArray(array)
  {
    this.orderitemArray=[...array]
  }
  setOrderId(id) {
    this._OrderId = id;
}
    setUserID(id) {
        this._userID = id;
    }
    getUserID() {
      return this._userID;
  }

  getUserID() {
    return this._userID;
}
setCustInfo(custmerid,name,address){
  this._ActiveCustName=name;
  this._ActiveCustomerID=custmerid;
  this._ActiveAddress=address;

}
setRunningTotals(price,qty,items) {
    
    this._TotalPrice= '₹'+price;
    this._TotalItems=items;
    this._TotalQty=qty;
}
getActiveAdress() {
  return this._ActiveAddress;
}
getActiveCustName() {
  return this._ActiveCustName;
}
getcustomerName(){
return this.custName;
}
setcustomerName(name){
this.custName=name;
}
getActiveCustomerID() {
  return this._ActiveCustomerID;
}
getTotalPrice() {
  return this._TotalPrice;
}
getTotalItems() {
  return this._TotalItems;
}
getTotalQty() {
  return this._TotalQty;
}
checknetwork(){
  NetInfo.isConnected.addEventListener(
    'connectionChange',
    this._handleConnectivityChange
);
NetInfo.isConnected.fetch().done((isConnected) => {

  if(isConnected == true)
  {
    this.connection_Status ="ONLINE"
  
  }
  else
  {
    this.connection_Status ="OFFLINE"
  }

});

}
_handleConnectivityChange = (isConnected) => {
  const info =  NetInfo.getConnectionInfo();
  console.log('%%%%%%%%%%',info)
  if(isConnected == true)
    {
      this.connection_Status ="ONLINE"
    }
    else
    {
        this.connection_Status = "OFFLINE"
        
    }
};

resetHandler(){
  NetInfo.isConnected.removeEventListener(
    'connectionChange',
    this._handleConnectivityChange

);
}
resetValues(){
  this._userID="";
  this._ActiveCustomerID="";
  this._ActiveCustName="";
  this.custName="";
  this._TotalItems="";
  this._TotalQty="";
  this._TotalPrice="";
  this._ActiveAddress=""
  this._OrderId=""
  this.isOrderOpen=false
  

}
getCurrentDate()
{
  // var date = new Date().getDate(); //Current Date
  // var month = new Date().getMonth() + 1; //Current Month
  // var year = new Date().getFullYear(); //Current Year
  // var hours = new Date().getHours(); //Current Hours
  // var min = new Date().getMinutes(); //Current Minutes
  // if(min)
  // var sec = new Date().getSeconds(); //Current Seconds
  // var datetime=date+'-'+month+'-'+year+' '+hours+':'+min+':'+sec
  var date = moment()
      .utcOffset('+05:30')
      .format('YYYY-MM-DD hh:mm:ss a');
  return date
}
getunsentlist=(filename)=>{
  moment.locale('en');
   let tempArray=[]
   
   for (var i=0;i<filename.length;i++)
   {
    var custid = filename[i].name.split("CNID-")[1];
    custid=custid.split("Nme-")[0];
    var custname = filename[i].name.split("Nme-")[1];
    custname=custname.split("ADD-")[0];
    var address=filename[i].name.split("ADD-")[1];
    address=address.split(".json")[0];
    var orderid=filename[i].name.split("UN_")[1];
    orderid=orderid.split("CNID-")[0];
    let cnt=filename[i].name.split("LNT-")[1];
    cnt=cnt.split("cntP-")[0];
    
    let cntP=filename[i].name.split("cntP-")[1];
    cntP=cntP.split(".json")[0];
     tempArray.push({
       orderid:filename[i].name,
       name:filename[i].name,
       oid:orderid,
       orderstatus:'UNSENT',
       customerid:custid,
       custname:custname,
       address:address,
       cnt:cnt,
       cntP:cntP,
       TimeStamp:filename[i].mtime.toString()//*timestamp fix
     })
    
   }
   return tempArray;
}
checkoutdateditem=(date)=>{
  var result=true;
  var msDiff = new Date(date).getTime() - new Date().getTime();    //Future date - current date
var noofdays = Math.floor(msDiff / (1000 * 60 * 60 * 24));
if(noofdays>179)
result=false;
return noofdays;
}
gettypeArray(jsonData,code) {
  let object=JSON.parse(jsonData);
  
  let tempArray = []
  if(code=='PO_01')
  {
    for(var i=0; i< object.length;i++)
  {
    tempArray.push({ 'addressline1': object[i].name_value_list.addressline1.value,
    'addressline2': object[i].name_value_list.addressline2.value,
    'country': object[i].name_value_list.country.value,
    'state': object[i].name_value_list.state.value,
    'name': object[i].name_value_list.name.value,
    'postalcode': object[i].name_value_list.postalcode.value,
    'creditlimit':object[i].name_value_list.creditlimit.value,
    'lastpaymentdate':object[i].name_value_list.lastpaymentdate.value,
    'lastsaleamount':object[i].name_value_list.lastsaleamount.value,
    'lastsaledate':object[i].name_value_list.lastsaledate.value,
    'due_amount_c':object[i].name_value_list.due_amount_c.value,
    'ispaymentdue':object[i].name_value_list.payment_due_c.value,
    'email':object[i].name_value_list.email.value,
     'storeid': object[i].name_value_list.customerid.value})
  }
  }
  else if(code=='PO_12'){
 console.log("PO_12*****************",object);
    for(var i=0; i< object.length;i++)
  {
   
  //   tempArray.push({ 'addressline1': object[i].link_value.addressline1.value,
  //   'addressline2': object[i].link_value.addressline2.value,
  //   'country': object[i].link_value.country.value,
  //   'state': object[i].link_value.addressline2.value,
  //   'name': object[i].link_value.name.value,
  //   'postalcode': object[i].link_value.postalcode.value,
  //   'creditlimit':object[i].link_value.creditlimit.value,
  //   'lastpaymentdate':object[i].link_value.lastpaymentdate.value,
  //   'lastsaleamount':object[i].link_value.lastsaleamount.value,
  //   'lastsaledate':object[i].link_value.lastsaledate.value,
  //   'due_amount_c':object[i].link_value.due_amount_c.value,
  //   'ispaymentdue':object[i].link_value.payment_due_c.value,
  //    'storeid': object[i].link_value.customerid.value})
  // }
  
  tempArray.push({ 'addressline1': object[i].addressline1,
    'addressline2': object[i].addressline2,
    'country': object[i].country,
    'state': object[i].addressline2,
    'name': object[i].name,
    'postalcode': object[i].postalcode,
    'creditlimit':object[i].creditlimit,
    'lastpaymentdate':object[i].lastpaymentdate,
    'lastsaleamount':object[i].lastsaleamount,
    'lastsaledate':object[i].lastsaledate,
    'due_amount_c':object[i].due_amount_c,
    'ispaymentdue':object[i].payment_due_c,
     'storeid': object[i].customerid})
  }
  }
 else if(code=='PO_04')
  {
    for(var i=0; i< object.length;i++)
  {
    tempArray.push({'orderid': object[i].name_value_list.orderid.value,
                   'id': object[i].name_value_list.id.value,
                   'record': object[i].name_value_list.name.value,
                   'orderstatus':object[i].name_value_list.orderstatus.value,
                   'type':object[i].name_value_list.type.value,
                   'totalvalue':object[i].name_value_list.totalvalue.value,
                   'date_modified':object[i].name_value_list.date_modified.value,
                   'last_modified':object[i].name_value_list.lastmodified.value})
  }
  }
  else if(code=='PO_14'){
    for(var i=0; i< object.length;i++)
    {
      console.log("ffff",object[i].name_value_list.aknowledgementnumber.value);
      tempArray.push({'orderid': object[i].name_value_list.orderid.value,
                     'id': object[i].name_value_list.id.value,
                     'record': object[i].name_value_list.name.value,
                     'orderstatus':object[i].name_value_list.orderstatus.value,
                     'type':object[i].name_value_list.customertype.value,
                     'totalvalue':object[i].name_value_list.value.value,
                     'date_modified':object[i].name_value_list.date_modified.value,
                      'aknowledgementnumber':object[i].name_value_list.aknowledgementnumber.value,
                      'customerid':object[i].name_value_list.customerid.value,
                      'po_number':object[i].name_value_list.po_number.value,
                      'comments':object[i].name_value_list.comments.value,
                      'location':object[i].name_value_list.location.value,
                      'totalitems':object[i].name_value_list.totalitem.value,
                     'last_modified':object[i].name_value_list.lastmodified.value})
    }
  }
  else if(code=='PO_D14'){
    for(var i=0; i< object.length;i++)
    {
      
      tempArray.push({'orderid': object[i].name_value_list.orderid.value,
                     'id': object[i].name_value_list.id.value,
                     'record': object[i].name_value_list.name.value,
                     'orderstatus':object[i].name_value_list.orderstatus.value,
                     'type':object[i].name_value_list.customertype.value,
                     'totalvalue':object[i].name_value_list.value.value,
                     'date_modified':object[i].name_value_list.date_modified.value,
                      'aknowledgementnumber':object[i].name_value_list.aknowledgementnumber.value,
                      'customerid':object[i].name_value_list.customerid.value,
                      'po_number':object[i].name_value_list.po_number.value,
                      'comments':object[i].name_value_list.comments.value,
                      'location':object[i].name_value_list.location.value,
                      'totalitems':object[i].name_value_list.totalitem.value,
                      'checked':"0",
                     'last_modified':object[i].name_value_list.lastmodified.value})
    }
  }
  
     else if(code=='PO_06'|| code=='PO_10')
  {
        for(var i=0;i< object.length;i++){
          var days=this.checkoutdateditem(object[i].name_value_list.manufactured_date.value);
          if(days<0){
         if(object[i].name_value_list.productid.value!=""){
          let itemid=object[i].name_value_list.productid.value
          let price=Number(object[i].name_value_list.baseprice.value)
          itemid=itemid.replace("&#039;","");
          var description = object[i].name_value_list.productdescription.value;
          description=description.replace("&#039;","");
          tempArray.push({'itemid':object[i].name_value_list.productid.value,
          'description':object[i].name_value_list.productdescription.value,
          'price':price,
          'qty':0,'upc':object[i].name_value_list.upc.value,
          'category':object[i].name_value_list.category.value,
          'subcategory':object[i].name_value_list.subcategory.value,
          'unitofmeasure':object[i].name_value_list.unitofmeasure.value,
          'manufacturer':object[i].name_value_list.manufacturer.value,
          'class':object[i].name_value_list.class.value,
          'pack':object[i].name_value_list.pack.value,
          'size':object[i].name_value_list.size.value,
          'weight':object[i].name_value_list.weight.value,
          'extrainfo1':object[i].name_value_list.extrainfo1.value,
          'extrainfo2':object[i].name_value_list.extrainfo2.value,
          'extrainfo3':object[i].name_value_list.extrainfo3.value,
          'extrainfo4':object[i].name_value_list.extrainfo4.value,
          'extrainfo5':object[i].name_value_list.extrainfo5.value,
          'imgsrc':images[itemid],
          'manufactured_date':object[i].name_value_list.manufactured_date.value,
          "stock":object[i].name_value_list.stock_c.value,
          "id":object[i].name_value_list.id.value,
          "noofdays":days*-1
        })}
      }else{
          this.deleteitem(object[i].name_value_list.productid.value,object[i].name_value_list.id.value);
        }}
  }
 
  return tempArray;
}
deleteitem=(itemid,id)=> {
 
  const SET_DATAURL= Constants.SET_URL;
    const url= SET_DATAURL;
    console.log("url:" + url);
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        __module_code__: "PO_06",
        __query__: "po_products.productid= '" + itemid + "'",
        __name_value_list__: {
          modified_by_name: "Support Primesophic",
          delete: 1,
          id:id
        }
      })
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
      console.log("this is deleting order items")
      console.log(result);
     
      
    
    }).catch(function (error) {
      console.log("-------- error ------- " + error);
    });

  }
  checkstock=(itemid)=> {
    let stock_onhand=true;
    const GET_DATAURL= Constants.GET_URL;
      const url= GET_DATAURL;
      console.log("url:" + url);
      fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          __module_code__: "PO_06",
          __query__: "po_products.productid= '" + itemid + "'"
        })
      }).then(function (response) {
        return response.json();
      }).then(function (result) {
        console.log("this is deleting order items")
        console.log(result);
        let stock= result.entry_list[0].name_value_list.stock_c.value;
        if(Number(stock)<=0)
          stock_onhand=false;

          return  stock_onhand;
        
      
      }).catch(function (error) {
         return  stock_onhand;
        console.log("-------- error ------- " + error);
      });
  
    }
setUnsentOrders(array) {
  this._UnsentArray = array;
}
getUnsentOrders() {
  return this._UnsentArray;
}
setUnsetfilearray(array)
{
  this._unsentfilelist=array
}
getUnsetfilearray(){
  return this._unsentfilelist;
}
getorderitemArray(orderitemArray){
  var tempArray=this.getItemArray();
  var returnarray=[]
  var itemid, description, qty, price;
  for(var i=0;i<tempArray.length;i++){
    for(var j=0;j<orderitemArray.length;j++){
      itemid=tempArray[i].itemid
      description=tempArray[i].description
      qty=(tempArray[i].qty).split('.')[0]+"."+(tempArray[i].qty).split('.')[1].substring(1, 2)
      // qty=tempArray[i].qty;
      price=tempArray[i].price;
      if(tempArray[i].itemid==orderitemArray[j].productid){
        qty=orderitemArray[j].quantity
        qty=(qty).split('.')[0]+"."+(qty).split('.')[1].substring(1, 2)
      }
      returnarray.push({'itemid':itemid,
    'description':description,
    'price':price,
    'qty':qty
  })
    }
    

  }
  if(returnarray.length==0){
    returnarray=tempArray;
  }
  return returnarray;
}

// here new code...
setstoresArray(array)
{
  this._StoreArray=array;
}
getstoresArray(){
  return this._StoreArray
}
writedata(path,listArray){
  

      // write the file
    
      var json = JSON.stringify(listArray);
      console.log(json, "this is for storing list array")
      RNFS.writeFile(path, json,'utf8')
      .then((success) => {
      console.log('FILE WRITTEN!');
      })
      .catch((err) => {
      console.log(err.message);
      });
  
      RNFS.readFile(path, 'utf8')
          .then((contents) => {
          // log the file contents
          console.log("writting files to skuuuu")
          console.log(contents);
          console.log("Json_parse");
          console.log(JSON.parse(contents));
      })
      .catch((err) => {
          console.log(err.message, err.code);
      });
  
}
getdataOffline(path){

  RNFS.readFile(path, 'utf8')
  .then((contents) => {
  // log the file contents
  // console.log(contents);
  return(JSON.parse(contents));
})
.catch((err) => {
  // console.log(err.message, err.code);
});
}
getfile(filename){
  
  let tempArray=[]
  for (var i=0;i<filename.length;i++)
  {
   tempArray.push({
    //  'orderid':filename[i].filename,
     "status":"unsent"
    })
   console.log(tempArray, "temp here")
 }
return tempArray;
}
getunsentlist (filename){
   let tempArray=[]
   for (var i=0;i<filename.length;i++)
   {
     tempArray.push({
       orderid:filename[i].name,
       orderstatus:'UNSENT'
     })
   }
   return tempArray;
}

}
