import React, { Component } from 'react';

export default const focused = Child =>
    class AnonComponent extends Component {
      state = {
        focused: false,
      };

      componentWillMount() {
        const { navigation } = this.props;

        navigation.addListener('willFocus', payload => {
          console.log('WILL FOCUS');
        })
      }
      render() {
        console.log('RENDER')
        const { navigation } = this.props;

        if (navigation.isFocused()) {
          return <Child { ...this.props } />
        }

        return null;
      }
    }
