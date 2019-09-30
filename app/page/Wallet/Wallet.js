import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Image,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  FlatList
} from 'react-native';
import {NavBar, TopPadding, ScrollTab, EmptyComponent, Shadow} from '../../widget/AllWidget'
import {
  Config,
  ConstValue,
  i18n,
  post,
  ShowText,
  NavigationService,
  Toast,
  ValueVerify,
  TxManager
} from '../../unit/AllUnit';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import WalletAction from '../../redux/actions/WalletAction';
import WalletTxCell from './view/WalletTxCell'
import {NavigationEvents} from 'react-navigation';
import CheckView from './view/CheckView';

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isHiddenAllpages: true, //  可用余额卡片开关
      balanceData: {},
      IsHiddenBalance: false,
      refreshing: true,
      PoptipShow: false,
      data: [
        [], [], []
      ],
      showCheckView: false
    };
    this.tabIndex = 0;
    this.pageList = [1, 1, 1];
    this.pageSize = 10;

    this.loadMoreList = [false, false, false];
  }

  onGetQrcode = qrcode => {
    const data = ShowText.dataFromQrcode(qrcode);
    setTimeout(() => {
      if (data.url) {
        NavigationService.navigate('AddContract', {data})
      } else if (ValueVerify.isAddress(data.address)) {
        NavigationService.navigate('WalletTransfer', {data})
      } else {
        Toast(i18n.wallet_qrcodeErr)
      }
    }, 300);
  }
  onQrcodePress = () => {
    NavigationService.toQrcode(this.onGetQrcode);
  }
  hadelClickMore = () => this.setState({
    PoptipShow: !this.state.PoptipShow
  })

  onDidFocus = () => {
    this.setState({data: [
        [], [], []
      ]})
    this.onRefresh(this.tabIndex);

  }

  haderlClickAllpages = () => {
    this.setState({
      isHiddenAllpages: !this.state.isHiddenAllpages
    })
  }

  handleIsHidden = () => this.setState({
    IsHiddenBalance: !this.state.IsHiddenBalance
  })
  onCheckViewPress = () => this.setState({
    showCheckView: !this.state.showCheckView
  })

  onFlatListScroll = () => {
    if (!this.state.isHiddenAllpages) {
      this.setState({isHiddenAllpages: true})
    }
  }

  onRefresh = tabIndex => {
    this.pageList[tabIndex] = 1;
    this.setState({refreshing: true})
    this.getData(tabIndex)
  }
  onEndReached = tabIndex => {
    if (!this.loadMoreList[tabIndex]) 
      return
    this.pageList[tabIndex] += 1
    this.getData(tabIndex)
  }

  getData = (tabIndex) => {
    this
      .props
      .updateSelectedBalance();

    const {address} = WalletAction.selectedAccount();
    let pageNum = this.pageList[tabIndex];
    const type = parseInt(tabIndex) + 1

    const body = {
      pageNum: pageNum,
      pageSize: 10
    }
    if (tabIndex == 0 || tabIndex == 1) {
      body.target = address;
    }
    if (tabIndex == 0 || tabIndex == 2) {
      body.source = address;
    }

    post(Config.API_HOST + '/api/transaction/list', body, 'POST').then(data => {

      let trans = data.content;
      let stateData = this.state.data;
      this.loadMoreList[tabIndex] = trans.length >= this.pageSize

      if (pageNum > 1) {
        stateData[tabIndex] = stateData[tabIndex].concat(trans)
      } else {
        const paddingTx = TxManager.getPaddingTx(trans, body, address, () => {
          this.onRefresh(tabIndex)
        });
        if (paddingTx) {
          trans = [paddingTx].concat(trans)
        }
        stateData[tabIndex] = trans;
      }

      this.setState({refreshing: false, data: stateData})
      return;
    }).catch(err => {
      console.log(err)
      this.setState({refreshing: false})
    })
  }

  allListComponent() {
    // i18n.send_All,
    const titles = ['全部', i18n.friend_in, i18n.friend_out];
    let {address} = WalletAction.selectedAccount();
    return (
      <ScrollTab
        titles={titles}
        onTabChanged={index => {
        this.tabIndex = index;
        if (!this.state.data[index].length) {
          this.onRefresh(index)
        }
      }}>
        {titles.map((_itemTitle, tabIndex) => {
          return <FlatList
            onMoveShouldSetResponder={this.onFlatListScroll}
            key={tabIndex}
            refreshing={this.state.refreshing}
            showsVerticalScrollIndicator={false}
            style={styles.FlatListBox}
            onRefresh={() => this.onRefresh(tabIndex)}
            onEndReached={() => this.onEndReached(tabIndex)}
            keyExtractor={(item, k) => k + 'wallet1'}
            data={this.state.data[tabIndex]}
            renderItem={({item, index}) => <WalletTxCell item={item} userAdderss={address}/>}
            ListFooterComponent={< EmptyComponent img = 'no_list' hide = {
            this.state.data[tabIndex].length > 0 || this.state.refreshing
          } />}/>
        })}
      </ScrollTab>
    )
  }

  render() {
    const {name, address} = WalletAction.selectedAccount();
    const {
      availableBalance,
      lendStake,
      localStake,
      refundStake,
      usdtBalance,
      ddamBalance
    } = this.state.balanceData

    let allBalance = ShowText.toFix(WalletAction.selectedAccount().value, 4, true)
    if (!allBalance || allBalance.length < 6) {
      allBalance = '0.0000'
    }

    return (
      <View style={styles.container}>
        <NavBar title='我的钱包'></NavBar>
        <NavigationEvents onDidFocus={this.onDidFocus}></NavigationEvents>

        <ImageBackground
          style={styles.topAsset}
          resizeMethod="resize"
          source={require('../../img/ddam/img_yueBg.png')}>
          <View style={styles.row}>
            <Text style={styles.allAssetT}>{i18n.recharge_balance}</Text>
            <TouchableOpacity onPress={this.handleIsHidden} style={styles.eye}>
              <Image
                source={this.state.IsHiddenBalance
                ? require('../../img/ddam/icon_home_biyan.png')
                : require('../../img/ddam/icon_home_zhengyan.png')}></Image>
            </TouchableOpacity>
          </View>
          <View style={styles.assetRow}>

            <Text style={styles.textValue}>
              {!this.state.IsHiddenBalance
                ? allBalance.slice(0, -5)
                : '*****'}
              {!this.state.IsHiddenBalance && <Text style={styles.decimalValue}>
                {allBalance.slice(allBalance.length - 5)}
                &nbsp;DDAM
              </Text>}
            </Text>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => NavigationService.navigate('WalletReceive')}>
              <Image source={require('../../img/ddam/icon_shoukuan.png')}></Image>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={this.onQrcodePress}>
              <Image source={require('../../img/ddam/icon_shaoma.png')}></Image>
            </TouchableOpacity>
          </View>

        </ImageBackground>

        {this.allListComponent()}
        {this.state.showCheckView && <CheckView {...this.checkProps} onHide={this.onCheckViewPress}/>}
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  topAsset: {
    backgroundColor: Config.appColor,
    height: 139,
    margin: 15,
    borderRadius: 5,
    overflow: 'hidden'
  },
  allAssetT: {
    fontSize: 12,
    color: '#fff',
    padding: 20,
    paddingBottom: 15
  },
  eye: {
    margin: 15,
    marginRight: 22
  },
  assetRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textValue: {
    fontSize: 25,
    fontWeight: '500',
    color: "#fff",
    paddingLeft: 13
  },
  decimalValue: {
    fontSize: 18,
    color: '#fff'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: 60
  },
  button: {
    padding: 20
  },
  FlatListBox: {
    width: Config.width,
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 100
  }
});
export default connect(state => ({wallet: state.wallet}), dispatch => ({
  createWallet: bindActionCreators(WalletAction.createWallet, dispatch),
  updateSelectedBalance: bindActionCreators(WalletAction.updateSelectedBalance, dispatch),
  updateNonce: bindActionCreators(WalletAction.updateNonce, dispatch),
  noncePlus: bindActionCreators(WalletAction.noncePlus, dispatch)
}))(Page);
