import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {
  Config,
  get,
  Toast,
  ValueVerify,
  i18n,
  post
} from '../unit/AllUnit'

export default class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      code: i18n.login_getCode
    };
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  onPress = () => {
    if (this.interval) 
      return;
    const {regular, text} = this.props

    if (regular && !regular.test(text)) {
      Toast(i18n.login_phoneError)
      return
    }

    let code = 60
    this.setState({
      code: code + ' s'
    })

    this.interval = setInterval(() => {

      code--;
      if (code <= 0) {
        clearInterval(this.interval)
        this.interval = null
        this.setState({code: i18n.login_getCode})
      } else {
        this.setState({
          code: code + ' s'
        })
      }

    }, 1000);

    const region = this.props.region
    get(Config.url_getLoginCode, {
      mobile: text,
      region
    }).then(data => {
      console.warn(data);
      Toast(i18n.login_getCodeSuccess)
    })

  }

  render() {
    return (
      <TouchableOpacity onPress={this.onPress}>
        <Text style={styles.buttonText}>
          {this.state.code}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 14,
    padding: 6,
    textAlign: 'center',
    color: Config.appColor,
    // borderWidth: 1, borderColor: '#bbb', borderRadius: 6
  }
})
