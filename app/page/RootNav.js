import React, {Component} from 'react';
import {
  StatusBar,
  AsyncStorage,
  NativeModules,
  DeviceEventEmitter,
  View,
  BackHandler,
  AppState,
  ToastAndroid,
  Animated,
  Easing,
  findNodeHandle,
  StyleSheet,
  // NetInfo
} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import SplashScreen from 'react-native-splash-screen'
import Pages from './Pages';
import {
  AppUpdate,
  Config,
  Toast,
  i18n,
  NavigationService,
  UserData
} from '../unit/AllUnit';
import Picker from 'react-native-picker';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import WalletAction from '../redux/actions/WalletAction';

function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}

class RootNav extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rootPage: '',
      showBlue: false, //是否模糊
    };

    this.lastBackPressTime = 0
    this.lastBackgroundTime = 0
  }

  initHome = (haveWallet) => {
    if (haveWallet) {
      this.setState({rootPage: 'WalletTab'});
    } else {
      this.setState({rootPage: 'CreateOrImport'});
    }
    SplashScreen.hide();
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    // AppUpdate();
    this
      .props
      .initWallet(this.initHome)
    return;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  // 安卓点击设备返回按钮
  handleBackPress = () => {
    const now = new Date().getTime()
    if (now - this.lastBackPressTime < 1000 * 60 * 2) 
      return false
    this.lastBackPressTime = now
    ToastAndroid.showWithGravity(i18n.toast_clickQuit, ToastAndroid.SHORT, ToastAndroid.CENTER);
    return true
  }

  render() {

    if (this.state.rootPage.length == 0) 
      return null;
    const MainNavigator = createStackNavigator(Pages, {
      defaultNavigationOptions: {
        header: null
      },
      cardStyle: {
        backgroundColor: '#fff'
      },
      initialRouteName: this.state.rootPage,
      transitionConfig: () => ({
        transitionSpec: {
          duration: 300,
          easing: Easing.out(Easing.poly(4)),
          timing: Animated.timing
        }
      })
    });
    const App = createAppContainer(MainNavigator);
    const prevGetStateForActionHomeStack = MainNavigator.router.getStateForAction;
    MainNavigator.router.getStateForAction = (action, state) => {
      if (state && action.type === 'DeleteRoute') {
        const {routeName} = action;
        const routes = state
          .routes
          .filter((item) => item.routeName != routeName);
        return {
          ...state,
          routes,
          index: routes.length - 1
        };
      }
      return prevGetStateForActionHomeStack(action, state);
    };

    return (
      <View style={{
        flex: 1
      }}>
        <StatusBar
          barStyle='dark-content'
          translucent={true}
          backgroundColor='rgba(0,0,0,0)'/>

        <App
          ref={appRef => NavigationService.setTopLevelNavigator(appRef)}
          onNavigationStateChange={(prevState, currentState) => {
          Picker.hide();/* const currentScene = getCurrentRouteName(currentState); const previousScene = getCurrentRouteName(prevState); if (previousScene !== currentScene) { UMAnalyticsModule.onPageEnd(previousScene); UMAnalyticsModule.onPageBegin(currentScene); } */
        }}></App>

      </View>
    )
  }

}

// export default RootNav
export default connect(state => ({}), dispatch => ({
  initWallet: bindActionCreators(WalletAction.initWallet, dispatch)
}))(RootNav)