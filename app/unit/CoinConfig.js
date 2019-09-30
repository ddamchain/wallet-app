export default CoinConfig = {
  MXM: {
    precision: 4,
    minBalance: 100,
    confirmBlock: 12,
    logo: require('../img/money/coin_mxm.png')
  },
  BTC: {
    precision: 6,
    minBalance: 0.0001,
    confirmBlock: 2,
    logo: require('../img/money/coin_btc.png'),
    withdrawMin: 0.002,
    withdrawMax: 30,
    withdrawFee: 0.0005
  },
  ETH: {
    precision: 4,
    minBalance: 0.01,
    confirmBlock: 12,
    logo: require('../img/money/coin_eth.png'),
    withdrawMin: 0.01,
    withdrawMax: 850,
    withdrawFee: 0.005
  }
}
