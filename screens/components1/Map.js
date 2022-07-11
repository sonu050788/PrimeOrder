import React from "react";
import { View, Text,Alert ,PermissionsAndroid} from "react-native";
import MapView,{ Polyline,PROVIDER_GOOGLE , Marker} from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import {mapStyle} from "../components1/mapStyle"
import CommonDataManager from './CommonDataManager';
let commonData = CommonDataManager.getInstance();
export default class Map extends React.Component {
  constructor(props) {
    super(props);
     this.state = {
        latitude: 0,
        longitude: 0,
        coordinates: [],
     };
   }
   componentDidMount(){
    async function requestLocationPermission() {
      try {
        const granted = await PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          'title': 'Ordo App Permission',
          'message': 'Ordo App needs access to your Location '
        }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            (position) => {
              console.log(position);
              Alert.alert(position);
            },
            (error) => {
              // See error code charts below.
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
          
          
        } else {

          Alert.alert("Location permission denied");

        }
       } catch (err) {
        alert("Location permission err", err);
        console.warn(err);
      }
     
    }
    requestLocationPermission();
     
   }
   sendLocationtoServer=()=>{
      var location="{"+this.state.latitude+","+this.state.longitude+"}";
      var uid=commonData.getuid();
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var raw = JSON.stringify({"__module_code__":"PO_12","__query__":"","__name_value_list__":{"location":""+location+"","id":""+uid+""}});
    
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      
      fetch("http://143.110.178.47/primeorder/set_data_s.php", requestOptions)
        .then(response => response.text())
        .then(result => {console.log(result);Alert.alert("saved location")})
        .catch(error => console.log('error', error));
      
   }
   componentDidMount(){
    Geolocation.watchPosition(
      position => {
        console.log(position.coords.latitude,"position.coords.latitude");

        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          coordinates: this.state.coordinates.concat({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        });
       
      },
      error => {
        console.log(error);
      },
      {
        showLocationDialog: true,
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
        distanceFilter: 0
      }
    );
   } 
  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          customMapStyle={mapStyle}
          provider={PROVIDER_GOOGLE}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Marker
              coordinate={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
              }}>
          </Marker>
          <Polyline
      coordinates={this.state.coordinates}
      strokeColor="#bf8221"
      strokeColors={[ '#bf8221', '#ffe066', '#ffe066', '#ffe066', '#ffe066', ]}
      strokeWidth={3}
    /></MapView>
      </View>
    );
  }
}