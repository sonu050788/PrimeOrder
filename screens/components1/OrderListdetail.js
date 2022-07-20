import React, { Component } from 'react';
import { Text,Keyboard,ImageBackground,Dimensions,TextInput, View,StyleSheet,Image,TouchableOpacity,Alert,SafeAreaView,FlatList, ScrollView,ActivityIndicator} from 'react-native';
import { SearchBar } from 'react-native-elements';
import CommonDataManager from './CommonDataManager';
import {images} from './images/images'
var orderid=[]
const Constants = require('../components1/Constants');
import LinearGradient from 'react-native-linear-gradient';
// const GET_DATAURL='http://192.168.9.14:8080/get_data_s.php'
const GET_DATAURL=Constants.GET_URL;
let commonData = CommonDataManager.getInstance();
const{height}=Dimensions.get("window");
const {width}=Dimensions.get("screen")
class OrderListdetail extends Component {
    
    constructor(props) {
        super(props);
        this.getListCall= this.getListCall.bind(this);
        this.calculateRunningTotals= this.calculateRunningTotals.bind(this);
        this.state = {       
        search: '',
        data: [],
        error: null,
        mainData :[],
        orderitemlist:[],
        Qty:0,
        price:0,    
        Items:0,
        OrderedDate:'',
        customername:'',
        JSONResult:[],
        loading:true,
        value:'',
        searchmsg:'',
        screenHeight: height,
        orderid:""

    }
     this.arrayholder = [];
    }
    componentWillMount(){
        this.state.value=''
        this.state.searchmsg=''
            this.calculateRunningTotals();
            
        }
    componentDidMount() {
        this.getListCall();
        
    }
    getListCall() {
        this.state.value=''
        this.state.searchmsg=''
       var  oid= this.props.navigation.getParam('orderid','')
       this.state.orderid=oid;
        var that = this;
        this.makeRemoteRequest();
        // here we are quering po_user.username using post method ........
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
  const itemData = `${item.name_value_list.productid.value.toUpperCase()} ${item.name_value_list.description.value.toUpperCase()}`;
   const textData = text.toUpperCase();
   return itemData.indexOf(textData) > -1;    
});
this.setState({ JSONResult: newData });  
};
    calculateRunningTotals=()=>{
            console.log('calculating running totals')
              let Qty=0,price=0
              let Items=this.state.JSONResult.length
              for(var i=0; i<Items;i++){
                Qty=Qty+Number(this.state.JSONResult[i].name_value_list.quantity.value)
                if(this.state.JSONResult[i].name_value_list.price.value!=null)
                 price=price+(Number(this.state.JSONResult[i].name_value_list.quantity.value)*Number(this.state.JSONResult[i].name_value_list.price.value))
              }
              this.state.price=price
              this.state.Qty=Qty
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
         imagloc=require('./images/itemImage/IRG-14.jpg');
        return imagloc;
        
    }
    render() {
        const scrollEnabled = this.state.screenHeight > height;
        this.state.searchmsg=this.state.JSONResult.length+' Results'

        if (this.state.loading) {
          return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(52, 52, 52, 0.8)' }}>
              <ActivityIndicator />
              <Text style={{fontFamily:'Lato-Bold'}}>Loading Items, Please wait.</Text>
            </View>
          );
        }
        return (
       
        <View style={{backgroundColor:'#FFFFFF',flex:1}}>
            <View style={{marginTop:30}}>
            <TouchableOpacity style={{borderRadius:20, height:60,width:60, justifyContent:'center', alignItems:'center' }} onPress={()=>this.props.navigation.goBack()}>           
                 <Image transition={false} source={require('../components1/images/arrow.png')} style={{height:35,width:35,  resizeMode:"contain", alignSelf:'center'}} />
          </TouchableOpacity> 
            <Text style={{  color: '#1B1BD0',backgroundColor:'#FFFFFF', fontSize: 20, height: 50,marginHorizontal:10, marginTop: -50,fontFamily:'Lato-Regular' ,fontWeight:'bold',fontSize:22,alignSelf:'center',textAlign:"center"}}>Order Details</Text>
            </View>
        <View style={{flexDirection:'row',backgroundColor:'#FFFFFF',alignContent:'center',justifyContent:'center',width:'100%'}}>  
                <TextInput  placeholder="Enter Product # or Name" 
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
elevation: 4 }}onPress={() => this.searchFilterFunction('')}>
                   
              <Text style={styles.textSign}>Clear</Text>
              {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}
            
                    </TouchableOpacity>  
         </View>
        {/* <View style={{backgroundColor:'#FFFFFF',height:50,marginLeft:20, flexDirection:"row",marginHorizontal:30}}> */}
        {/* <Text style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:5,marginHorizontal:30}}>Select Your Store to Place the Order</Text> */}
        <Text style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:5,marginHorizontal:30}}>{this.state.searchmsg}</Text>
                 <View style={{height:80, backgroundColor:'#FFFFFF',marginTop:5,marginHorizontal:0,alignContent:'center',width:width}}>
                     <View style={{marginHorizontal:30,marginTop:8,height:80}}>
                <Text style={{color:'#34495A',fontFamily:'Lato-Bold',marginTop:-10}}>Order Summary</Text>
                <Text style={{color:'#34495A',fontSize:12,fontFamily:'Lato-Regular'}}></Text>
                 <Text style={{marginTop:-20, fontSize:12, color:'#34495A',fontFamily:'Lato-Regular'}}>{this.state.customername}</Text>
                 <Text style={{color:'#34495A',fontSize:12,fontFamily:'Lato-Regular'}}>Ordered Date : {this.state.OrderedDate}</Text>
                 <Text style={{color:'#34495A',fontSize:12,fontFamily:'Lato-Regular'}}>Total Items : {this.state.Items}</Text>
                 <View style={{flexDirection:'row',width:width}}>
                 <Text style={{color:'#34495A',fontSize:12,fontFamily:'Lato-Regular',width:width/2}}>Total Qty : {this.state.Qty}</Text>
                 <Text style={{color:'#34495A',fontSize:12,fontFamily:'Lato-Regular',width:width/2}}>Total Price : {this.state.price}</Text>
                 </View>
                 </View>
                 </View>
                 <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                contentContainerStyle={styles.ScrollView}
                scrollEnabled={scrollEnabled}
                horizontal={true}
                onContentSizeChange={this.onContentSizeChange}>
        <View style={{flexGrow:1,justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',marginTop:10}}>
              <FlatList
                  data={this.state.JSONResult}
                  renderItem={this.sampleRenderItem}
                  extraData={this.state.refresh}
                  keyExtractor={(item, index) => toString(item)}
                  ItemSeparatorComponent={this.renderSeparator}

              />
            </View> 
          </ScrollView>
            </View>
          
        );
    }
    sampleRenderItem = ({ item }) => (

        <View style={styles.flatliststyle}>
        <ImageBackground source={require('./images/itembg.png')} style={styles.flatrecord}>
          <View style={{flexDirection:'row'}}>
          <View style={{flexDirection:"row"}}>
          <TouchableOpacity style={{height: 100, width: 100,marginHorizontal:39,marginTop:10}}>
              <Image transition={false} source={this.getImageforItemid(item.name_value_list.productid.value)} style={{ height: 80, width: 80, marginTop: 5,marginHorizontal:0, resizeMode: 'center' }} />
          </TouchableOpacity>
          <Text  style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:100,marginHorizontal:-120}}>{item.name_value_list.productid.value}</Text>
          <Image transition={false} source={require('./images/line.png')} style={{ height: 100, width: 80, marginTop: 25,marginHorizontal:93, resizeMode: 'contain' }} />
          </View>
          <View style={{marginHorizontal:-110,}}>
            <Text style={{color:'#7A7F85',borderBottomColor:'#7A7F85',fontFamily:'Lato-Regular',marginTop:23}}>Net wt: 200 gms</Text>
            <Image transition={false} source={require('./images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain' }} />
            <Text style={{color:'#34495A',fontWeight:"500",fontFamily:'Lato-Bold',fontSize:14,marginTop:0,width:190}}>{item.name_value_list.description.value}</Text>
            <Text style={{color:'#34495A',fontWeight:"500",fontFamily:'Lato-Bold',fontSize:14,marginTop:10,width:190}}>Quantity Ordered : {item.name_value_list.quantity.value}</Text>
          </View>
          <Text style={{color:'#FF8DB8',borderBottomColor:'#7A7F85',fontWeight:'900',fontFamily:'Lato-Bold',marginTop:20,marginHorizontal:99}}>₹{Number(item.name_value_list.price.value)}</Text>
          </View>
       </ImageBackground>
       </View>
    )
}





export default OrderListdetail;

const styles=StyleSheet.create({
    flatliststyle: {
        marginTop: -10,
    height: 200,
    backgroundColor:'#FFFFFF' ,
    marginHorizontal: -30,
    alignSelf:'center',
    // elevation: 3,
    marginVertical: -40,
    resizeMode:"contain"
            },
        
        textOrder: {
            color: '#00ACEA',
            fontSize: 27,
            marginHorizontal:0,
            fontWeight:'bold',
            fontFamily:'Lato-Bold'
            // fontWeight:'bold'
        
          },
          textPrime: {
            color: '#34495A',
            fontSize: 27,
            marginHorizontal:0,
            fontWeight:'bold',
            
            // fontWeight:'bold'
          },
          flatrecord: {
            marginTop: -1,
            paddingVertical:10,
            height: 180,
            width:width+50,
            backgroundColor:'#FFFFFF' ,
            // marginHorizontal: -30,
            alignSelf:'center',
            // marginVertical: -30,
            resizeMode:"stretch"
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
          
            content: {
                flexGrow: 1,
                justifyContent: "space-between",
                padding: 10,
              },
              ScrollView:{
                flexGrow:1,
              },
})