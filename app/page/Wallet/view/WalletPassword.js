import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  TouchableWithoutFeedback
} from 'react-native';
import {Config, i18n} from '../../../unit/AllUnit'
import {Button, InputWithAnimate} from '../../../widget/AllWidget'

export default class Page extends Component {

  state = {}

  onHide = () => {
    this
      .props
      .onHide()
  }

  onChangeText = text => {
    this.text = text
  }

  onGetText = () => {
    const {props, text} = this
    props.onHide(text)
  }

  render() {
    const {
      onHide,
      title = i18n.wallet_manager_password,
      placeholder = i18n.wallet_manager_password,
      secureTextEntry = true
    } = this.props;

    return <View style={styles.container}>
      <TouchableOpacity style={styles.flex1} onPress={this.onHide}>
        <View/>
      </TouchableOpacity>

      <View style={styles.bg}>

        <View style={styles.titleV}>
          <View style={styles.img}/>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={this.onHide} style={styles.img}>
            <Image source={require('../../../img/ddam/icon_allpages_close.png')}/>
          </TouchableOpacity>
        </View>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={secureTextEntry}
          style={styles.input}
          underlineColorAndroid='transparent'
          placeholder={placeholder}
          autoFocus={true}
          onChangeText={this.onChangeText}/>

        <View style={styles.buttonV}>
          <TouchableOpacity style={styles.button} onPress={this.onHide}>
            <Text style={styles.cancelText}>{i18n.my_cancel}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={this.onGetText}>
            <Text style={styles.buttonText}>{i18n.my_continue}</Text>
          </TouchableOpacity>

        </View>

      </View>

      <TouchableOpacity style={styles.flex1} onPress={this.onHide}>
        <View/>
      </TouchableOpacity>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  flex1: {
    flex: 1
  },
  bg: {
    width: Config.width - 30,
    height: 230,
    marginLeft: 15,
    backgroundColor: '#fff',
    borderRadius: 6
  },
  titleV: {
    height: 44,
    width: Config.width - 30,
    backgroundColor: Config.appColor,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  img: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: "#fff",
    fontSize: 15
  },
  input: {
    marginTop: 51,
    marginBottom: 25,
    marginLeft: 20,
    width: Config.width - 70,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2E2E2',
    paddingLeft: 10
  },

  buttonV: {
    marginTop: 15,
    marginRight: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  button: {
    backgroundColor: '#fff',
    margin: 15
  },
  buttonText: {
    color: Config.appColor,
    fontSize: 17
  },
  cancelText: {
    color: '#666',
    fontSize: 17
  }
})