import React, {Component} from 'react';
import getIssues from '../axios/getIssues';

import LoginContainer from './LoginContainer';
import ContentContainer from './ContentContainer';
import SettingsContainer from './SettingsContainer';

import {Container, Content, Tabs} from 'native-base';

import Spinner from 'react-native-loading-spinner-overlay';
import {View, AsyncStorage} from 'react-native';

import myTheme from '../../Themes/myTheme';

import getStorage from '../storage/getStorage';

export default class MainContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLogged: false,
      data: [],
      login: '',
      password: '',
      jiraLink: '',
      errorText: '',
      progress: false,
      visible: false,
      firstUseApp: true
    };

    this.handleLoginInput = this.handleLoginInput.bind(this);
    this.handlePasswordInput = this.handlePasswordInput.bind(this);
    this.handleJiraLinkInput = this.handleJiraLinkInput.bind(this);
    this.handleLoginButton = this.handleLoginButton.bind(this);

    getStorage().load({
      key: 'firstUseApp'
    })
    .then(() => this.setState({ firstUse: false }))
    .catch(() => getStorage().save({ key: 'firstUseApp' }));
  }

  componentDidMount() {
    this.loadInitialState().done();
  }

  loadInitialState = async () => {
    try {
      let jiraLink = await AsyncStorage.getItem('jiraLink');
      let login = await AsyncStorage.getItem('login');
      let password = await AsyncStorage.getItem('pass');
      if (jiraLink !== null || login !== null || password !== null) {
        this.setState({jiraLink});
        this.setState({password});
        this.setState({login});
      }
    } catch (error) {
      console.log(error);
    }
  }

  handleLoginInput = async (e) => {
    this.setState({
      login: e
    });
    try {
      await AsyncStorage.setItem('login', e);
    } catch (error) {
      console.log(error);
    }
  }

  handlePasswordInput = async (e) => {
    this.setState({
      password: e
    });
    try {
      await AsyncStorage.setItem('pass', e);
    } catch (error) {
      console.log(error);
    }
  }

  handleJiraLinkInput = async (e) => {
    this.setState({
      jiraLink: e
    });
    try {
      await AsyncStorage.setItem('jiraLink', e);
    } catch (error) {
      console.log(error);
    }
  }

  handleLoginButton() {
    this.setState({
      progress: true,
      visible: true
    });

    getIssues(this.state.login, this.state.password, this.state.jiraLink, this);
  }

  render() {
    if (this.state.progress) {
      return (
        <View style={{flex: 1}}>
          <Spinner visible={this.state.visible}/>
        </View>
      );
    } else if ((!this.state.progress) && (!this.state.isLogged)) {
      return (
        <Container>
          <Content>
            <LoginContainer
              handleLoginButton={this.handleLoginButton}
              handleLoginInput={this.handleLoginInput}
              handlePasswordInput={this.handlePasswordInput}
              handleJiraLinkInput={this.handleJiraLinkInput}
              jiraLink={this.state.jiraLink}
              login={this.state.login}
              password={this.state.password}
              errorInfo={this.state.errorText}
            />
          </Content>
        </Container>
      );
    } else if ((!this.state.progress) && (this.state.isLogged)) {
      return (
        <Container>
          <Content>
            <Tabs theme={myTheme}>
              <ContentContainer
                tabLabel='Tasks'
                issues={this.state.data}
                username={this.state.login}
                password={this.state.password}
                jiraLink={this.state.jiraLink}
              />
              <SettingsContainer
                tabLabel='Settings'
              />
            </Tabs>
          </Content>
        </Container>
      );
    }
  }
}
