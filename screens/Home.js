/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { View, Dimensions, AsyncStorage, ListView } from 'react-native';
import { Container, Header, Body, Button, Icon, Text, Title, Form, Item, Input, Label, List, ListItem, Right, ActionSheet, Spinner } from 'native-base';

export default class Home extends Component<{}> {

  state = {
    editing: false,
    text: '',
    people: {},
    loading: true,
  }

  save = async () => {
    const { text, people } = this.state;

    const mutPeople = Object.assign({}, people);

    try {
      await AsyncStorage.setItem(`@christmaslist:${text}`, JSON.stringify([]));

      mutPeople[text] = [];

      this.setState({ text: '', people: mutPeople });
    } catch (err) { console.error(err) }
  }

  openActionBar = async () => {
    try {

      await this.getPeople();

      const { navigation } = this.props;
      const { people } = this.state;

      const BUTTONS = ['Person', 'Item', 'Cancel'];

      ActionSheet.show(
        {
          options: BUTTONS,
          cancelButtonIndex: 2,
          title: 'What would you like to add?'
        },
        index => navigation.navigate(BUTTONS[index], { people })
      )

    } catch(err) {
      console.error(err);
    }
  }

  changeText = text => this.setState({ text });

  getPeople = async () => {
    const keysObj = {};
    try {
      const keys = await AsyncStorage.getAllKeys();

      const pairs = await AsyncStorage.multiGet(keys);

      pairs.forEach((arr) => {
        if (arr[0].split(':')[1].length > 0) keysObj[arr[0].split(':')[1]] = JSON.parse(arr[1]);
      });

      this.setState({ people: keysObj, loading: false });

    } catch (err) { console.error(err) }
  }

  ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

  deleteRow = async (secId, rowId, rowMap, data) => {
    rowMap[`${secId}${rowId}`].props.closeRow();
    const newData = {...this.state.people};
    delete newData[data]
    this.setState({ people: newData });

    try {
      await AsyncStorage.removeItem(`@christmaslist:${data}`);
    } catch (err) { console.error(err) }
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.getPeople();

    navigation.addListener('willFocus', payload => {
      this.setState({ loading: true });
      this.getPeople();
    })

  }

  render() {
    const { editing, text, people, loading } = this.state;
    const { width, height } = Dimensions.get('window');

    if (loading) {
      return (
        <View style={{ height, backgroundColor: '#fff' }}>
          <Spinner />
        </View>
      )
    }

    return (
      <View style={{ height, backgroundColor: '#fff' }}>
        {
          !Object.keys(people).length &&
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{ color: '#b2bec3' }}>
              No people here yet...
            </Text>
          </View>
        }

        {
          !!Object.keys(people).length &&
          <List
            dataSource={this.ds.cloneWithRows(Object.keys(people))}
            renderRow={data =>
              <ListItem style={{ backgroundColor: '#fff' }}>
                <Body>
                  <Text> {data} </Text>
                </Body>
                <Right>
                  <Text>{people[data].items.length}</Text>
                </Right>
              </ListItem>}
            renderLeftHiddenRow={data =>
              <Button full onPress={() => alert(JSON.stringify(people[data]))}>
                <Icon active name="information-circle" />
              </Button>}
            renderRightHiddenRow={(data, secId, rowId, rowMap) =>
              <Button full danger onPress={() => this.deleteRow(secId, rowId, rowMap, data)}>
                <Icon active name="trash" />
              </Button>}
            leftOpenValue={75}
            rightOpenValue={-75}
            style={{
              backgroundColor: '#fff'
            }}
          />
        }
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <Button iconLeft onPress={this.openActionBar} style={{ width: 55, height: 55 }} info>
            <Icon name='add' style={{ fontSize: 45 }} />
          </Button>
        </View>
      </View>
    );
  }
}
