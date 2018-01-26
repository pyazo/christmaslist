import React, { Component } from 'react';
import { View, Dimensions, AsyncStorage, Alert } from 'react-native';
import { Button, Text, ActionSheet } from 'native-base';
import Camera from 'react-native-camera';

export default class Item extends Component<{}> {
  state = {
    names: [],
    people: {},
    processing: false,
  }
  onBarCodeRead = e => {
    const { processing, names, people } = this.state;
    if (!processing) {
      this.setState({ processing: true });

      const exists = this.checkCurrentList(e.data);

      if (!exists) {
        ActionSheet.show(
          {
            options: names,
            cancelButtonIndex: names.length - 1,
            title: 'Who does this belong to?'
          },
          async (index) => {
            const name = names[index];

            if (name === 'Cancel') {
              setTimeout(() => this.setState({ processing: false }), 1000)

              return;
            };

            const person = { ...people[name] };

            person.items.push(e.data);

            try {
              await AsyncStorage.setItem(`@christmaslist:${name}`, JSON.stringify(person));

            } catch (err) { console.error(err) }

            setTimeout(() => this.setState({ processing: false }), 1000)
          }
        )
      }
    }
  }

  checkCurrentList = data => {
    const { names, people } = this.state;

    let exists = false;
    let belongsTo;

    names.forEach(name => {
      if (people[name]) {
        if (people[name].items.includes(data)) {
          exists = true;
          belongsTo = name;
        }
      }
    });

    if (exists) {
      Alert.alert(
        'Item Found',
        `This item belongs to ${belongsTo}`,
        [
          { text: 'Cancel', onPress: () => { setTimeout(() => this.setState({ processing: false }), 1000) }, style: 'cancel' },
          { text: 'Ok', onPress: () => { setTimeout(() => this.setState({ processing: false }), 1000) } }
        ]
      );
    }

    return exists;
  }

  backToHome = () => {
    const { navigation } = this.props;

    navigation.navigate('Home');

  }

  componentDidMount() {
    const { people } = this.props.navigation.state.params;

    this.setState({ names: [...Object.keys(people), 'Cancel'] });
    this.setState({ people })
  }

  render() {
    const { height } = Dimensions.get('window');

    return (
      <View>
        <Camera
            ref={(cam) => {
              this.camera = cam;
            }}
            onBarCodeRead={this.onBarCodeRead}
            defaultOnFocusComponent
            onFocusChanged={() => {}}
            style={{
              height: height - 150,
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}
            aspect={Camera.constants.Aspect.fill}>
        </Camera>
        <Button full style={{ height: 65 }} onPress={this.backToHome}>
          <Text>Back</Text>
        </Button>
      </View>
    );
  }
}
