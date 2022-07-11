import React, { Component } from 'react';
import { Platform, Text, View } from 'react-native';
import Routes from './Routes'


//Code to disable the yellow warning box throughout the program
console.disableYellowBox = true;
export let Badgecount = 0;

export default class App extends Component {
  render() {
    return (
      <Routes/>
    );
   
  }
}