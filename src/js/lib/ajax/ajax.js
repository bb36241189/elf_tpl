/**
 * Created by Administrator on 2018/1/30 0030.
 */
var originalAjaxUtil;
(function () {
  originalAjaxUtil = {
    createXMLHttpRequest: function () {
      var XMLHttpReq;
      try {
        XMLHttpReq = new ActiveXObject("Msxml2.XMLHTTP");// IE高版本创建XMLHTTP
      } catch (E) {
        try {
          XMLHttpReq = new ActiveXObject("Microsoft.XMLHTTP");// IE低版本创建XMLHTTP
        } catch (E) {
          XMLHttpReq = new XMLHttpRequest();// 兼容非IE浏览器，直接创建XMLHTTP对象
        }
      }
      return XMLHttpReq;
    },
    sendAjaxRequest: function (request, url, param, callback) {
      // 创建XMLHttpRequest对象
      request.open("POST", url, true);
      request.setRequestHeader("Content-type",
        "application/x-www-form-urlencoded");
      request.onreadystatechange = callback; // 指定响应函数 onload
      request.onerror = function (e) {
        // console.error(XMLHttpReq.statusText);
      };
      request.send(param);
    },
    sendAjaxGetRequest: function (request, url, param, callback) {
      request.open("GET", url + '?' + param, true);
      request.onreadystatechange = callback; // 指定响应函数 onload
      request.onerror = function (e) {
        // console.error(XMLHttpReq.statusText);
        console.log("error:" + e)
      };
      request.send();
    },

    action: function (url, param, callback) {
      var request = this.createXMLHttpRequest();
      var strParam = this.paramsObj2Str(param);
      // this.appendLoading(url);
      this.sendAjaxRequest(request, url, strParam, callback);
    },
    actionGet: function (url, param, callback) {
      console.log('actionGet...');
      var request = this.createXMLHttpRequest();
      var strParam = this.paramsObj2Str(param);
      // this.appendLoading(url);
      this.sendAjaxGetRequest(request, url, strParam, callback);
    },
    paramsObj2Str: function (obj) { // 转成post需要的字符串.
      var str = "";

      for (var prop in obj) {
        str += prop + "=" + obj[prop] + "&"
      }
      return str;
    },
    buidActionResultHandler: function (success, failOrScope, scope) {
      var that = this;
      return function (e) {
        var request = e.target;
        if (request.readyState === 4) { // ok
          if (request.status === 200) { // httpstatus
            if (success) {
              var theScope = scope ? scope :
                (failOrScope instanceof Function) ? window : failOrScope
              success.call(theScope, request.responseText, e);
            }
          } else {
            if (request.status !== 0)
              alert(JSON.parse(request.responseText).error);
            else {
              // that.removeAllLoading();
            }
            if (failOrScope && (failOrScope instanceof Function)){
              failOrScope.call(scope ? scope : window, e);
            }
          }
        }
      };
    }
  };
})();
module.exports = originalAjaxUtil;
