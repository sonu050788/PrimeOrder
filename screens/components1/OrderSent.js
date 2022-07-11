import React, { Component } from 'react';
// import { Text, View ,Image,ImageBackground,TouchableOpacity} from 'react-native';
// import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  StyleSheet,
  StatusBar,
  Image,
  SafeAreaView,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '@react-navigation/native';
import {Button} from 'react-native-paper';
const {width}=Dimensions.get("screen")
 class OrderSent extends Component {
 

  render() {
    let TYPE=this.props.navigation.getParam('TYPE','')
    let Title="Order Sent Successfully!"
    let subtitle="Thank you for your Order!"
    if(TYPE=="RETURN"){

      Title="Return Order Initiated"
      subtitle=""
    }
    return (
      <SafeAreaView style={{ justifyContent: "center", alignItems: "center" ,backgroundColor:'#FFFFFF',height:900}}>
        {/* <View style={{flexDirection:'column',backgroundColor:'#FFFFFF',marginTop:20}}>
        <Image source={require('../components1/images/right.png')} style={{height:131,width:131,alignSelf:'center',marginTop:30}}>
        </Image>
        <Text style={{fontFamily:'Lato-Bold',marginTop:15}}>{Title}</Text>
        <Text style={{fontFamily:'Lato-Regular',marginTop:150}}>{subtitle}</Text>
        </View>
        {TYPE==""? 
        <View style={{flexDirection:'row',backgroundColor:'#FFFFFF',marginTop:10}}>
        
        <TouchableOpacity onPress={() => { this.props.navigation.navigate('HomeTab') }}>
            <ImageBackground source={require('../components1/images/dashboardImage.png')} style={{height:100,width:130,alignSelf:'center',marginHorizontal:10}}>
            </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { this.props.navigation.navigate('customer')}}>
            <ImageBackground source={require('../components1/images/CreateOrder.png')} style={{height:100,width:130,alignSelf:'center',justifyContent:'space-between'}}>
            </ImageBackground>
        </TouchableOpacity></View>:
         <TouchableOpacity onPress={() => { this.props.navigation.navigate('HomeTab') }}>
         <ImageBackground source={require('../components1/images/dashboardImage.png')} style={{height:100,width:180,alignSelf:'center',marginHorizontal:10}}>
        //  </ImageBackground>
     </TouchableOpacity>} */}
     <Animatable.View style={styles.footer} animation="fadeInUpBig">
       <View style={{flex:3}}>
         <View style={{flex:1}}>
        <Text style={styles.title}>Thank You</Text>
        <Image source={require('../components1/images/order_logo.jpeg')} style={{flex:0.5,height:200,width:200,alignSelf:'center',marginHorizontal:10,marginTop:20}}>
            </Image>
        <Text style={styles.text}>Your Order is Placed Successfully</Text>
        <Text style={styles.text}>Please check your email for Invoice</Text>
       
            </View>
            <View>
              <Text style={styles.text}></Text>
            </View>
        {/* <View style={{flexDirection:'row',backgroundColor:'#FFFFFF',marginTop:10}}></View> */}
        {/* {TYPE==""?  */}
         <Text style={{color:'#000000',fontFamily:'Lato-Bold',fontSize:16,alignSelf:'center',width:width-60,alignContent:'center'}}>Do You wish to place a new Order?</Text>
        <View style={{flexDirection:'row',backgroundColor:'green',flex:1,marginTop:10,width:width-60,height:100,alignSelf:'center',alignItems:'center',justifyContent:'center'}}>
        
      
        <TouchableOpacity style={{alignSelf:'center',width:90,height:40,backgroundColor:'#ffffff',  shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.5, marginHorizontal:5,
shadowRadius: 2,borderRadius:10,
elevation: 4 }} onPress={() => this.props.navigation.navigate('customer')}>
           
              <Text style={{color:'green',fontFamily:'Lato-Bold',alignSelf:'center',marginTop:10}}>Yes</Text>
             
          </TouchableOpacity>

      
          <TouchableOpacity style={{alignSelf:'center',width:90,height:40,backgroundColor:'#ffffff',  shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.5, marginHorizontal:5,
shadowRadius: 2,borderRadius:10,
elevation: 4 }} onPress={() => this.props.navigation.navigate('HomeTab')}>
            
              <Text style={{color:'#800000',fontFamily:'Lato-Bold',alignSelf:'center',marginTop:10}}>No</Text>
              
          
          </TouchableOpacity>
          </View>
          </View>
      </Animatable.View>
        
      </SafeAreaView>
    );
  }
}
export default OrderSent;
const {height} = Dimensions.get('screen');
const height_logo = height*2.6;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1BD0',
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    height: height_logo,
    borderRadius:height_logo/2

  },
  footer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius:150,
    alignItems: 'center',
  },
  title: {
    color: '#05375a',
    fontSize: 30,
    fontWeight: 'bold',
    alignSelf:'center'
  },
  text: {
    color: 'grey',
    marginTop: 5,
    alignSelf:'center'
  },
  button: {
    alignItems: 'flex-end',
    marginStart:100
  },
  signIn: {
    width: 140,
    height: 40,
    borderWidth:1,
  
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',

  },
  yesbtn: {
    width: 140,
    height: 40,
   
    borderWidth:1,
    borderColor:'green',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',

  },
  nobtn: {
    width: 140,
    height: 40,
    
    borderWidth:1,
    borderColor:'#800000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',

  },
  signIn1: {
    // alignItems: 'flex-end',
    marginBottom:100
  },
  textSign: {
    color: 'white',
    // fontWeight: 'bold',
    fontFamily:'Lato-Bold'
  },
});
