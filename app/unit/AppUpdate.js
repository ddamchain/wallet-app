import DeviceInfo from 'react-native-device-info';
import {Alert, Linking, NativeModules} from 'react-native';
import * as Config from './Config';
import {get} from './fetchUnit';
import i18n from './i18n/index';

export default function AppUpdate() {
  let type = 'android'
  if (Config.isIos) {
    type = Config.isAppstore
      ? 'ios'
      : 'inHouse'
  }

  get(Config.url_getVersionInfo, {type}).then(data => {
    updateWithData(data);
  })
}

function updateWithData(data) {
  if (!data) {
    return;
  }
  let {version, url, info, infoEn, minVersion} = data;

  if (!Config.isZh) {
    info = infoEn;
  }

  if (!url || !url.length) {
    return;
  }

  const appBuild = DeviceInfo.getBuildNumber()
  const mustUpdate = parseFloat(minVersion) > parseFloat(appBuild)

  if (parseFloat(version) > parseFloat(appBuild)) {

    let button = []
    if (!mustUpdate) {
      button.push({text: i18n.my_cancel})
    }

    button.push({
      text: '更新',
      onPress: () => {
        downloadLink(url)
        if (mustUpdate) {
          setTimeout(() => {
            updateWithData(data)
          }, 1000);
        }
      }
    })

    Alert.alert('发现新版本', info, button, {
      cancelable: !mustUpdate
    })
  }
}

function downloadLink(url) {

  Linking.openURL(url)
  return;
  if (Config.isAndroid && url.indexOf('apk') != -1) {
    NativeModules
      .DownloadApk
      .downloading(url, "app.apk");
  } else {
    Linking.openURL(url)
  }

}
