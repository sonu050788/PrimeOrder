import React, { Component } from 'react';
import {  Alert, Platform } from 'react-native';
class  WebService extends Component {
    static helloworld(){
      Alert.alert('Hi Hello')
    }
    static getItemListCall() {
        var that = this;
        this.makeRemoteRequest();
         fetch("http://www.example.com/test?search=nraboy", { method: "GET" })
        // here we are quering po_user.username using post method ........
        fetch("http://ec2-13-59-29-50.us-east-2.compute.amazonaws.com/get_data_s.php", { 
          method: "POST",
          body: JSON.stringify({
            "__module_code__": "PO_06",
            "__query__":"",
              "__orderby__":"" ,
              "__offset__":0,
              "__select _fields__": ["productid"],
              "__max_result__":1,
              "__delete__":0,
          })
         }).then(function (response) {
          return response.json();
        }).then(function (result) {
          console.log("this is for getting resonse from querying username and getting response")
          console.log(result);
          console.log(result.entry_list)
          console.log(":::::::::::Item Array:::::::::::::::::::::")
          let tempArray=[]
          for(var i=0;i< result.entry_list.length;i++){
            console.log("++++++++ItemArray++++++++++",result.entry_list.length)
            tempArray.push({'itemid':result.entry_list[i].name_value_list.productid.value,
            'description':result.entry_list[i].name_value_list.productdescription.value,
            'price':result.entry_list[i].name_value_list.baseprice.value,
            'qty':0
          })}
          commonData.setItemArray(tempArray)
        console.log("++++++++ItemArray++++++++++",tempArray)
        }).catch(function (error) {
          console.log("-------- error ------- " + error);
        });
  }
     
   
  }
 export {WebService}