/**
 * Created by Administrator on 2018/1/30 0030.
 */
var urlTool;
(function (window) {
  function UrlTool() {
  }
  UrlTool.prototype = {
    getRequestParams: function (ul) {
      if (ul.indexOf('?') > -1) {
        var search = decodeURI(ul).split('?')[1]; //获取url中"?"符后的字串
        var theRequest = {};
        var strs = search.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
        return theRequest;
      } else {
        return {};
      }
    },
    isParamOk: function (key,url) {
      var value = this.getParamValue(key,url);
      return this.isStringOk(value);
    },
    isStringOk : function (value) {
      return Boolean(value && value !== '' && value !== 'null' && value !== 'undefined');
    },
    addParam: function (key, value, url) {
      var theUrl = url || window.location.href;
      var hash = '';
      if(theUrl.indexOf('#')>-1){
        var splitArray = theUrl.split('#');
        theUrl = splitArray[0];
        hash = splitArray[1];
      }
      if (theUrl.indexOf('?') > -1) {
        theUrl = theUrl + '&' + key + '=' + value;
      } else {
        theUrl = theUrl + '?' + key + '=' + value;
      }
      hash && (theUrl = theUrl+'#'+hash);
      return theUrl;
    },
    removeParam : function (key,url) {
      var theUrl = url || window.location.href;
      var reg = new RegExp('([\&\?]' + key + '=[^&]*)', 'i');
      return theUrl.replace(reg,'');
    },
    changeParam: function (key, value, url) {
      var theUrl = url || window.location.href;
      var reg = new RegExp('(' + key + '=[^&]*)', 'i');
      theUrl = theUrl.replace(reg, key + '=' + value);
      return theUrl;
    },
    getUrlByParamsObj: function (url, obj) {
      var theUrl = url, key;
      for (key in obj) {
        theUrl = this.addParam(key, obj[key], theUrl);
      }
      return theUrl;
    },
    getSearch: function (url) {
      if (url && url.indexOf('?') > -1) {
        return '?' + url.split('?')[1];
      } else if(url){
        return '?noparam=noparam';
      } else{
        return null;
      }
    },
    getParamValue: function (key, url) {
      var params = this.getRequestParams(this.getSearch(url) || window.location.search);
      if(this.isStringOk(params[key])){
        return params[key];
      }else{
        return null;
      }
    },
    hasParamKey: function (key, url) {
      return this.getParamValue(key, url) !== undefined;
    },
    getCurrHash : function () {
      return  window.location.hash.split('#/')[1]? window.location.hash.split('#/')[1].split('?')[0].split('&')[0]:'';
    }
  };
  urlTool = new UrlTool();
})(window);
module.exports = urlTool;
