import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import {NavBar, TopPadding, Button} from '../../../widget/AllWidget'
import {Config, post, NavigationService, ShowText, i18n} from '../../../unit/AllUnit';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import WalletAction from '../../../redux/actions/WalletAction';

const bg_img_list = [require('../../../img/ddam/img_walletbg1.png'), require('../../../img/ddam/img_walletbg2.png'), require('../../../img/ddam/img_walletbg3.png'), require('../../../img/ddam/img_walletbg4.png')];

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this
      .props
      .updateAllBalance()
  }

  onCreateAccount = () => {
    const {mnemonic, usedIndex} = this.props.wallet;
    const name = 'Account ' + usedIndex
    this
      .props
      .createAccount({mnemonic, index: usedIndex, name});
  }

  onImportAccount = () => {
    NavigationService.navigate('ImportWallet')
  }

  onItemPress = k => {
    const {selectedIndex} = this.props.wallet;
    if (k == selectedIndex) {
      return;
    }
    this
      .props
      .updateWallet({
        data: {
          selectedIndex: k
        }
      });
    NavigationService.pop();
  }

  renderItem = (item, k) => {
    const {selectedIndex} = this.props.wallet;
    const {name, isImport, value} = item;
    const source = bg_img_list[k % bg_img_list.length]

    return <TouchableOpacity key={k} onPress={() => this.onItemPress(k)}>

      <ImageBackground source={source} style={styles.cell}>
        <View style={styles.leftV}>
          <View>
            <Text style={styles.ddam}>{ShowText.toFix(value, 6, true) + ' DDAM'}</Text>
            <Text style={styles.name}>{name}</Text>
          </View>
        </View>

        <View style={styles.right}>
          <View style={styles.importedV}>
            {isImport && <Text style={styles.imported}>{i18n.wallet_account_imported}</Text>}
          </View>
          {selectedIndex == k && <Image
            source={require('../../../img/ddam/icon_wallet_choose.png')}
            style={styles.importImg}/>}
        </View>

      </ImageBackground>

    </TouchableOpacity>
  }

  render() {
    const {accounts} = this.props.wallet;

    return (
      <View style={styles.container}>
        <NavBar
          title={i18n.wallet_account}
          right={[{
            title: 'add',
            onPress: this.onCreateAccount
          }
        ]}/>
        <TopPadding></TopPadding>
        <ScrollView showsVerticalScrollIndicator={false}>
          {accounts.map(this.renderItem)}

          <Button onPress={this.onImportAccount} style={styles.button}>导入账户</Button>
        </ScrollView>

      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Config.width - 30,
    height: 85,
    borderRadius: 4,
    marginTop: 10,
    alignSelf: "center"
  },
  logo: {
    margin: 10
  },
  name: {
    fontSize: 14,
    color: '#fff',
    marginTop: 8
  },
  importedV: {},
  imported: {
    color: '#fff',
    fontSize: 12
  },
  leftV: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  ddam: {
    fontSize: 16,
    color: '#fff'
  },
  right: {
    paddingTop: 10,
    paddingBottom: 19,
    paddingRight: 20,
    justifyContent: 'space-between',
    height: 85,
    flex: 1,
    alignItems: 'flex-end'
  },
  button: {
    marginTop: 99,
    marginBottom: 40
  },
  importImg: {
    alignSelf: 'flex-end'
  }
});

export default connect(state => ({wallet: state.wallet}), dispatch => ({
  createAccount: bindActionCreators(WalletAction.createAccount, dispatch),
  updateWallet: bindActionCreators(WalletAction.updateWallet, dispatch),
  updateAllBalance: bindActionCreators(WalletAction.updateAllBalance, dispatch)
}))(Page)
