/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import { Container, Header, Body, Title, Content, Footer, Root } from "native-base";
import { StackNavigator } from "react-navigation";

import Home from './screens/Home';
import Person from './screens/Person';
import Item from './screens/Item';

const AppNavigator = StackNavigator(
  {
    Home: { screen: Home },
    Person: { screen: Person },
    Item: { screen: Item }
  },
  {
    headerMode: 'none',
  }
);

export default class App extends Component<{}> {
  render() {
    return (
      <Root>
        <Container>
          <Header
            style={{ backgroundColor: '#00b894' }}
            iosBarStyle='light-content'
            >
            <Body>
              <Title style={{ color: 'white' }}>Christmas List</Title>
            </Body>
          </Header>
          <Content style={{ backgroundColor: 'white' }}>
            <AppNavigator />
          </Content>
        </Container>
      </Root>
    );
  }
}
