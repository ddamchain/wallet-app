import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Image,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import {NavBar, Button, TopPadding} from '../../../widget/AllWidget'
import {Config, NavigationService, i18n} from '../../../unit/AllUnit';

export default class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  onCreatePress = () => {
    NavigationService.navigate('CreateWallet')
  }
  onImportPress = () => {
    NavigationService.navigate('ImportWallet', {isFirst: true})
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.img}
          source={require('../../../img/ddam/img_bangdingqianbao.png')}/>
        <Text style={styles.text}>{i18n.wallet_add_noInfo}</Text>
        <Button style={styles.left} onPress={this.onCreatePress}>{i18n.wallet_add_create}</Button>
        <Button style={styles.button} onPress={this.onImportPress}>{i18n.wallet_add_import}</Button>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: '#fff'
  },
  img: {
    width: Config.width,
    height: Config.width * 470 / 375,
    resizeMode: 'contain'
  },
  text: {
    fontSize: 14,
    color: Config.appColor,
    marginTop: -45
  },
  left: {
    width: Config.width - 30,
    margin: 20,
    alignSelf: 'center',
    marginTop: 83
  },
  button: {
    width: Config.width - 30,
    backgroundColor: '#fff',
    borderRadius: 4,
    color: Config.appColor,
    borderWidth: 0,
    alignSelf: 'center',
    marginBottom: 80,
    marginTop: 0
  }
});