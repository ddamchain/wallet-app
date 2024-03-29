export const KYC_STATUS_NONE = 9; //未实名
export const KYC_STATUS_WAIT = 3; //认证中
export const KYC_STATUS_DOING = 0; //认证中
export const KYC_STATUS_SUCCESS = 1; //已实名
export const KYC_STATUS_FAIL = 2; //实名失败

export const KYC_TYPE_IDCARD = 1; //上传身份证
export const KYC_TYPE_PASSPORT = 2; //上传

export const FIRST_COIN = 'MXM'

export const CNY = 'CNY';
export const MXM = 'MXM';
export const USDT = 'USDT';
export const BTC = 'BTC';
export const ETH = 'ETH';

export const MIN_GAS_LIMIT = 400;
export const MIN_GAS_PRICE = 500;

export const TX_TYPE_TRANSEFER = 0;
export const TX_TYPE_CONTRACT = 1;
export const TX_TYPE_CALL = 2;
export const TX_TYPE_STAKEADD = 3;
export const TX_TYPE_STAKEREDUCE = 5; // 质押减少
export const TX_TYPE_STAKEREFUND = 6; // 质押赎回