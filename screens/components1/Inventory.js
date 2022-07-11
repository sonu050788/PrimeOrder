import React, { Component } from 'react';
import { Text,ImageBackground,Dimensions,Keyboard, View, StyleSheet, Image, TouchableOpacity, Alert, SafeAreaView, FlatList, ScrollView,AsyncStorage ,ActivityIndicator} from 'react-native';
import { SearchBar } from 'react-native-elements';
import { withNavigation } from "react-navigation";
import CommonDataManager from './CommonDataManager';
import { TextInput } from 'react-native-gesture-handler';
const Constants = require('./Constants');
import LinearGradient from 'react-native-linear-gradient';
import { relativeTimeThreshold } from 'moment';

var RNFS = require('react-native-fs');
var currentpath = RNFS.DocumentDirectoryPath + '/currentOrder.json';
var skupath = RNFS.DocumentDirectoryPath + '/skuOffline.json';
const GET_DATAURL=Constants.GET_URL;
var ItemArrayAdded=[]
var badgecount=0
let commonData = CommonDataManager.getInstance();
var ItemArray=[]
const{height}=Dimensions.get("window");
const {width}=Dimensions.get("screen")

class Inventory extends Component {
imgloc= require('../components1/images/barcode.png')
    constructor(props) {
        super(props);
        this.state = {
            JSONResult: [],
            data:ItemArray,
            qty:0,
            dataList:[],
            refresh:false,
            loading:false,
            searchmsg:'',
            screenheight:height,
            itemArrayPricing:[]
        }
        this.arrayholder = [];
    }
    
    ArrowForwardClick = () => {
        Alert.alert("Loading soon")
    }
    calculaterunningTotals() {
      
        let Qtyval = 0
        let PriceVal = 0
        let ItemVAl = this.state.dataList.length

        for (var i = 0; i < ItemVAl; i++) {
          Qtyval = Qtyval + Number(this.state.dataList[i].qty)
          if (this.state.dataList[i].price != null)
            PriceVal = PriceVal + (Number(this.state.dataList[i].qty) * Number(this.state.dataList[i].price))
        }
        console.log(PriceVal,Qtyval,ItemVAl,'++++++++++++')
        commonData.setRunningTotals(PriceVal, Qtyval, ItemVAl)
        
      }
    resignView(){

        ItemArrayAdded=[]
        ItemArrayAdded=this.state.dataList
        const filteredData = ItemArrayAdded.filter(item => item.qty !== 0);
        ItemArrayAdded=filteredData
        commonData.setArray(ItemArrayAdded)
    }
    componentDidMount(){
      

        const { navigation } = this.props;
        this.loadPricing();
    commonData.setItemArray(commonData.getSkuArray())
    this.focusListener = navigation.addListener("didFocus", () => {
      this.ReloadItems();
    });
    this.focusListener = navigation.addListener("willBlur", () => {
        this.resignView()
    });
      }
      componentWillMount(){
       
        // this.searchFilterFunction('');
        // this.forceUpdate();
      }
      componentWillUnmount() {
        // Remove the event listener
        this.focusListener.remove();
      }
 

makeRemoteRequest = () => {
    this.setState({ loading: true });
    this.setState({
        loading: false,
    });
 
};
async readSku(){
  
  
    // write the fil
  
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

ReloadItems(){
  
  this.state.value='';
  this.state.searchmsg=''
  ItemArrayAdded=commonData.getCurrentArray()
  this.readSku();
  
  ItemArray=commonData.getSkuArray()
  currentArray=commonData.getCurrentArray()
  console.log('m here ',ItemArray)
  
      if(commonData.isOrderOpen && (ItemArrayAdded.length>0 || currentArray.length>0)){
        for(var i=0;i<this.state.itemArrayPricing.length;i++){
          for(var j=0;j<ItemArray.length;j++){
             if(ItemArray[j].itemid==this.state.itemArrayPricing[i].name_value_list.itemkey.value){
              ItemArray[j].price=this.state.itemArrayPricing[i].name_value_list.pack_value_c.value;
            }
            
          }
        }
          var temparray=[...ItemArray]
          var skuarray=[...temparray]
          ItemArray=commonData.getCurrentArray()
          // for(var i=0;i<temparray.length;i++){
              for(var j=0;j<ItemArray.length;j++){
                  // if(temparray[i].itemid==ItemArray[j].itemid)
                  var index= temparray.findIndex(obj => obj.itemid === ItemArray[j].itemid);
                      temparray.splice(index,1)
              }
          // }
          
          const mergedarray=[...ItemArray,...temparray];
          console.log(mergedarray,'+++++++++merged array')
          ItemArray=mergedarray;
      }
      
      this.state.dataList=ItemArray;
      this.state.JSONResult=ItemArray;
      ItemArrayAdded=this.state.dataList
      this.forceUpdate();
        //Sort in Descending Order
        this.state.dataList.sort((a, b) => (a.itemid > b.itemid) ? 1 : -1)
        // ItemArrayAdded=this.state.dataList
        this.state.searchmsg=this.state.JSONResult.length+' Results'
        this.forceUpdate();
       
}

searchFilterFunction = (text) => { 
 
    this.setState({
                value: text,
              });
            if(text.length<=0){
                this.ReloadItems();
                Keyboard.dismiss()
                return
            } 
      const newData = this.state.dataList.filter(item => {      
      const itemData = `${item.itemid.toUpperCase()} ${item.description.toUpperCase()}`;
       const textData = text.toUpperCase();
       return itemData.indexOf(textData) > -1;    
    });
    this.setState({ JSONResult: newData });  
    
    this.forceUpdate()
  };

    loadsku(){
   
        var that = this;
        this.setState({ loading: true });
        // fetch("http://192.168.9.14:8080/get_data_s.php", {
          fetch(GET_DATAURL, {
          method: "POST",
          body: JSON.stringify({
            "__module_code__": "PO_06",
            "__query__":"po_products.deleted=0",
            "__orderby__": "",
            "__offset__": 0,
            "__select _fields__": [""],
            "__max_result__": 1,
            "__delete__": 0,
          })
        }).then(function (response) {
          return response.json();
        }).then(function (result) {
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
            loading: false,
            refreshing:false
          });
        }).catch(function (error) {
          console.log("-------- error ------- " + error);
        });
      }
      loadPricing=()=>{
   
        var that = this;
        
        that.setState({ loading: true });
        // fetch("http://192.168.9.14:8080/get_data_s.php", {
        //   fetch("http://143.110.178.47/primeorder/get_data_ordo.php", {
        //   method: "POST",
        //   body: JSON.stringify({
        //     "__module_code__": "PO_13",
        //     "__query__": "",
        //     "__orderby__": "",
        //     "__offset__": 0,
        //     "__select_fields__": [""],
        //     "__max_result__": 1,
        //     "__delete__": 0,
        //   })
        // }).then(function (response) {
        //   return response.json();
        // }).then(function (result) {
         
        //   console.log("The PO_13 data which come from the server here")
        //   console.log(result);
        //   for(var i=0;i<ItemArray.length;i++){
        //     if(ItemArray[i].itemid=='IRG-01'){
        //       ItemArray[i].price=789;
        //     }
        //   }
        //   that.forceUpdate();
        //   that.setState({
        //     loading: false,
        //     refreshing:false,
            
        //   });
        // }).catch(function (error) {
        //   console.log("-------- error ------- " + error);
        // });
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        
        var raw = "{\n\"__module_code__\":\"PO_13\",\n\"__query__\": \"\",\n\"__orderby__\": \"\",\n\"__offset__\": 0,\n\"__select _fields__\": [\"\"],\n\"__max_result__\": 1,\n\"__delete__\": 0\n}\n";
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
        
        fetch("http://143.110.178.47/primeorder/get_data_ordo.php", requestOptions)
          .then(response => response.json())
          .then(result => {console.log(result.entry_list);
            that.setState({ loading:false });
           that.setState({itemArrayPricing:result.entry_list})
          
          // ItemArray=[...resultArray];
           that.forceUpdate();
          })
          .catch(error => console.log('error', error));


      }
      readSku(){
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
    sycnCall=()=>{
        this.loadsku();
        this.readSku();
      }
      onContentSizeChange=(contentwidth, contentheight)=>{
        this.setState({screenheight:contentheight})
      }
    render() {
      let Title="Inventory"
      const scrollEnabled=this.state.screenheight>height;
        this.state.searchmsg=this.state.JSONResult.length+' Results'

        if (this.state.loading==true) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' ,backgroundColor: 'rgba(52, 52, 52, 0.8)'}}>
                    <ActivityIndicator />
                    <Text>Loading Item , Please wait</Text>
                </View>
            );
        }
        return (
           

            <View style={{backgroundColor:'#FFFFFF',flex:1}}>
             
             <View style={{flexDirection:'row',marginTop:30}}>
        <TouchableOpacity style={{borderRadius:20, height:60,width:width/3-10, justifyContent:'center', alignItems:'center' }} onPress={()=>this.props.navigation.goBack()}>           
                 <Image transition={false} source={require('../components1/images/arrow.png')} style={{height:35,width:35,  resizeMode:"center", alignSelf:'center'}} />
          </TouchableOpacity> 
            <Text style={{ marginTop:10, color: '#1B1BD0',backgroundColor:' #FFFFFF',fontSize: 20,width:width/3+50, height: 50,fontFamily:'Lato-Regular' ,fontWeight:'bold',fontSize:20,alignSelf:'center',textAlign:"center",justifyContent:'center'}}>Inventory</Text>
           
      </View> 
          {(commonData.getusername()=="admin")?
             <View style={{flexDirection:'row',backgroundColor:'#FFFFFF',alignContent:'center',justifyContent:'center',width:'100%'}}> 
             <TouchableOpacity activeOpacity={0.5} onPress={() =>{commonData.setinventoryItemsArray(""); this.props.navigation.navigate('AddProduct')}} style={styles.TouchableOpacityStyle} >
               {/* <Image source={require('./images/Floating_Button.png')} style={styles.FloatingButtonStyle} /> */}
               <LinearGradient
              colors={['#ffffff', '#ffffff']}
              style={styles.signInplus}>
              <Text style={styles.textSignplus}>+</Text>
              {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}
            </LinearGradient>
              </TouchableOpacity>

                <TextInput  placeholder="Enter Product # or Name" 
                onChangeText={text => this.searchFilterFunction(text)}
                // onChangeText={(value) => this.setState({ value })}
                autoCorrect={false}
                autoCompleteType='off'
                value={this.state.value}
                style={{marginHorizontal:10, 
                    // width: 250,
                    width:width-170,
                    height:50,
                    color: '#534F64',
                    borderWidth: 1,
                    // alignSelf:"center",
                    // Set border Hex Color Code Here.
                    borderColor: '#CAD0D6',
                    fontFamily:'Lato-Regular',
                    borderRadius:10,
                    // alignSelf:"center",
                    marginTop: 10,
                    textAlign:'center'}}></TextInput>
                   <TouchableOpacity style={{alignSelf:'center',width:90,height:40,backgroundColor:'#ffffff',  shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.5, marginHorizontal:5,
shadowRadius: 2,borderRadius:10,
elevation: 4 }} onPress={() => this.searchFilterFunction('')}>
              <Text style={styles.textSign}>Clear</Text>
              {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}
           
                    </TouchableOpacity>  
                    </View>: <View style={{flexDirection:'row',backgroundColor:'#FFFFFF',alignContent:'center',justifyContent:'center',width:'100%'}}> 

                <TextInput  placeholder="Enter Product # or Name" 
                onChangeText={text => this.searchFilterFunction(text)}
                // onChangeText={(value) => this.setState({ value })}
                autoCorrect={false}
                autoCompleteType='off'
                value={this.state.value}
                style={{marginHorizontal:10, 
                    // width: 250,
                    width:width-130,
                    height:50,
                    color: '#534F64',
                    borderWidth: 1,
                    // alignSelf:"center",
                    // Set border Hex Color Code Here.
                    borderColor: '#CAD0D6',
                    fontFamily:'Lato-Regular',
                    borderRadius:10,
                    // alignSelf:"center",
                    marginTop: 10,
                    textAlign:'center'}}></TextInput>
                   <TouchableOpacity style={{height: 60, width: 90,marginTop:10}} onPress={() => this.searchFilterFunction('')}>
                     {/* <Image source={require('./images/cleartxt.png')} style={{marginTop:-15, height: '200%', width:'100%' }} /> */}
                     <LinearGradient
              colors={['#ffffff', '#ffffff']}
              style={styles.signIn}>
              <Text style={styles.textSign}>Clear</Text>
              {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}
            </LinearGradient>

                    </TouchableOpacity>  
                    </View>}
                <View style={{backgroundColor:'#ffffff',height:40,width:width-20,alignSelf:'center', flexDirection:"column"}}>
               {/* <Text style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:5,marginHorizontal:20}}></Text> */}
               <Text  style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:5,marginHorizontal:20}}>{this.state.searchmsg} </Text>
                </View>
                {/* <View style={{flexDirection:"row",marginHorizontal:250,marginTop:0,backgroundColor:'#FFFFFF',width:120,height:20}}>
                {/* <TouchableOpacity style={{height: 60, width: 160}} onPress={() => this.searchFilterFunction('')}>
              <Image source={require('./images/filter.png')} style={{ height: '30%', width:'60%',resizeMode:'contain' }} />
                <Text  style={{color:'#34495A',fontWeight:"bold",fontFamily:'Lato-Regular',marginTop:-20,marginHorizontal:60}}>Filter</Text>
                </TouchableOpacity>   */}
               {/* </View>  */} 
               <View style={{flexGrow:1,marginTop:-10,height:900}}>
                <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                contentContainerStyle={styles.scrollview}
                scrollEnabled={scrollEnabled}
                onContentSizeChange={this.onContentSizeChange}>
                <View style={{flexGrow:1,justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',marginTop:0,height:height-200}}>
                    <FlatList
                        data={this.state.JSONResult}
                        renderItem={this.sampleRenderItem}
                        extraData={this.state.refresh}
                        keyExtractor={(item, index) => toString(index,item)}
                        ItemSeparatorComponent={this.renderSeparator} 
                    />
                    </View>
                </ScrollView>
                </View>
                {/* <View style={styles.MainContainer}> */}
 
 {/* <TouchableOpacity activeOpacity={0.5} onPress={() => this.props.navigation.navigate('AddProduct')} style={styles.TouchableOpacityStyle} >

   <Image source={require('./images/Floating_Button.png')} 
   
          style={styles.FloatingButtonStyle} />

 </TouchableOpacity> */}

{/* </View> */}
            </View>
        );
    }
    AddItemToInventory=()=>{ 
      Alert.alert('Alert','You do not have an open order to add items.')

      // this.props.navigation.navigate('AddProduct')
    }
    refreshDAta(){
        this.setState({refresh:!this.state.refresh})        
        ItemArrayAdded=[]
        ItemArrayAdded=this.state.dataList
        const filteredData = ItemArrayAdded.filter(item => item.qty !== 0);
        ItemArrayAdded=filteredData
        //Write Data To file
        commonData.writedata(currentpath,ItemArrayAdded)
        this.forceUpdate();
    }
    AddItem = (Qty,index,type) => {
    
        if(commonData.isOrderOpen==true){
          if(commonData.context=="OG"&&Qty==0){
            Alert.alert('Warning','Items cannot be added to the Packaged Orders')
            Keyboard.dismiss()
            return;
          }
        let qtyval = Number(Qty)
       
        if(type=='+')
        qtyval=qtyval+1; 
         else if(type =='-') 
         {
             //Qty value cannot be less than 0
                if(qtyval>0)
                 qtyval=qtyval-1;
                 else
                 qtyval=0
         }
         if(this.state.dataList[index].stock<qtyval)
         {
           Alert.alert("Warning","Qty has exceeded the on hand quantity.It will be set to maximum available quantity.")
           qtyval=this.state.dataList[index].stock;
         }
        this.state.dataList[index].qty=qtyval
        this.state.JSONResult[index].qty=qtyval
        //Updates issue fix in Home Tab
        this.calculaterunningTotals();
       this.refreshDAta();
        }else{
            Alert.alert('Alert','You do not have an open order to add items.')
            Keyboard.dismiss()
        }
    }
   
    sampleRenderItem = ({ item, index }) => (
        
      <View style={styles.flatliststyle}>
      <ImageBackground source={require('./images/itembg.png')} style={styles.flatrecord}>
        <View style={{flexDirection:'row'}}>
        <View style={{flexDirection:"row",backgroundColor:'#ffffff',width:100}}>
        <TouchableOpacity style={{height: 80, width: 80,marginHorizontal:19,marginTop:27}} onPress={() => this.props.navigation.navigate('Itemdetails',
                   {storeID:item.itemid,desc:item.description,onHand:item.extrainfo1,itemImage:require('./images/itemImage/IRG-14.jpg'), qty:item.qty,from:'SKU',price:item.price,upc:item.upc,weight:item.weight,items:item})}>
            <Image source={require('./images/itemImage/IRG-14.jpg')} style={{ height: 80, width: 80, marginTop: 10,marginHorizontal:10, resizeMode: 'contain' }} />
        </TouchableOpacity>
        <Text  style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:120,marginHorizontal:-80}}>{item.itemid}</Text>
        <Image source={require('./images/line.png')} style={{ height: 100, width: 80, marginTop: 33,marginHorizontal:63, resizeMode: 'contain' }} />
        </View>
        <View style={{marginHorizontal:20,flexDirection:'column'}}>
          <Text style={{color:'#7A7F85',borderBottomColor:'#7A7F85',fontFamily:'Lato-Regular',marginTop:23}}>Net wt: {Number(item.weight)} {item.unitofmeasure}</Text>
          <Image source={require('./images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain' }} />
          <Text style={{color:'#34495A',fontWeight:"500",fontFamily:'Lato-Bold',fontSize:14,marginTop:0,width:190,height:35}}>{item.description}</Text>
          {(Number(item.stock)>0)?<Text style={{color:'#1D8815',fontFamily:'Lato-Regular',fontSize:12,marginTop:10}}>{item.stock} - On Hand</Text>:<Text style={{color:'red',fontFamily:'Lato-Regular',fontSize:12,marginTop:10}}>Out of stock!!</Text>}
          <Text style={{color:'grey',fontFamily:'Lato-Bold',fontSize:12,marginTop:0}}>{item.noofdays} days Older</Text>
          </View>
          <View style={{height: 20, width: 20,marginHorizontal:-10,flexDirection:'column',alignItems:'center'}}>
       
        <Text style={{color:'#000000',borderBottomColor:'#000000',fontWeight:'100',textAlign:'center',fontFamily:'Lato-Bold',width:60,marginTop:20}}>₹{Number(item.price)}</Text>
  
        </View>
      
        </View>
     </ImageBackground>
     </View>
        
       
    )
}

// export default SKU;
export default withNavigation(Inventory);

const styles = StyleSheet.create({
  scrollview:{
    // flexGrow:1,
    // height:height-480
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
      textSignplus: {
          color: '#1B1BD0',
          fontWeight: 'bold',
          fontSize:27,
          fontFamily:'Lato-Bold'
        },
  
    FloatingButtonStyle: {
   
      resizeMode: 'contain',
      width: 40,
      height: 40,
    }
})