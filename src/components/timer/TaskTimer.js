import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Text} from 'native-base';
import secondsToTime from '../../helpers/secondsToTime';

import strings from '../../language/strings';
import getStorage from '../../storage/getStorage';

export default class TaskTimer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      seconds: 0,
      timerId: null,
      isTicking: false,
      startDisabled: false,
      stopDisabled: true
    };
  }

  componentDidMount() {
    const d = new Date();
    const timeStamp = d.getTime();
    getStorage()
      .getBatchData([
          { key: 'intervalStart' },
          { key: 'intervalStop' }
      ])
      .then(data => {
        if (data[0].start === 0) {
          this.setState({
            seconds: 0
          });
        } else if (data[1].stop) {
          this.setState({
            seconds: Math.round((data[1].stop - data[0].start) / 1000)
          });
        } else {
          this.setState({
            startDisabled: true,
            stopDisabled: false,
            seconds: Math.round((timeStamp - data[0].start) / 1000)
          });
        }
        if (data[0].isTicking) {
          clearInterval(this.state.interval);
          const interval = setInterval(this.tick, 1000);
          this.setState({
            interval,
            isTicking: true
          });
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  timerStart() {
    const d = new Date();
    const timeStamp = d.getTime();
    const interval = setInterval(this.tick, 1000);
    getStorage()
      .save({
        key: 'intervalStart',
        rawData: {
          start: timeStamp - this.state.seconds * 1000,
          isTicking: true
        }
      });
    this.setState({
      interval,
      startDisabled: true,
      stopDisabled: false
    });
    getStorage()
      .save({
        key: 'intervalStop',
        rawData: {
          stop: 0
        }
      });
  }

  timerStop() {
    const d = new Date();
    const timeStamp = d.getTime();
    getStorage()
      .save({
        key: 'intervalStart',
        rawData: {
          start: timeStamp - this.state.seconds * 1000,
          isTicking: false
        }
      });
    getStorage()
      .save({
        key: 'intervalStop',
        rawData: {
          stop: timeStamp
        }
      });
    this.setState({
      startDisabled: false,
      stopDisabled: true
    });
    clearInterval(this.state.interval);
  }

  timerReset() {
    this.timerStop();
    this.setState({
      seconds: 0,
      startDisabled: false,
      stopDisabled: true
    });
    getStorage()
      .save({
        key: 'intervalStart',
        rawData: {
          start: 0,
          isTicking: false
        }
      });
  }

  tick = () => {
    this.setState({
      seconds: this.state.seconds + 1
    });
  }

  render() {
    return (
      <View style={{paddingTop: 20, paddingBottom: 20}}>
        <View style={styles.container}>
          <Button disabled={this.state.startDisabled} onPress={() => { this.timerStart(); }} ><Text>{strings.start}</Text></Button>
          <Button disabled={this.state.stopDisabled} onPress={() => { this.timerStop(); }}><Text>{strings.stop}</Text></Button>
          <Button onPress={() => { this.timerReset(); }}><Text>{strings.reset}</Text></Button>
        </View>
      <View style={{ flex: 1, alignSelf: 'stretch', minWidth: 340, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{secondsToTime(this.state.seconds)}</Text>
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 20
  }
});
