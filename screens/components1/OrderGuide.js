

import React, { Component } from 'react';
import { Text,Keyboard,ImageBackground,Dimensions,TextInput, View,StyleSheet,Image,TouchableOpacity,Alert,SafeAreaView,FlatList, ScrollView,ActivityIndicator} from 'react-native';
import { SearchBar } from 'react-native-elements';
import CommonDataManager from './CommonDataManager';
import LinearGradient from 'react-native-linear-gradient';
var RNFS = require('react-native-fs');
import {images} from './images/images'
var orderid=[]
const Constants = require('../components1/Constants');

// const GET_DATAURL='http://192.168.9.14:8080/get_data_s.php'
const GET_DATAURL=Constants.GET_URL;
let commonData = CommonDataManager.getInstance();
const{height}=Dimensions.get("window");
const {width}=Dimensions.get("screen")
class OrderGuide extends Component {
    
    constructor(props) {
        super(props);
        this.getListCall= this.getListCall.bind(this);
        this.imgloc=require('../components1/images/Customerimages/cust1.png');
        this.calculateRunningTotals= this.calculateRunningTotals.bind(this);
        this.state = {       
        search: '',
        data: [],
        error: null,
        mainData :[],
        tempArray:[],
        orderitemlist:[],
        //Qty:0,
        size:0,
        baseprice:0,    
        Items:0,
        weight:0,
        OrderedDate:'',
        customername:'',
        JSONResult:[],
        loading:true,
        value:'',
        searchmsg:'',
        screenHeight: height,

    }
     this.arrayholder = [];
    }
    
        //--------------------------------------------------11-11-21------------------------------------------------------------------
        componentWillMount() {
          const { navigation } = this.props;
           this.focusListener = navigation.addListener("didFocus", () => {
           // The screen is focused
           // Call any action
     
          //  this.ReloadItems();
           });
       }
     
       ReloadItems(){
         this.setState({
           loading:false
         })
         let uname= commonData.getusername()
         RNFS.readDir(RNFS.DocumentDirectoryPath+'/unsent_folder' + '/'+uname)
            .then((result) => {
              console.log('GOT RESULT form extenal directory', result);
             //  this.state.unsentlist = result;
              this.state.tempArray=commonData.getunsentlist(result);
              let sortedarray= this.state.tempArray.sort((a, b) => (a.TimeStamp < b.TimeStamp) ? 1 : -1)
              this.state.data=sortedarray
              commonData.setUnsetfilearray(this.state.tempArray);
              this.forceUpdate();
              console.log(  this.state.unsentlist,"here is my")
              return Promise.all([RNFS.stat(result[0].path), result[0].path]);
            })
            .then((statResult) => {
              if (statResult[0].isFile()) {
                // if we have a file, read it
                return RNFS.readFile(statResult[1], 'utf8');
              }
      
              return 'no file';
            })
            .catch((err) => {
              console.log(err.message, err.code);
            });
          //console.log(this.state.unsentlist, "unsent list he+++++++++++++++++++re")
          this.forceUpdate();
        }
     
       unsentclickPress=(index)=>{
         var that=this;
       let currentArra=[]
       let uname= commonData.getusername()
       var dir = RNFS.DocumentDirectoryPath + '/unsent_folder' + '/'+ uname+'/';
       var path = dir+index.id;
       var pathvar = index.id.substring(3,index.id.length-5);
       commonData.setOrderId(index.id)
       commonData.setContext('OG')
        currentArra.push({ itemid: index.name_value_list.productid.value, description: index.name_value_list.productdescription.value, price: index.name_value_list.baseprice.value, qty: index.name_value_list.size.value, imgsrc: this.state.itemImage,weight:index.name_value_list.weight.value});

       commonData.setArray(currentArra)
       //tmpArray.push({ itemid: itmArray[i].name_value_list.productid.value, description: itmArray[i].name_value_list.productdescription.value, price: itmArray[i].name_value_list.baseprice.value, qty: itmArray[i].name_value_list.size.value, imgsrc: this.state.itemImage,weight:itmArray[i].name_value_list.weight.value});

        console.log(currentArra,"my path is her*******hhh**************e please check")
       that.props.navigation.navigate('OrderItem',{PATH:currentArra,PATH1:path,From:'OG',TYPE:"" })
        return;
       console.log(index.id,"my path is here please check")
       var that = this
      //  RNFS.readFile(path, 'utf8')
      //      .then((contents) => {
      //        console.log(contents);
      //        currentArra = JSON.parse(contents)
      //        commonData.setUnsentOrders(currentArra)
      //        that.setState({
      //          contentsvariable:contents
      //        })
      //        contentlocal=contents
      //         console.log(commonData.getUnsentOrders(), "props to the next screen is here")
      //         commonData.setContext('OG')
      //         commonData.setArray(currentArra)
      //         that.props.navigation.navigate('OrderItem',{PATH:currentArra,PATH1:path,From:'OG',TYPE:"" })
      //         commonData.setUnsentOrders(this.state.contentsvariable);
      //   })
     }


//--------------------------------------------------end------------------------------------------------------------------

    componentDidMount() {
        this.getListCall();
        
    }
    getListCall() {
        this.state.value=''
        this.state.searchmsg=''
       var  oid= this.props.navigation.getParam('orderid','')
        var that = this;
        this.makeRemoteRequest();
        // here we are quering po_user.username using post method ........
        fetch(GET_DATAURL, { 
            method: "POST",
                     body: JSON.stringify({
                        "__module_code__": "PO_11",
                        "__module_name__": "PackageProducts",
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
            orderArray = result.entry_list;
          console.log("this is for getting resonse from querying username and getting response")
         // alert(result)
          console.log(result);
          console.log(result.entry_list)
          var json = JSON.stringify(orderArray);
         // alert(json)
          console.log(":::::::::::order guide Array:::::::::::::::::::::")
          
          that.setState({ 
            mainData:result.entry_list,
           JSONResult: result.entry_list,
           loading:false
         
     });
  
     if(result.entry_list[0].name_value_list.lastmodified.value)
         that.state.OrderedDate=result.entry_list[0].name_value_list.lastmodified.value
    
     that.calculateRunningTotals()
        }).catch(function (error) {
          console.log("-------- error ------- " + error);
        });

       
}

    makeRemoteRequest = () => {
        this.setState({ loading: true });
        this.setState({
            data: this.state.JSONResult,
           
        });
         this.arrayholder = this.state.JSONResult;
    };
    onContentSizeChange = (contentWidth, contentHeight) => {
        this.setState({ screenHeight: contentHeight });
      };

    searchFilterFunction = (text) => { 
        this.state.searchmsg=''
        this.setState({
            value: text,
          });
          if(text.length==0){
            this.setState({ JSONResult: this.state.mainData }); 
            Keyboard.dismiss();
            return;
           }
  const newData = this.state.mainData.filter(item => {      
  const itemData = `${item.name_value_list.name.value.toUpperCase()} ${item.name_value_list.id.value.toUpperCase()}`;
   const textData = text.toUpperCase();
   return itemData.indexOf(textData) > -1;    
});
this.setState({ JSONResult: newData });  
};
    calculateRunningTotals=()=>{
            console.log('calculating running totals')
              let size=0,baseprice=0
              let Items=this.state.JSONResult.length
              for(var i=0; i<Items;i++){
                size=size+Number(this.state.JSONResult[i].name_value_list.pack.value)
                if(this.state.JSONResult[i].name_value_list.baseprice.value!=null)
                 baseprice=baseprice+(Number(this.state.JSONResult[i].name_value_list.pack.value)*Number(this.state.JSONResult[i].name_value_list.baseprice.value))
              }
              this.state.baseprice=baseprice
              this.state.size=size
              this.state.Items=this.state.JSONResult.length
              this.forceUpdate()
            }
    ArrowForwardClick=()=>{
        Alert.alert("Loading soon")
    }
    getImageforItemid(itemid){
        let imagloc=require('../components1/images/Customerimages/no-image-1.png')
        let itemArray=commonData.getSkuArray()
        const filteredData = itemArray.filter(item => item.itemid === itemid);
        if(filteredData.length>0)
         imagloc=images[filteredData[0].itemid]
        return imagloc;
        
    }
    render() {
      const { search } = this.state.value;
      const scrollEnabled = this.state.screenHeight > height;
      this.state.searchmsg=this.state.data.length+' Results'
      if (this.state.loading) {
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(52, 52, 52, 0.8)' }}>
            <ActivityIndicator />
            <Text style={{fontFamily:'Lato-Bold'}}>Loading Stores, Please wait.</Text>
          </View>
        );
      }
      return (
        <SafeAreaView style={{backgroundColor:'#FFFFFF',flex:1}}>
        
        <View style={{flexDirection:'row',marginTop:30}}>
          <TouchableOpacity style={{borderRadius:20, height:60,width:width/3-10, justifyContent:'center', alignItems:'center' }} onPress={()=>this.props.navigation.goBack()}>           
                   <Image transition={false} source={require('../components1/images/arrow.png')} style={{height:35,width:35,  resizeMode:"contain", alignSelf:'center'}} />
            </TouchableOpacity> 
              <Text style={{ marginTop:10, color: '#1B1BD0',backgroundColor:' #FFFFFF',fontSize: 20,width:width/3+50, height: 50,fontFamily:'Lato-Regular' ,fontWeight:'bold',fontSize:20,alignSelf:'center',textAlign:"center",justifyContent:'center'}}>Bundled Orders</Text>
              <TouchableOpacity onPress={() =>this.synccall()} style={{marginTop:10,width:width/3-50}}>
               <Image transition={false} source={require('../components1/images/sync.png')} style={{height:25,width:25,resizeMode:'contain',alignSelf:'center'}}></Image>
              </TouchableOpacity>
        </View> 
   
        <View style={{flexDirection:'row',backgroundColor:'#FFFFFF',alignContent:'center',justifyContent:'center',width:'100%',marginTop:5}}> 
                  <TextInput  placeholder="Enter Bundled ID or Name" 
                  onChangeText={text => this.searchFilterFunction(text)}
                  autoCorrect={false}
                  value={this.state.value}
                  style={{marginHorizontal:10, 
                    width:width-150,
                      height:50,
                      color: '#534F64',
                      borderWidth: 1,
                      borderRadius:10,
                      // Set border Hex Color Code Here.
                      borderColor: '#CAD0D6',
                      fontFamily:'Lato-Regular',
                      marginTop: 10,
                      textAlign:'center'}}></TextInput>
                      <TouchableOpacity style={{alignSelf:'center',width:90,height:40,backgroundColor:'#ffffff',  shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.5, marginHorizontal:5,
shadowRadius: 2,borderRadius:10,
elevation: 4 }} onPress={() => this.searchFilterFunction('')}>
                       {/* <Image transition={false} source={require('../components1/images/cleartxt.png')} style={{marginTop:-13, height: '200%', width:'100%' }} /> */}
                
                <Text style={styles.textSign}>Clear</Text>
                {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}

                      </TouchableOpacity>  
                     {/* <TouchableOpacity style={{height: 60, width: 100}} onPress={() => this.searchFilterFunction('')}>
                       <Image transition={false} source={require('../components1/images/cleartxt.png')} style={{marginTop:-13, height: '200%', width:'100%' }} />
                      </TouchableOpacity>   */}
          </View>
          <Text style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:5,marginHorizontal:30}}>Select Your Bundle to place the order.</Text>
          <Text style={{marginTop:5,marginHorizontal:30,fontFamily:'Lato-Bold'}}>{this.state.searchmsg}</Text>
          
                   <View style={{flexGrow:1,marginTop:0,height:610}}>
                  <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                  contentContainerStyle={styles.scrollview}
                  scrollEnabled={scrollEnabled}
                  onContentSizeChange={this.onContentSizeChange}>
                  <View style={{flexGrow:1,justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',marginTop:0,height:height-270}}>
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
        </SafeAreaView>
    );
    
  }
    render1() {
        const scrollEnabled = this.state.screenHeight > height;
        this.state.searchmsg=this.state.JSONResult.length+' Results'
        console.log(this.state,"testing1")

        if (this.state.loading) {
          return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(52, 52, 52, 0.8)' }}>
              <ActivityIndicator />
              <Text style={{fontFamily:'Lato-Bold'}}>Loading Orderguides, Please wait.</Text>
            </View>
          );
        }
        return (
       
          <View style={{backgroundColor:'#FFFFFF',flex:1}}>
         
             <View style={{flexDirection:'row',marginTop:30}}>
        <TouchableOpacity style={{borderRadius:20, height:60,width:width/3-10, justifyContent:'center', alignItems:'center' }} onPress={()=>this.props.navigation.goBack()}>           
                 <Image transition={false} source={require('../components1/images/arrow.png')} style={{height:35,width:35,  resizeMode:"contain", alignSelf:'center'}} />
          </TouchableOpacity> 
            <Text style={{ marginTop:10, color: '#1B1BD0',backgroundColor:' #FFFFFF',fontSize: 20,width:width/3+50, height: 50,fontFamily:'Lato-Regular' ,fontWeight:'bold',fontSize:20,alignSelf:'center',textAlign:"center",justifyContent:'center'}}>Packaged Orders</Text>
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
        <View style={{backgroundColor:'#FFFFFF',height:50,marginLeft:20, flexDirection:"row"}}>
               {/* <Text style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:5,marginHorizontal:20}}>Select Your Product to Order</Text> */}
               <Text  style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:30,marginHorizontal:-215}}>{this.state.searchmsg}</Text>
        </View>
        <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                contentContainerStyle={styles.ScrollView}
                scrollEnabled={scrollEnabled}
                horizontal={true}
                onContentSizeChange={this.onContentSizeChange}>
              <FlatList
                  data={this.state.JSONResult}
                  renderItem={this.sampleRenderItem}
                  extraData={this.state.refresh}
                  
                  keyExtractor={(item, index) => toString(index)}
                  ItemSeparatorComponent={this.renderSeparator}

              />
             
          </ScrollView>
          </View>
        );
    }
    sampleRenderItem = ({ item }) => (
      
      <TouchableOpacity onPress={() =>this.unsentclickPress(item)}>  
  <View style={styles.flatliststyle}>
  <ImageBackground source={require('../components1/images/itembg.png')} style={styles.flatrecord}>
    <View style={{flexDirection:'row'}}>
    <View style={{flexDirection:"row", width:70}}>
            <TouchableOpacity style={{height: 100, width: 60,marginHorizontal:39}}>
                <Image transition={false} source={require('../components1/images/og.png')} style={{ height: 40, width: 40, marginTop: 30,marginHorizontal:25, resizeMode: 'contain' }} />
            </TouchableOpacity>
           
            <Text  style={{color:'#1B1BD0',fontFamily:'Lato-Regular',fontSize:10,marginTop:90,marginHorizontal:-90,width:60,textAlign:'center'}}>{item.name_value_list.name.value}</Text>
            <Image transition={false} source={require('./images/line.png')} style={{ height: 100, width: 60, marginTop: 33,marginHorizontal:78, resizeMode: 'contain' }} />
            </View>
            <View style={{marginHorizontal:80}}>
              {(item.name_value_list.id.value!=undefined)?
            <Text style={{marginHorizontal:-10,marginTop:30,fontSize:15, color: '#34495A',fontFamily:'Lato-Bold',fontSize:17}}>{item.name_value_list.id.value.substring(1, 8)}</Text>:
             <Text style={{marginHorizontal:-10,marginTop:30,fontSize:15, color: '#34495A',fontFamily:'Lato-Bold',fontSize:17}}></Text>}
            <Image transition={false} source={require('../components1/images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain',marginHorizontal:-10 }} />

    {/* <Text style={{marginHorizontal:-10, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12}}>₹{(item.value).split('.')[0]}.{(item.value).split('.')[1].substring(1, 2)}</Text> */}
    {/* <Text style={{marginHorizontal:-10, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12,marginTop:-20}}>{item.type}</Text> */}
    <Text style={{marginHorizontal:-10, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12}}>Last Updated:{item.name_value_list.date_entered.value}</Text>
     
    
     
    </View>

    </View>
 </ImageBackground>
 </View>
  
</TouchableOpacity>
      
    )

    sampleRenderItem1 = ({ item }) => (
       <TouchableOpacity   onPress={() =>this.unsentclickPress(item)}>  
  <View style={styles.flatliststyle}>
  <ImageBackground source={require('../components1/images/itembg.png')} style={styles.flatrecord}>
    <View style={{flexDirection:'row'}}>
    <View style={{flexDirection:"row"}}>
    
            <TouchableOpacity style={{height: 100, width: 80,marginHorizontal:39}}>
            <Image transition={false} source={this.imgloc} style={{ height: 80, width: 80, marginTop: 40,marginHorizontal:0, resizeMode: 'contain' }} />
            </TouchableOpacity>
            <Image source={require('./images/line.png')} style={{ height: 100, width: 10, marginTop: 33,marginHorizontal:0, resizeMode: 'contain' }} />
            </View>
            <View style={{marginHorizontal:10,}}>
    <Text style={{marginHorizontal:-10,marginTop:30,fontSize:15, color: '#34495A',fontFamily:'Lato-Bold',fontSize:17}}>{item.name_value_list.id.value.substring(1, 8)}</Text>
      <Image source={require('../components1/images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain',marginHorizontal:-10 }} />
      <Text style={{color:'#34495A',fontWeight:"500",fontFamily:'Lato-Bold',fontSize:14,marginTop:10,width:190,marginHorizontal:-10}}>{item.name_value_list.name.value}</Text>
      <Text style={{color:'#34495A',fontFamily:'Lato-Regular',fontSize:12,marginTop:10,marginHorizontal:-10}}>Last Ordered:{item.name_value_list.date_entered.value}</Text>
    </View>

    </View>
 </ImageBackground>
 </View>
  
</TouchableOpacity>

    )
}





export default OrderGuide;

const styles=StyleSheet.create({
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
    shadowProp: {
      shadowColor: '#171717',
      shadowOffset: {width: -2, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 3,
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

        
})