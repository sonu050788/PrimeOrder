import React, { Component } from 'react';
import { Text, View,StyleSheet,Image,TouchableOpacity,Alert,ScrollView,FlatList} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {Card} from 'native-base'
import CommonDataManager from './CommonDataManager';
let commonData = CommonDataManager.getInstance();
class Itemdetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemID:'0001',
            description:'Strawberries',
            onHand:'23',
            MOQ:'12',
            LastOrdered:'23/08/2019',
            itemImage:'',
            search: '',
            qty:'',
            Sourcefile:'',
            price:'',
            weight:''
    }
    }
   
    ArrowForwardClick=()=>{
        Alert.alert("Loading soon")
    }
    Back=()=>{
      var temparray=commonData.getCurrentArray();
      const filteredData = temparray.filter(item => item.qty !== 0);
      commonData.setArray(filteredData)
 
    }
    AddItem = (Qty,type) => {
        if(commonData.isOrderOpen==true){
          let TYPE =commonData.getContext();
          
          if(TYPE=="RETURN"){
            if(Qty==0|| type=="+"){
            Alert.alert('Warning','You cannot add item to the Return Orders')
            
            // Alert.alert('Warning','Items cannot be added to the Bundled Orders')
            return;
            }
          }
          if(commonData.context=="OG"&&Qty==0){
            Alert.alert('Warning','Items cannot be added to the Bundled Orders')
            return;
          }
        let qtyval = Number(Qty)
        if(type=='+'){

        qtyval=qtyval+1; 
        }
         else if(type =='-'){
          if(qtyval>0)
          qtyval=qtyval-1;
         }
            this.state.qty=qtyval.toString()
        //Update the FlatList
        //11-Sept-2019
        //#Issue fixed for Updating Qty from 0
        var temparray=commonData.getCurrentArray();
        if(commonData.isOrderOpen==true)
        {
          
        const newData =temparray.filter(item =>item.itemid.includes(this.state.itemID))
          if(newData.length==0){
            temparray.push({ itemid: this.state.itemID, description: this.state.description, price: this.state.price, qty: this.state.qty, imgsrc: this.state.itemImage,upc:this.state.upc,weight:this.state.weight});
          }
          
        }
         for(var i=0; i<temparray.length;i++){
           if(temparray[i].itemid==this.state.itemID){
              temparray[i].qty =qtyval
              if(qtyval==0){
                this.state.qty=0
                temparray.splice(i,1)
              }
              break;
           }
         }
         commonData.setArray(temparray)
          this.forceUpdate();
        }else{
          Alert.alert('Alert','You do not have an open order to add items.')
        }
      commonData.setContext('ID')
    }
    componentWillMount(){
      this.state.itemID=this.props.navigation.getParam('storeID','')
      this.state.description=this.props.navigation.getParam('desc','')
      this.state.onHand=this.props.navigation.getParam('onHand','')
      this.state.itemImage=this.props.navigation.getParam('itemImage','')
      this.state.qty=this.props.navigation.getParam('qty','0')
      this.state.Sourcefile=this.props.navigation.getParam('from','')
      this.state.price=this.props.navigation.getParam('price','0')
      this.state.upc=this.props.navigation.getParam('upc','')
      this.state.weight=this.props.navigation.getParam('weight','')
      this.state.itemImage=require('./images/itemImage/IRG-14.jpg');
    }
    render() {
      var message="Item out of Stock";
      if(this.state.onHand<this.state.qty)
        message="You cannot order  more than the onHand Qty"

        return (
            <SafeAreaView>
            <View style={{backgroundColor:'#FFFFFF'}}>
            <View style={{flexDirection:'row',backgroundColor:'#FFFFFF'}}>
            <TouchableOpacity style={{borderRadius:20, height:60,width:60, justifyContent:'center', alignItems:'center' }} onPress={()=>this.props.navigation.goBack()}>           
                 <Image source={require('../components1/images/arrow.png')} style={{height:35,width:35,  resizeMode:"contain", alignSelf:'center'}} />
          </TouchableOpacity> 
           {/* <TouchableOpacity  style={{borderRadius:20, height:40,width:50, justifyContent:'center', alignItems:'center' }} onPress={()=>this.props.navigation.navigate(this.state.Sourcefile,
                       {storeID:this.state.itemid,id:'0',qty:this.state.qty})}>           
                <Image source={require('../components1/images/arrow.png')} style={{height:25,width:25,  resizeMode:'cover', alignSelf:'center'}} />
            </TouchableOpacity> */}
            <View style={{flexDirection:'row',backgroundColor:'#FFFFFF'}}>
            <Text style={{  color: '#1B1BD0',backgroundColor:' #FFFFFF', fontSize: 20, height: 50,marginHorizontal:70,fontFamily:'Lato-Regular' ,fontWeight:'bold',fontSize:22,alignSelf:'center',textAlign:"center",justifyContent:'center',marginTop:10}}>Item Details</Text>

        </View>
            </View>
             
                         <Image  style={{marginTop:10, marginHorizontal:10, width:250, height:250,resizeMode:'contain',alignSelf:"center"}} source={this.state.itemImage}></Image>
                        <View style={{ marginHorizontal:40,backgroundColor:'#FFFFF'}}>
                        {/* <Card style={{backgroundColor:'#E9DAF6',marginTop:30}}> */}
                            <View style={{flexDirection:'row',backgroundColor:'#FFFFFF'}}>
                         <Text style={{marginTop:30, marginHorizontal:20,color:'#34495A', width:100,fontFamily:'Lato-Regular',fontSize:12}}>Item ID</Text>     
                         <Text style={{marginTop:30,fontFamily:'Lato-Regular',color:'#34495A',fontSize:12}}>{this.state.itemID}</Text>
                         </View>
                         <View style={{flexDirection:'row',backgroundColor:'#FFFFFF'}}>
                         <Text style={{marginTop:15, marginHorizontal:20, color:'#34495A',  width:100,fontFamily:'Lato-Regular',fontSize:12}}>Description</Text>
                         <Text  style={{marginTop:15,fontFamily:'Lato-Regular',color:'#34495A',fontSize:12}}>{this.state.description}</Text>
                         </View>
                         <View style={{flexDirection:'row',backgroundColor:'#FFFFFF'}}>
                         <Text style={{marginTop:15, marginHorizontal:20, color:'#34495A', width:100,fontFamily:'Lato-Regular',fontSize:12}}>MOQ</Text>
                         <Text  style={{marginTop:15,fontFamily:'Lato-Regular',color:'#34495A',fontSize:12}}>{this.state.MOQ}</Text>
                         </View>
                         <View style={{flexDirection:'row',backgroundColor:'#FFFFFF'}}>
                         <Text style={{marginTop:15, marginHorizontal:20, color:'#34495A',  width:100,fontFamily:'Lato-Regular',fontSize:12}}>Last Ordered</Text>
                         <Text  style={{marginTop:15,fontFamily:'Lato-Regular',color:'#34495A',fontSize:12}}>{this.state.LastOrdered}</Text>
                         </View>
                         <View style={{flexDirection:'row',backgroundColor:'#FFFFFF'}}>
                         <Text style={{marginTop:15, marginHorizontal:20, color:'#34495A', width:100,fontFamily:'Lato-Regular',fontSize:12}}>On Hand</Text>
                         {Number(this.state.onHand)>0?<Text  style={{marginTop:15,fontFamily:'Lato-Regular',color:'#34495A',fontSize:12}}>{this.state.onHand}</Text>:<Text  style={{marginTop:15,fontFamily:'Lato-Regular',color:'red',fontSize:12}}>out of stock!!</Text>}
                         </View>
                         <View style={{flexDirection:'row',backgroundColor:'#FFFFFF'}}>
                         <Text style={{marginTop:15, marginHorizontal:20, color:'#34495A', width:100,fontFamily:'Lato-Regular',fontSize:12}}>Price</Text>
                         <Text  style={{marginTop:15,fontFamily:'Lato-Regular',color:'#34495A',fontSize:12}}>{this.state.price}</Text>
                         </View>
                         <View style={{flexDirection:'row',backgroundColor:'#FFFFFF'}}>
                         <Text style={{marginTop:15, marginHorizontal:20, color:'#34495A', width:100,fontFamily:'Lato-Regular',fontSize:12}}>Upc</Text>
                         <Text  style={{marginTop:15,fontFamily:'Lato-Regular',color:'#34495A',fontSize:12}}>{this.state.upc}</Text>
                         </View>
                         
                         {/* </Card> */}
                         </View>
                      
                     <View style={{width:150,marginTop:20, height:700,alignSelf:'center',flexDirection:'row',borderRadius:5, borderColor: 'grey', backgroundColor: '#FFFFFF'}}>
                     <TouchableOpacity style={{width:50, height:48}}onPress={()=>{(Number(this.state.onHand)>0 )?this.AddItem(this.state.qty,'-'):Alert.alert("Warning","Item is out of Stock")}}>
                     <Image source={require('./images/minus.png')} style={{width:30, height:30,marginTop:10,alignSelf:'center'} }></Image>
                    </TouchableOpacity>
                     <Text style={{textAlign:'center',textAlignVertical:'center',justifyContent:'center',backgroundColor:'white',borderWidth: 1, borderColor:  '#CAD0D6',color:'#000000', fontSize:17,marginTop:10, width:60, height:30,fontFamily:'Lato-Regular'}}>{this.state.qty}</Text>
                     <TouchableOpacity style={{width:50,height:48}} onPress={()=>{(Number(this.state.onHand)>0 && Number(this.state.onHand)>this.state.qty)?this.AddItem(this.state.qty,'+'):Alert.alert("Warning",message)}}>
                     <Image source={require('./images/add.png')} style={{width:30, height:30,marginTop:10,alignSelf:'center'}}></Image>
                    </TouchableOpacity>
                    </View>
             </View>
            </SafeAreaView>
        );
    }
    
}



const styles=StyleSheet.create({
    
    textOrder: {
        color:'#34495A',
        fontSize:20,
         fontWeight:'bold',
         marginTop:5
  
     },
     textPrime: {
      color:'#34495A',
      fontSize:20,
       fontWeight:'bold',
       marginTop:5
   },
    image:{
        height:30,
        width:30,
        marginHorizontal:30,
        marginTop:30
        
    },
    big: {
        
        fontWeight: 'bold',
        fontSize: 13,
        borderColor: 'black',
        borderWidth: 1,
        marginTop:20, marginHorizontal:40, color:'grey', fontWeight:'bold', width:100,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
        
},
TextComponentStyle: {

    borderRadius: 5,

    // Set border width.
    borderWidth: 2,
 
    // Set border Hex Color Code Here.
    borderColor: 'gray',

    // Setting up Text Font Color.
    color: '#34495A',

    // Setting Up Background Color of Text component.
    backgroundColor : "white",
    
    // Adding padding on Text component.
    padding : 2,

    fontSize: 12,

    textAlign: 'center',

    margin: 10,
    width:200 
  },
  TextComponentStyle1:{
    borderRadius: 5,

    // Set border width.
    borderWidth: 2,
 
    // Set border Hex Color Code Here.
    borderColor: 'gray',

    // Setting up Text Font Color.
    color:  '#34495A',

    // Setting Up Background Color of Text component.
    backgroundColor : "white",
    
    // Adding padding on Text component.
    padding : 2,

    fontSize: 12,

    textAlign: 'center',

    margin: 10,
    width:200 
  },
  TextMOQ:{
    borderRadius: 5,

    // Set border width.
    borderWidth: 2,
 
    // Set border Hex Color Code Here.
    borderColor: 'gray',

    // Setting up Text Font Color.
    color: '#34495A',

    // Setting Up Background Color of Text component.
    backgroundColor : "white",
    
    // Adding padding on Text component.
    padding : 2,

    fontSize: 10,

    textAlign: 'center',

    margin: 10,
    width:200
  },
  TextOrdered:{
    borderRadius: 5,

    // Set border width.
    borderWidth: 2,
 
    // Set border Hex Color Code Here.
    borderColor: 'gray',

    // Setting up Text Font Color.
    color: '#34495A',

    // Setting Up Background Color of Text component.
    backgroundColor : 'white',
    
    // Adding padding on Text component.
    padding : 2,

    fontSize: 12,

    textAlign: 'center',

    margin: 10,
    width:200 
  }
})
export default Itemdetails;