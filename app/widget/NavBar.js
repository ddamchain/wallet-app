import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  NativeModules,
  ImageBackground,
  Image,
  View,
  TouchableOpacity,
  Platform,
  StatusBar
} from 'react-native';
import {withNavigation} from 'react-navigation';
import {Config} from '../unit/AllUnit'

const imgs = {
  back: require('../img/navbar/back.png'),
  qrcode: require('../img/navbar/qrcode.png'),
  black: require('../img/navbar/black.png'),
  qrcode: require('../img/navbar/white_qrcode.png'),
  share: require('../img/navbar/icon_share.png'),
  white_back: require('../img/navbar/white_back.png'),
  white_qrcode: require('../img/navbar/white_qrcode.png'),
  add: require('../img/navbar/add.png'),
  icon_record_zhiya: require('../img/navbar/icon_record_zhiya.png')
}

class NavBar extends Component {

  isTab = () => {
    const parent = this
      .props
      .navigation
      .dangerouslyGetParent()
    const isTab = parent && parent.state && (parent.state.routeName === 'Tab' || parent.state.routeName === 'WalletTab');
    return isTab;
  }

  getLeft = left => {
    if (!this.isTab()) {
      left = left || {
        title: 'back'
      }
      left.onPress = left.onPress || this.props.navigation.goBack
    }
    return left
  }

  getRight = (right = []) => {
    return right
  }

  renderBtnContent = title => {
    const {
      color = '#333'
    } = this.props
    if (imgs[title]) {
      return <Image style={styles.navImg} source={imgs[title]}/>
    }
    return <Text style={[styles.text, {
        color
      }]}>{title}</Text>
  }

  renderBtn = item => {
    if (!item) {
      return null
    }
    return <TouchableOpacity key={item.title} onPress={() => item.onPress()}>
      {this.renderBtnContent(item.title)}
    </TouchableOpacity>
  }

  render() {
    let {
      title,
      left,
      right,
      color = '#333',
      backgroundColor = '#fff',
      hideLine = true
    } = this.props
    if (!title) 
      return null;
    
    left = this.getLeft(left)
    right = this.getRight(right)

    return (
      <View style={[styles.container, {
          backgroundColor
        }]}>

        <View style={styles.view}>
          <View>
            {this.renderBtn(left)}
          </View>

          <View>
            {right.map(item => {
              return this.renderBtn(item)
            })}
          </View>
        </View>
        {!hideLine && <View style={styles.line}/>}

        <Text style={[styles.title, {
            color
          }]}>{title}</Text>
      </View>
    )
  }

}

export default withNavigation(NavBar)

const styles = StyleSheet.create({
  container: {
    height: Config.statusBarHeight + 44,
    width: Config.width,
    backgroundColor: Config.appColor,
    zIndex: 10
  },
  bg: {
    flex: 1,
    resizeMode: 'stretch'
  },
  view: {
    marginTop: Config.statusBarHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 43,
    paddingLeft: 15,
    paddingRight: 15
  },

  navImg: {
    width: 30,
    height: 30,
    resizeMode: 'center'
  },

  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    position: 'absolute',
    top: Config.statusBarHeight + 13,
    left: 100,
    right: 100,
    bottom: 0
  },

  text: {
    color: '#fff',
    fontSize: 14,
    paddingTop: 10,
    paddingBottom: 10
  },
  line: {
    height: 1,
    backgroundColor: Config.bgColor
  }

});