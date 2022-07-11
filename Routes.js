import { createStackNavigator, createAppContainer } from 'react-navigation';
import unsentscreen from './screens/components1/unsentscreen'
// import  unsent from './screens/components1/unsent'
import customer from './screens/components1/Customer'
import LoginScreen from './screens/components1/Login'
import HomeTab from './screens/components1/HomeTab'
import TabScreen from './screens/components1/TabScreen'
import SKU from './screens/components1/SKU'
import Offers from './screens/components1/Offers'
import OrderItem from './screens/components1/OrderItem'
import Orderlist from './screens/components1/OrderList'
import Itemdetails from './screens/components1/Itemdetail'
import CreateOrder from './screens/components1/CreateOrder'
import AppInfo from './screens/components1/AppInfo'
import HistoryDetails from './screens/components1/HistoryDetails'
import SplashScreen from './SplashScreen'
import OrderSent from './screens/components1/OrderSent'
import AddProduct from './screens/components1/AddProduct'
import SyncScreen from './screens/components1/SyncScreen'
import AddItemToList from './screens/components1/AddItemToList'
import OrderGuide from './screens/components1/OrderGuide'
import LoginTest from './screens/components1/LoginTest'
import SignInScreen from './screens/components1/LoginTest1'
import MyDashboard from './screens/components1/MyDashboard'
import Inventory from './screens/components1/Inventory'
import DeliveryMain from './screens/components1/DeliveryMain'
import PastDelivery from './screens/components1/PastDelivery'
import pendingdelivery from './screens/components1/pendingdelivery'
import OrderInvoice from './screens/components1/OrderInvoice'
import ItemInvoice from './screens/components1/ItemInvoice'
import OrderDelivered from './screens/components1/OrderDelivered'

//IsRegistered Flag is used to know whether user has already logged in or not
//If registered --->Homescreen
//else display Login Screen 


import OrderListdetail from'./screens/components1/OrderListdetail'
import OrderGuidelist from './screens/components1/OrderGuidelist'

export default createAppContainer(createStackNavigator({
    
    TabScreen,//Home screen
    Inventory,
    customer, // Stores
    AddProduct,// Add Item to Inventory
    LoginScreen,//Login Screen
    SKU, //Product Catalog
    OrderItem, //Current Order screen
    Orderlist,//Previous Orders
    Itemdetails, //Item detail screen
    CreateOrder, // Order creating screen
    OrderListdetail,
    OrderDelivered,
    AppInfo,
    unsentscreen, // unsent,
    HomeTab,//Homescreen
    OrderSent,
    HistoryDetails,
    SplashScreen,
    ItemInvoice,
    SyncScreen,
    AddItemToList,
    OrderGuide,
    OrderGuidelist,
    Offers,
    MyDashboard,
    LoginTest,
    SignInScreen,
    DeliveryMain,
    PastDelivery,
    pendingdelivery,
    OrderInvoice
    //List All the viewcontrollers inside the navigation  controller
   
}, {
    //initial Screen setup
        initialRouteName:'SplashScreen',
        defaultNavigationOptions: {
            //Hide the header
            header: null 
        }
    }))
