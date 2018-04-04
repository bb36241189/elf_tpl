/**
 * Created by Administrator on 2018/1/30 0030.
 */
var Promise = require('promise');
var urlTool = require('./urlTool');
var config = require('../config');
function PinkJsBridge() {

}
PinkJsBridge.prototype = {
  constructor: PinkJsBridge,
  ready: function () {
    var self = this;
    return new Promise(function (r, j) {
      self.pinkJsBridgeReady(function (api) {
        r(api);
      })
    })
  },
  /**
   * 快速获取用户信息，android有问题，android消息里面签名失败
   */
  getUserInfoQuick: function () {
    /**************debug area******************/
    if (config.isDebug) {
      return Promise.resolve({
        uid: urlTool.getParamValue('uid') || '21695757',
        nickname: '萝卜伊甸',
        avatar: ''
      })
    } else if (!urlTool.getParamValue('uid')) {
      return Promise.reject({
        message: '获取用户信息失败'
      });
    } else {
      return this.getUserInfo();
    }
  },
  getUserInfo: function () {
    if (config.isDebug) {
      return Promise.resolve( {
        "id": "849787",
        "uid": "5737099",
        "account": "bug410",
        "nickname": "黑白无常",
        "email": "",
        "sex": "1",
        "birthday": "0",
        "province": "0",
        "city": "0",
        "type": "1",
        "vip": "1518663270",
        "tel": null,
        "signature": "父子关系高低贵贱香菇洗干净祝福祝福坐在房间中减肥媳妇洗净放在房间中减肥中",
        "avatar": "https:\/\/icon.fenfenriji.com\/F8\/B2\/79\/Image\/7601c16f3a526bdcec036bdd8c8d398e.jpg!icon",
        "photos": ["https:\/\/icon.fenfenriji.com\/F8\/B2\/79\/Image\/7601c16f3a526bdcec036bdd8c8d398e.jpg!icon", "https:\/\/icon.fenfenriji.com\/F8\/B2\/79\/Image\/magazine-unlock-04-2.3.752-_4a8aaf6fd40b4a469d0e59b34b1a4917.jpg!icon", "https:\/\/icon.fenfenriji.com\/69\/27\/03\/21695757\/21695757_1e70bd68c1.png!icon", "https:\/\/icon.fenfenriji.com\/69\/27\/03\/21695757\/21695757_dd91938874.png!icon"],
        "background": "https:\/\/icon.fenfenriji.com\/69\/27\/03\/21695757\/background_d4dd6fcd4e.png",
        "registerDate": "2016-07-19 13:47:23",
        "date": null,
        "tag_list": [{
          "id": "100022",
          "name": "二货",
          "count": "0",
          "type": "1"
        }, {
          "id": "100015",
          "name": "女王",
          "count": "0",
          "type": "1"
        }],
        "is_vip": "0",
        "is_year_vip": null,
        "vip_expire": "1518663270",
        "is_ability": "1",
        "ability_level": "1",
        "verified": "1",
        "max_numbers": 10000,
        "is_follow": "0",
        "is_mefollow": 0,
        "thirdParty": {
          "gotype_token": "00d1c60861e0d096f3670a0cf7ce4d8e"
        },
        "isBindMobile": "1",
        "status": "0",
        "gag_time": "1507635352",
        "subscribe_level": 202,
        "subAuthorType": "第2批签约的非独家作者",
        "is_exp_double": 0
      })
    } else {
      return this.ready().then(function (api) {
        return new Promise(function (r, j) {
          PinkJSBridge.callHandler('getUserInfo', {}, function (user) {
            if (user.uid) {
              r(user);
            } else {
              j({
                message: '获取用户信息失败'
              });
            }
          });
        });
      });
    }
  },
  presentLogin : function(){
    return this.ready().then(function () {
      return new Promise(function (r,j) {
        PinkJSBridge.callHandler('presentLogin', {}, function(data) {
          r(data);
        });
      })
    });
  },
  goBack: function () {
    return this.ready().then(function () {
      PinkJSBridge.callHandler('goBack', {});
    });
  },
  share: function (img, url) {
    return this.ready().then(function () {
      if (window['PinkJSBridge']) {
        PinkJSBridge.callHandler('showOptionMenu', {});
      }
      var onMenuSharePink = function (title, summary, image_url, action_url) {
        PinkJSBridge.callHandler('onMenuSharePink',
          {
            title: title,
            summary: summary,
            action_url: action_url,
            image_url: image_url
          },
          function (data) {
          }
        );
      };
      var showMenuItems = function (menuList) {
        menuList = menuList || ["menuItem:share:pink"]
        PinkJSBridge.callHandler('showMenuItems', {
          "menuList": menuList
        }, function (data) {
        });
      };
      var onMenuShareSocial = function (title, summary, image_url, url) {
        PinkJSBridge.callHandler('onMenuShareSocial',
          {
            title: title,
            summary: summary,
            target_url: url,
            image_url: image_url
          },
          function (data) {
          }
        );
      };
      var title = '福利@你';
      var summary = '春风十里，不如充值会员 送好礼';
      var image_url = img;
      var action_url = url;
      onMenuSharePink(title, summary, image_url, action_url);
      onMenuShareSocial(title, summary, image_url, url);
      var menuList = ["menuItem:share:pink", "menuItem:share:social"];
      showMenuItems(menuList);
    });
  },
  /**
   * private
   * @param readyCallback
   */
  pinkJsBridgeReady: function (readyCallback) {
    if (readyCallback && typeof readyCallback === 'function') {
      var Api = this;
      var pinkReadyFunc = function () {
        setTimeout(function () {
          readyCallback(Api);
        }, 1)
      };

      if (!window['PinkJSBridge']) {
        if (document.addEventListener) {
          document.addEventListener('PinkJSBridgeReady', pinkReadyFunc, false);
        } else if (document.attachEvent) {
          document.attachEvent('PinkJSBridgeReady', pinkReadyFunc);
          document.attachEvent('onPinkJSBridgeReady', pinkReadyFunc);
        }
      } else {
        pinkReadyFunc();
      }
    }
  },
  __buildConfig: function (obj) {
    var c = {}, k;
    for (k in obj) {
      (obj[k] || obj[k] === 0 || obj[k] === false) && (c[k] = obj[k])
    }
    return c;
  },
  isInPink: function () {
    return typeof PinkJSBridge !== 'undefined';
  },
  /**
   * 原生跳转
   * @param url
   */
  appJump: function (url) {
    return this.ready().then(function () {
      PinkJSBridge.callHandler('appJump', {'action': url});
    })
  },
  openWindow : function (url) {
    return this.ready().then(function () {
      PinkJSBridge.callHandler('openWindow', {'url': url});
    })
  },
  /**
   *
   * @param title  标题  YES
   * @param desc  说明  NO
   * @param icon  图标地址  NO
   * @param emotion  表情名称: happy cry proud  NO
   * @param scene  场景名称，显示在弹框之外的效果，现在只有撒花 firework  NO
   * @param cancelBtn	取消按钮文字
   * @param otherBtns  其他按钮文字  NO
   * @param head  头部图片地址  NO
   * @param requrieInput 需要输入  NO
   */
  alert2: function (title, desc, icon, emotion, scene,cancelBtn, otherBtns, head, requrieInput) {
    var param = this.__buildConfig({
      title: title,
      desc: desc,
      icon: icon,
      emotion: emotion,
      scene: scene,
      otherBtns: otherBtns,
      cancelBtn : cancelBtn,
      head: head,
      requrieInput: requrieInput
    });
    if (this.isInPink()) {
      return this.ready().then(function () {
        return new Promise(function (r,j) {
          PinkJSBridge.callHandler('alert', param, function (ret) {
            r(ret);
          });
        });
      })
    } else {
      alert(title+'\n'+desc);
    }
  },
  /**
   * public
   * @param title
   * @param summary
   * @param action_url
   * @param target_url
   * @param image_url
   * @param shareType
   */
  shareOnbutton: function (title, summary, action_url, target_url, image_url, shareType) {
    !image_url && (image_url = 'http://img.fenfenriji.com/69/27/03/Image/93786496-CCE1-D627-1179-5A7136BD701E.png');
    !shareType && (shareType = 'all');
    return new Promise(function (r, j) {
      PinkJSBridge.callHandler(
        'share',
        {
          shareType: shareType,
          action_url: action_url,//内部分享
          title: title,
          summary: summary,
          target_url: target_url,//外部分享
          image_url: image_url
        },
        function (data) {
          r(data);
        }
      )
    });
  }
};
module.exports = new PinkJsBridge();
