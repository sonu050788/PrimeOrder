import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeTab from '../components1/HomeTab'
import OrderItem from '../components1/OrderItem'
import customer from '../components1/Customer'
import Icon from 'react-native-vector-icons/Ionicons';  
// import Icon from 'react-native-vector-icons';
import SKU from '../components1/SKU'
import Offers from '../components1/Offers'
import AppInfo from '../components1/AppInfo'
import { ItemArrayAdded } from '../components1/SKU';
import CommonDataManager from './CommonDataManager';
let commonData = CommonDataManager.getInstance();

const {width}=Dimensions.get("screen")
class TabScreen extends Component {
  state = {
    isVisible: true, //state of modal default false
  }
  render() {
      return (
          <Appcontiner />
      );
  }
}
const TabNavigator = createMaterialBottomTabNavigator({
  HomeTab: {
      screen: HomeTab,
      headerMode: 'none',
      navigationOptions: {
        tabBarLabel: () => null,
  showLabel: false,
  tabBarOptions: { showLabel: false },
          tabBarIcon:({tintColor})=>(  
            <View style={{backgroundColor:{tintColor},width:30,height:30,flexDirection:'row',alignItems:'center',borderRadius:20,justifyContent:'center',borderRadius:4, 
            shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5, marginHorizontal:5,
          shadowRadius: 2,
          elevation: 4 ,
           backgroundColor: 'white',
           alignSelf:'center',
           justifyContent:'center',
           }} >
            <Icon name="md-home" color={tintColor} size={25}/> 
            {/* <Text color={tintColor} style ={{fontSize:12, fontFamily:'Lato',textAlign:'center', textAlignVertical:'center'}}> Home</Text>  */}
            </View>
        )  
,
          left: null,
      }
  },
  customer: {
    screen: customer,
    headerMode: 'none',
    navigationOptions: {
      
        tabBarLabel: () => null,
  showLabel: false,
  tabBarOptions: { showLabel: false },
        tabBarIcon:({tintColor})=>(  
          <View style={{backgroundColor:{tintColor},width:30,height:30,flexDirection:'row',alignItems:'center',borderRadius:20,justifyContent:'center',borderRadius:4, 
          shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5, marginHorizontal:5,
        shadowRadius: 2,
        elevation: 4 ,
         backgroundColor: 'white',
         alignSelf:'center',
         justifyContent:'center',
         }} >
          {/* <Icon name="md-home" color={tintColor} size={25}/>  */}
          <Icon name="md-outlet" color={tintColor} size={25}/>  
          {/* <Text color={tintColor} style ={{fontSize:12,fontFamily:'Lato',textAlign:'center', textAlignVertical:'center'}}> Stores</Text>  */}
          </View>
          
      )  
        ,left: null,
    }
  },
  SKU: {
    screen: SKU,
    headerMode: 'none',
    navigationOptions: {

  showLabel: false,
  tabBarLabel: () => null,
  tabBarOptions: { showLabel: false },
 
        tabBarIcon:({tintColor})=>(  
          
          <View style={{backgroundColor:{tintColor},width:30,height:30,flexDirection:'row',alignItems:'center',borderRadius:20,justifyContent:'center',borderRadius:4, 
          shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5, marginHorizontal:5,
        shadowRadius: 2,
        elevation: 4 ,
         backgroundColor: 'white',
         alignSelf:'center',
         justifyContent:'center',
         }} >
          <Icon name="md-beer" color={tintColor} size={25}/>   
          {/* <Text color={tintColor} style ={{fontSize:12,fontFamily:'Lato',textAlign:'center', textAlignVertical:'center'}}> SKU</Text>  */}
          </View>
      )  
        ,
        left: null,
    }
},
OrderItem: {  
  accessible:false,
  screen: OrderItem,
  headerMode:'none',

  navigationOptions: ({navigation}) => ({
  
  showLabel: false,
  tabBarLabel: () => null,
      tabBarIcon:({tintColor})=>(  
        <View style={{backgroundColor:{tintColor},width:30,height:30,flexDirection:'row',alignItems:'center',borderRadius:20,justifyContent:'center',borderRadius:4, 
        shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5, marginHorizontal:5,
      shadowRadius: 2,
      elevation: 4 ,
       backgroundColor: 'white',
       alignSelf:'center',
       justifyContent:'center',
       }} >
           <Icon name="md-cart" color={tintColor} size={25}/>  
         {commonData.getCurrentArray().length>0?
      <Text style={{backgroundColor:"#c94c4c",color:'white',width:15,height:15,borderRadius:10,textAlign:'center',marginHorizontal:-10,marginTop:-32,fontSize:8,fontFamily:'Lato-Regular',textAlignVertical:'center'}}>{commonData.getCurrentArray().length}</Text>
       :null
      }
     
        {/* <Text color={tintColor} style ={{fontSize:12,fontFamily:'Lato',textAlign:'center', textAlignVertical:'center'}}> Cart</Text>  */}
        </View>
        
    )  
      ,left: null,
  }),
},
// Offers: {
//   screen: Offers,
//   headerMode: 'none',
//   navigationOptions: {
//     tabBarLabel: () => null,
//   showLabel: false,
//   tabBarOptions: { showLabel: false },
//       tabBarIcon:({tintColor})=>(  
//         <View style={{backgroundColor:{tintColor},width:30,height:25,flexDirection:'row',alignItems:'center',borderRadius:20,justifyContent:'center',borderRadius:4, 
//         shadowColor: '#000',
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.5, marginHorizontal:5,
//       shadowRadius: 2,
//       elevation: 4 ,
//        backgroundColor: 'white',
//        alignSelf:'center',
//        justifyContent:'center',
//        }} >
          
//         <Icon name="md-gift" color={tintColor} size={20}/>  
//          {/* <Text color={tintColor} style ={{fontSize:12,backgroundColor:{tintColor},fontFamily:'Lato',textAlign:'center', textAlignVertical:'center'}}> Info</Text>  */}
//          </View>
       
//     )  
//       ,left: null,
//   }
// },
// AppInfo: {
//   screen: AppInfo,
//   headerMode: 'none',
//   navigationOptions: {
//     tabBarLabel: () => null,
//   showLabel: false,
//   tabBarOptions: { showLabel: false },
//       tabBarIcon:({tintColor})=>(  
//         <View style={{backgroundColor:{tintColor},width:30,height:25,flexDirection:'row',alignItems:'center',borderRadius:20,justifyContent:'center',borderRadius:4, 
//         shadowColor: '#000',
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.5, marginHorizontal:5,
//       shadowRadius: 2,
//       elevation: 4 ,
//        backgroundColor: 'white',
//        alignSelf:'center',
//        justifyContent:'center',
//        }} >
//         <Icon name="md-information-circle-outline" color={tintColor} size={20}/>  
//          {/* <Text color={tintColor} style ={{fontSize:12,backgroundColor:{tintColor},fontFamily:'Lato',textAlign:'center', textAlignVertical:'center'}}> Info</Text>  */}
//          </View>
       
//     )  
//       ,left: null,
//   }
// },
},
{
  initialRouteName: 'HomeTab',
  activeColor: '#1B1BD0',
  tabBarOptions: { showLabel: false },
  inactiveColor: '#dddddd',
  showLabel: false,
  borderRadius:50,
  height:25,
  
  barStyle: { backgroundColor: '#ffffff' ,
  showLabel: false,
  // borderRadius:50,
  position: 'absolute',
  overflow:'hidden',
  left: 0,
  bottom: 0,
  right: 0,
  padding:1,
  
},
},{labeled:false});
export default Appcontiner = createAppContainer(TabNavigator)
