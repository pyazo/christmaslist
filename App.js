/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Camera from 'react-native-camera';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {
  constructor(props) {
    super(props);

    this.state = {
      data: ''
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
      	  onBarCodeRead={this.onBarCodeRead.bind(this)}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}>

        </Camera>
        <Text>Data: {this.state.data}</Text>
      </View>
    );
  }

  onBarCodeRead(e) {
    console.log(
        "Barcode Found!",
        "Type: " + e.type + "\nData: " + e.data
    );

    this.setState({ data: e.data });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  preview: {
    // flex: 1,
    height: 400,
    // width: 200,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});
