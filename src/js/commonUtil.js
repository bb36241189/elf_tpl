/**
 * Created by Administrator on 2018/3/28 0028.
 */
var pinkJsBridge = require('./lib/pinkJsBridge');
var urlTool = require('./lib/urlTool');
var config = require('./config');
function CommonUtil() {
  this.reLogin = false;
}
CommonUtil.prototype = {
  constructor: CommonUtil,
  judgeLogin: function () {
    var self = this;
    return pinkJsBridge.getUserInfo().then(function (user) {
      console.log('judgeLogin true');
      return user;
    }).catch(function (e) {
      console.log('judgeLogin false');
      return pinkJsBridge.presentLogin().then(function (data) {
        self.reLogin = true;
        return Promise.resolve(data);
      }).catch(function (ee) {
        return ee || e;
      })
    })
  },
  isInFenfen : function () {
    if(config.isDebug){
      return true;
    }else{
      return urlTool.isParamOk('signature') && urlTool.getParamValue('signature') != '1';
    }
  },
  gotoAppMarket : function () {
    window.location.href = 'https://android.myapp.com/myapp/detail.htm?apkName=pinkdiary.xiaoxiaotu.com&ADTAG=mobile';
  },
  /**
   * uid好的与否，兼容android和ios的差异
   * @returns {*|boolean}
   */
  isUidOk: function () {
    return this.reLogin || urlTool.isParamOk('uid') && Number(urlTool.getParamValue('uid')) !== 0
  }
};
module.exports = new CommonUtil();
