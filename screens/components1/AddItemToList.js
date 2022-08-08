import React, { Component } from 'react';
import { Text,StyleSheet, Dimensions,View ,Image,FlatList, ScrollView,ImageBackground,TouchableOpacity,KeyboardAvoidingView, Alert} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import CommonDataManager from './CommonDataManager';
let commonData = CommonDataManager.getInstance();
let screenwidth= Dimensions.get('window').width;
let screenheight= Dimensions.get('window').height;
const{height}=Dimensions.get("window");
const {width}=Dimensions.get("screen")
const Constants = require('../components1/Constants');
import {TextInput} from "react-native-paper"

let Scannedvalue = ''

const SET_DATAURL= Constants.SET_URL;
 class AddItemToList extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      QR_Code_Value:"",
      Start_Scanner: false,
      arrayHolder:[  
        {key: 'ProductID',placeholder:"Enter the ProductID",value:""},{key: 'Product Description',placeholder:"Enter the Description",value:""}, {key: 'Manufacturer',placeholder:"Enter the Manufacturer",value:""},{key: 'Category',placeholder:"Enter the Category",value:""},  
        {key: 'Sub-Category',placeholder:"Enter the Sub-Category",value:""},{key: 'Product Class',placeholder:"Enter the Product Class",value:""},{key: 'UPC/Barcode',placeholder:"Enter the UPC",value:""},  
        {key: 'Qty On Hand',placeholder:"Enter the Qty on Hand",value:""}, {key: 'Base Price',placeholder:"Enter the Base Price",value:""},  
        {key: 'UOM',placeholder:"Enter the UOM",value:""},{key: 'Size',placeholder:"Enter the Size",value:""},{key: 'Weight',placeholder:"Enter the Weight",value:""},  
        {key: 'Pack',placeholder:"Enter the Pack",value:""}, {key: 'Extra Info 1',placeholder:"Enter the Extra Info1",value:""},{key: 'Extra Info 2',placeholder:"Enter the Extra Info 2",value:""},  
        {key: 'Extra Info 3',placeholder:"Enter the Extra Info 3",value:""},{key: 'Extra Info 4',placeholder:"Enter the Extra Info 4",value:""},{key: 'Extra Info 5',placeholder:"Enter the Extra Info 5",value:""}  
    ],
      itemID:"",
      desc:"",
      mfd:"",
      category:"",
      sub_cat:"",
      class:"",
      upc:"",
      moq:"",
      on_hand:"",
      base:"",
      Selling:"",
      cost1:"",
      cost2:"",
      uom:"",
      size:"",
      weight:"",
      pack:"",
      ext1:"",ext2:"",ext3:"",ext4:"",ext5:"",
      value:"",
      data:"",
      text:"gfgggg",
      refresh:false,
      screenHeight:"",
      textInputs: [],
      id:"",
     
     mfd:"",
     qty:""
    }
  }
  openLink_in_browser = () => {

    Linking.openURL(this.state.QR_Code_Value);

  }
  

  searchFilterFunction=(text,index)=>{
    this.state.arrayHolder[index].value=text;

     this.forceUpdate();

  }

  sampleRenderItem = ({ item ,index}) => (
  
<View style={{width:width-50}}>
{/* <Text style={{width:100,fontFamily:'Lato-Bold'}}>{item.key}</Text> */}

<TextInput
       label={item.key}
               
       type="outlined"
          placeholderTextColor='#dddddd'
          underlineColor='#dddddd'
          activeUnderlineColor='#dddddd'
          outlineColor="#dddddd"
          selectionColor="#dddddd"
          autoCompleteType='off'
          autoCorrect={false}
keyboardType="default"

underlineColorAndroid="transparent"
onChangeText={username => this.searchFilterFunction(username,index)}
clearButtonMode="always"
// ref={username => { this.textInput = username }}

style={{
backgroundColor:'white',
width:screenwidth-60,
color: '#534F64',
marginTop: 10,

}}
value={item.value}
/>
</View>


    
  )
  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  };
  renderSeparator = () => {  
    return (  
        <View  
            style={{  
                height: 0,  
                width: "100%",  
                backgroundColor: "#000",  
            }}  
        />  
    );  
};  
componentDidMount(){
  this.state.arrayHolder[0].value=this.props.navigation.getParam('itemid','')
  this.state.arrayHolder[1].value=this.props.navigation.getParam('desc','')
  this.state.arrayHolder[8].value=this.props.navigation.getParam('price','')
  this.state.id=this.props.navigation.getParam('id','')
  this.state.arrayHolder[6].value=this.props.navigation.getParam('upc','')
  this.state.arrayHolder[11].value=this.props.navigation.getParam('weight','')
  var itemdetails =this.props.navigation.getParam('itmdetails','');
  this.state.arrayHolder[2].value=itemdetails.manufacturer;
  this.state.arrayHolder[3].value=itemdetails.category
  this.state.arrayHolder[4].value=itemdetails.subcategory
  this.state.arrayHolder[5].value=itemdetails.class
  this.state.arrayHolder[7].value=this.props.navigation.getParam('onHand','')
  this.state.arrayHolder[9].value=itemdetails.uom
  this.state.arrayHolder[10].value=itemdetails.size
  this.state.arrayHolder[12].value=itemdetails.pack
  this.state.arrayHolder[13].value=itemdetails.extrainfo1
  this.state.arrayHolder[14].value=itemdetails.extrainfo2
  this.state.arrayHolder[15].value=itemdetails.extrainfo3
  this.state.arrayHolder[16].value=itemdetails.extrainfo4
  this.state.arrayHolder[17].value=itemdetails.extrainfo5


  this.forceUpdate();
 
  let editable = true;
  if(this.state.arrayHolder[0].value!="")
  {
    
   editable=false;
  }
  for(var i=0;i<this.state.arrayHolder.length;i++){
    if(this.state.arrayHolder[i].key=="ProductID" && editable==false)
      this.state.arrayHolder[i].editable=editable
    else
    this.state.arrayHolder[i].editable=true
  }
}
submitebuttonPressed=()=>{
  var ItemArray =[...commonData.getinventoryItemsArray()];
  let index =ItemArray.indexOf(item=>item.itemid==this.state.arrayHolder[0].value);
  ItemArray.splice(index,1);
//   ItemArray.push({id:this.state.id,itemid:this.state.arrayHolder[0].value,description:this.state.arrayHolder[1].value,
//   mfd:this.state.arrayHolder[2].value,category:this.state.arrayHolder[3].value,
// sub_cat:this.state.arrayHolder[4].value,class:this.state.arrayHolder[5].value,UPC:this.state.arrayHolder[6].value,
// moq:this.state.arrayHolder[7].value,stock:this.state.arrayHolder[8].value,
// base_price:this.state.arrayHolder[9].value,selling_price:this.state.arrayHolder[10].value,
// cost1:this.state.arrayHolder[11].value,cost2:this.state.arrayHolder[12].value,
// uom:this.state.arrayHolder[13].value,size:this.state.arrayHolder[14].value,
// weight:this.state.arrayHolder[15].value,pack:this.state.arrayHolder[16].value,
// exta1:this.state.arrayHolder[17].value,exta2:this.state.arrayHolder[18].value,exta3:this.state.arrayHolder[19].value,
// exta4:this.state.arrayHolder[20].value,exta5:this.state.arrayHolder[21].value
// });
// ItemArray.push({id:this.state.id,
//   itemid:this.state.arrayHolder[0].value,
//   description:this.state.arrayHolder[1].value,
//   mfd:this.state.arrayHolder[2].value,
//   category:this.state.arrayHolder[3].value,
// sub_cat:this.state.arrayHolder[4].value,
// class:this.state.arrayHolder[5].value,
// UPC:this.state.arrayHolder[6].value,
// moq:this.state.arrayHolder[7].value,
// stock:this.state.arrayHolder[8].value,
// base_price:this.state.arrayHolder[9].value,
// selling_price:this.state.arrayHolder[10].value,
// cost1:this.state.arrayHolder[11].value,
// cost2:this.state.arrayHolder[12].value,
// uom:this.state.arrayHolder[13].value,
// size:this.state.arrayHolder[14].value,
// weight:this.state.arrayHolder[15].value,
// pack:this.state.arrayHolder[16].value,
// exta1:this.state.arrayHolder[17].value,
// exta2:this.state.arrayHolder[18].value,
// exta3:this.state.arrayHolder[19].value,
// exta4:this.state.arrayHolder[20].value,
// exta5:this.state.arrayHolder[21].value
// });
ItemArray.push({id:this.state.id,
  itemid:this.state.arrayHolder[0].value,
  description:this.state.arrayHolder[1].value,
  mfd:this.state.arrayHolder[2].value,
  category:this.state.arrayHolder[3].value,
sub_cat:this.state.arrayHolder[4].value,
class:this.state.arrayHolder[5].value,
UPC:this.state.arrayHolder[6].value,
stock:this.state.arrayHolder[7].value,
base_price:this.state.arrayHolder[8].value,
uom:this.state.arrayHolder[9].value,
size:this.state.arrayHolder[10].value,
weight:this.state.arrayHolder[11].value,
pack:this.state.arrayHolder[12].value,
exta1:this.state.arrayHolder[13].value,
exta2:this.state.arrayHolder[14].value,
exta3:this.state.arrayHolder[15].value,
exta4:this.state.arrayHolder[16].value,
exta5:this.state.arrayHolder[17].value
});

commonData.setinventoryItemsArray(ItemArray);
this.props.navigation.goBack();
  return;
    
    
  }

//handling onPress action  
getListViewItem = (item) => {  
    Alert.alert(item.key);  
}  
  render() {
    const scrollEnabled = true;
    return (
      <SafeAreaView style={{ backgroundColor: '#FFFFFF',flex:1}}>
     
 <View style={{flexDirection:'row',backgroundColor:'#FFFFFF',marginTop:20}}>
            <TouchableOpacity style={{borderRadius:20, height:60,width:60, justifyContent:'center', alignItems:'center' }} onPress={()=>this.props.navigation.goBack()}>           
                 <Image source={require('../components1/images/arrow.png')} style={{height:35,width:35,  resizeMode:"contain", alignSelf:'center'}} />
          </TouchableOpacity> 
          
            <View style={{flexDirection:'row',backgroundColor:'#FFFFFF'}}>
            <Text style={{  color: '#1B1BD0',backgroundColor:' #FFFFFF', fontSize: 20, height: 50,marginHorizontal:40,fontFamily:'Lato-Regular' ,fontWeight:'bold',fontSize:22,alignSelf:'center',textAlign:"center",justifyContent:'center',marginTop:10}}>Add Item Details</Text>

        </View>
    </View>
        {/* <View style={{height:height-300}}>   */}
      <ScrollView 
    contentContainerStyle={{
        flexDirection: 'row',
        alignSelf:'center',
        width:width-20,
        flexWrap: 'wrap'}}
      >
      {this.state.arrayHolder.map((item, index) => {
        console.log(index);

        return (
          // <View style={styles.flatliststyle}>
          <TextInput
       label={item.key}
               
       type="outlined"
          placeholderTextColor='#dddddd'
          underlineColor='#dddddd'
          activeUnderlineColor='#dddddd'
          outlineColor="#dddddd"
          selectionColor="#dddddd"
          autoCompleteType='off'
          autoCorrect={false}
keyboardType="default"

underlineColorAndroid="transparent"
onChangeText={username => this.searchFilterFunction(username,index)}
clearButtonMode="always"
// ref={username => { this.textInput = username }}

style={{
backgroundColor:'white',
width:screenwidth-60,
color: '#534F64',
marginTop: 10,

}}
value={item.value}
/>
        //  </View>
        );
      })}
    </ScrollView>
    {/* </View>    */}
      {/* <View style={{ backgroundColor: '#FFFFFF',height:height-200}}> */}
          {/* <KeyboardAvoidingView enabled> */}
      {/* <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                contentContainerStyle={styles.ScrollView}
                horizontal={true}
                scrollEnabled={scrollEnabled}
                onContentSizeChange={this.onContentSizeChange}>
                
                <View style={{justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',marginTop:0}}>
                <KeyboardAvoidingView
          style={{ flex: 1 }}

          keyboardVerticalOffset={100}
          behavior={"position"}
        > */}

                {/* <FlatList  
                
                    data={this.state.arrayHolder}  
                    renderItem={this.sampleRenderItem}
                    keyExtractor={(item, index) => toString(index)}
                    ItemSeparatorComponent={this.renderSeparator}  
                />   */}
                 {/* </KeyboardAvoidingView>
                  </View>
                 
              </ScrollView>
      */}

      {/* </View> */}
     <View style={{paddingBottom:10}}>
      <TouchableOpacity onPress={()=>{this.submitebuttonPressed()}} style={{flexDirection:'row',borderRadius: 20,alignSelf:'center',backgroundColor: '#1B1BD0', width: screenwidth-100, height: 40 ,marginTop:10}}>
           <Text style={{ width: screenwidth-100,color:'white',fontSize: 16,borderRadius: 20,fontFamily:'Lato-Regular',alignSelf:'center', height: 40, textAlignVertical:'center',backgroundColor:  '#1B1BD0',textAlign:'center' ,alignSelf:'center'}}>Submit</Text>
         </TouchableOpacity>
         </View>
         {/* </KeyboardAvoidingView> */}
      </SafeAreaView>
    );
  }
}



const styles=StyleSheet.create({
ScrollView:{
flexGrow:1,
},
flatliststyle: {
marginTop: 0,
height: 200,
width:screenwidth+30,
backgroundColor:'#FFFFFF' ,
marginHorizontal: -30,
alignSelf:'center',
marginVertical: -40,
resizeMode:"contain"
},
textOrder: {
    color: '#FF7D6B',
    fontSize:20,
    // fontWeight:'bold'

 },
 textPrime: {
  color: '#534F64',
  fontSize:20,
  // fontWeight:'bold'
},

 flatrecord: {
  // marginTop: -1,
  height: 180,
  width:screenwidth+30,
  backgroundColor:'#FFFFFF' ,
  // marginHorizontal: -30,
  alignSelf:'center',
  // marginVertical: -30,
  resizeMode:"stretch"
  },
  container: {  
    flex: 1,  
},  
item: {  
    padding: 10,  
    marginHorizontal:10,
    fontSize: 15,  
    height: 44,  
    width:150,
    fontFamily:'Lato-Regular'
},  
TouchableOpacityStyle:{
   
    height: 40, width: 40
   },
  
   FloatingButtonStyle: {
  
     resizeMode: 'contain',
     width: 40,
     height: 40,
   }
})
export default AddItemToList;