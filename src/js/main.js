require('../index.html')
require('../css/package.scss')
require('../css/flex-integratev2.scss');
require('./lib/fastclick');
var IScroll = require('./lib/iscroll');
var pinkJsBridge = require('./lib/pinkJsBridge.js');
var config = require('./config');
var apiService = require('./apiService');
var interactiveHandlerFactory = require('./lib/interactiveHandler');
var commonUtil = require('./commonUtil');
var myScroll;
var Preloader = require('preloader.js');
function aa(){
  var  chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];
  var handler = new interactiveHandlerFactory.pressbtnHandler();
  if(chromeVersion){
    handler.handler(true);
  }else{
    handler.handler(true);
  }
}
aa();

// function hengshuping() {
//   if (window.orientation === 90 || window.orientation === -90) {
//     setTimeout(function () {
//       myScroll.refresh();
//     },100);
//   } else {
//     setTimeout(function () {
//       myScroll.refresh();
//     },100);
//   }
// }

// window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", hengshuping, false)

function MainController() {
  this.isMaskShow = false;
}
MainController.prototype = {
  constructor : MainController,
  judgeIsVip : function () {
    return pinkJsBridge.getUserInfo().then(function (user) {
      if(user.vip){
        return true;
      }else{
        return false;
      }
    })
  },
  refreshMask : function () {
    if(this.isMaskShow){
      $('.pop-mask').show();
    }else{
      $('.pop-mask').hide();
    }
  },
  closeMask : function () {
    this.isMaskShow = false;
    this.refreshMask();
  },
  judgeIsGetedGift : function (){
    if(commonUtil.isUidOk()){
      return apiService.bvMe().then(function (data) {
        return data.isGet;
      });
    }else{
      return Promise.resolve(false);
    }
  },
  render : function () {
    $('[get],[no-get]').hide();
    if(!commonUtil.isInFenfen()){
      $('[no-get]').show();
    }
    return this.judgeIsGetedGift().then(function (isGet) {
      if(isGet){
        $('[get]').show();
      }else{
        $('[no-get]').show();
      }
    }).catch(function (e) {
      if(e.errorDefind){
        pinkJsBridge.alert2(e.errorDefind,'','','cry','','好的','','');
      }
    });
  },
  changeMaskContent : function (code) {
    $('.pop-mask').find('[no-vip],[gift-geted],[renew-vip]').hide();
    if(code === 'E008'){
      $('.pop-mask').find('[renew-vip]').show();
    }else if(code === 'E007'){
      $('.pop-mask').find('[no-vip]').show();
    }else if(code === '0'){
      $('.pop-mask').find('[gift-geted]').show();
    }
    this.isMaskShow = true;
    this.refreshMask();
  },
  initEvent : function () {
    var self = this;
    $('.gift-btn').bind('click',function (e) {
      trackEvent('main', 'getGift');
      if(!commonUtil.isInFenfen()){
        commonUtil.gotoAppMarket();
      }else{
        self.judgeIsGetedGift().then(function (isGet) {
          if(!isGet){
            return commonUtil.judgeLogin().then(function (data) {
              return apiService.bvPick();
            }).then(function (data) {
              if(data){
                self.changeMaskContent('0');
                self.render();
              }
            }).catch(function (e){
              if(e.code === 'E007'){//未购买会员
                self.changeMaskContent(e.code);
              }else if(e.code === 'E008'){//活动前购买会员
                self.changeMaskContent(e.code);
              }else if(e.code === 'E005'){
                $('[get],[no-get]').hide();
                $('[get]').show();
                pinkJsBridge.alert2(e.errorDefind,'','','cry','','好的','','');
              }else{
                pinkJsBridge.alert2(e.errorDefind,'','','cry','','好的','','');
              }
            })
          }else{
            return pinkJsBridge.appJump('pinkwx://giftCertificates/app.weex.js');
          }
        });
      }
    });
    $('.pop-close').bind('click',function (e) {
      self.isMaskShow = false;
      self.refreshMask();
    });
    $('.vip-buy-link').bind('click',function (e) {
      trackEvent('main', 'goByVip');
      commonUtil.judgeLogin().then(function () {
        pinkJsBridge.openWindow(config.buy_vip);
      });
      self.closeMask();
    });
    $('[no-vip],[renew-vip]').bind('click',function (e) {
      trackEvent('main', 'goByVip');
      pinkJsBridge.openWindow(config.buy_vip);
      self.closeMask();
    });
    $('[gift-geted]').bind('click',function (e) {
      trackEvent('main', 'goGiftCertificates');
      pinkJsBridge.appJump('pinkwx://giftCertificates/app.weex.js');
      self.closeMask();
    });
  }
};
/**
 * init
 */
function init() {
  // setTimeout(function () {
  //   hengshuping();
  // },100);
  console.log('init ok');
  var controller = new MainController();
  var promise = controller.render();
  controller.initEvent();
  pinkJsBridge.share('https://img.fenfenriji.com//69/27/03/Image/31AAE93D-B4EE-215A-7014-5ABB4BAFF7D9.png',config.pageBaseUrl+'?signature=1');
  if(!commonUtil.isInFenfen()){
    $('[no-get]').html('下载领取礼包');
    $('.vip-buy-link').hide();
  }
  // myScroll = new IScroll('.o2_main_content', {
  //   bounce: false
  // });
  return promise;
}

/**
 * preloader && start
 */
var preloader = new Preloader({
  resources: 'background-bg.png,btn.png,card-bg.png,gift1.png,gitf2.png,group_40.png,little-world.png,shouzhang-tpl.png,stationery.png,theme.png,vip.png'.split(',').map(function (a) {
    return config.imgBaseUrl + '/' + a;
  }),
  concurrency: 4,
  perMinTime: 0 // 加载每个资源所需的最小时间，一般用来测试 loading
});
preloader.addProgressListener(function (loaded, length) {
  console.log('loaded', loaded, length, loaded / length)
});
preloader.addCompletionListener(function () {
  var promise = init();
  if(commonUtil.isInFenfen()){
    promise.then(function () {
      $('#o2_loading').remove();
      $('#o2_main').removeClass('hide')
    })
  }else{
    $('#o2_loading').remove();
    $('#o2_main').removeClass('hide')
  }
});
preloader.start();
