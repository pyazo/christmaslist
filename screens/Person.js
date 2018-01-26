/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { View, Dimensions, AsyncStorage } from 'react-native';
import { Text, Form, Item, Input, Label, Title, Button } from 'native-base';

export default class Person extends Component<{}> {

  state = {
    name: '',
    shirtSize: '',
    pantsSize: '',
    shoeSize: ''
  }

  backToHome = () => {
    const { navigation } = this.props;

    navigation.navigate('Home');
  }

  savePerson = async () => {
    const { name, shirtSize, pantsSize, shoeSize } = this.state;
    const { navigation } = this.props;

    try {
      await AsyncStorage.setItem(`@christmaslist:${name}`, JSON.stringify({ shirtSize, pantsSize, shoeSize, items: [] }));
      navigation.navigate('Home');
    } catch (err) { console.error(err) }
  }

  handleChange = field => value => {
    this.setState({ [field]: value });
  }

  render() {
    const { name, shirtSize, pantsSize, shoeSize } = this.state;

    const { width } = Dimensions.get('window');

    const inputStyle = {
      height: 50,
      width: width - 20,
      marginBottom: 10,
      marginLeft: 10
    }

    return (
      <View style={{ flex: 1, paddingTop: 20, justifyContent: 'space-between', alignItems: 'stretch'}}>
        <View style={{ marginBottom: 55}}>
          <Title>Add a Person</Title>
        </View>
        <Item regular style={inputStyle}>
          <Input onChangeText={this.handleChange('name')} value={name} placeholder='Name' />
        </Item>
        <Item regular style={inputStyle}>
          <Input onChangeText={this.handleChange('shirtSize')} value={shirtSize} placeholder='Shirt Size' />
        </Item>
        <Item regular style={inputStyle}>
          <Input onChangeText={this.handleChange('pantsSize')} value={pantsSize} placeholder='Pants Size' />
        </Item>
        <Item regular style={inputStyle}>
          <Input onChangeText={this.handleChange('shoeSize')} value={shoeSize} placeholder='Shoe Size' />
        </Item>
        <View>
          <Button success full style={{ marginBottom: 10, marginTop: 20 }} onPress={this.savePerson}>
            <Text>Save</Text>
          </Button>

          <Button danger full onPress={this.backToHome}>
            <Text>Cancel</Text>
          </Button>
        </View>
      </View>
    );
  }
}
