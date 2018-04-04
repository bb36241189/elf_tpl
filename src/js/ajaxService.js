/**
 * Created by Administrator on 2018/1/30 0030.
 */
var config = require('./config');
var ajax = require('./lib/ajax/ajax');
var Promise = require('promise');
function AjaxService() {

}
AjaxService.prototype = {
  constructor : AjaxService,
  get : function (url,params) {
    return new Promise(function (r,j) {
      ajax.actionGet(config.serverBaseUrl+url,params,ajax.buidActionResultHandler(function (data) {
        // alert('ccccccccc'+Object.prototype.toString.call(data)+JSON.parse(data));
        var json = JSON.parse(data);
        if(json.code || json.msg){
          j(json)
        }else{
          r(json);
        }
      },function (e) {
        j(e);
      }))
    })
  },
  post : function (url,params) {
    return new Promise(function (r,j) {
      ajax.action(config.serverBaseUrl+url,params,ajax.buidActionResultHandler(function (data) {
        var json = JSON.parse(data);
        if(json.code || json.msg){
          j(json)
        }else{
          r(json);
        }
      },function (e) {
        j(e);
      }))
    })
  }
};
module.exports = new AjaxService();
