/**
 * Created by Administrator on 2018/1/30 0030.
 */
var ajaxService = require('./ajaxService');
var pinkJsBridge = require('./lib/pinkJsBridge');
var Promise = require('promise');
function ApiService() {

}
ApiService.prototype = {
  constructor: ApiService,
  home: function (source) {
    var self = this;
    return pinkJsBridge.getUserInfo().then(function (user) {
      return ajaxService.get('/home', {
        uid: user.uid,
        source: source || 'local_diary_saved'
      })
    }).then(function (ret) {
      return ret.data;
    }).catch(function (e) {
      return Promise.reject(self.wrapperError(e, {}))
    })
  },
  bvMe : function () {
    var self = this;
    return pinkJsBridge.getUserInfo().then(function (user) {
      return ajaxService.get('/bv-me',{
        uid : user.uid
      })
    }).then(function (ret) {
      return ret.data;
    }).catch(function (e) {
      return Promise.reject(self.wrapperError(e,{}))
    })
  },
  bvPick : function () {
    var self = this;
    return pinkJsBridge.getUserInfo().then(function (user) {
      return ajaxService.get('/bv-pick',{
        uid : user.uid
      }).then(function (ret) {
        return ret.data;
      }).catch(function (e) {
        return Promise.reject(self.wrapperError(e,{}))
      })
    })
  },
  wrapperError: function (e, errorDefind) {
    if (e.errorNo === 'SA003' || e.errorNo === 'SA002' || e.errorNo === 'A0002' || e.errorNo === 'UC011') {
      e.errorDefind = '登录超时';
    } else if (e.errorNo === 'ATS007') {
      e.errorDefind = '你已经登录其他账号';
    } else if (e.errorNo === 'ATC001') {
      e.errorDefind = '你还没有登录';
    } else if (e.message) {
      e.errorDefind = e.message;
    }else if (e.msg){
      e.errorDefind = e.msg;
    }
    if (e.errorNo && errorDefind && errorDefind[e.errorNo]) {
      e.errorDefind = errorDefind[e.errorNo]
    }
    if (!e.errorDefind) {
      e.errorDefind = '请求失败';
    }
    return e;
  }
};
module.exports = new ApiService();
