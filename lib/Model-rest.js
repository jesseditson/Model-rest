var Model = require('mise-model');
var request = require('superagent');
var prefix = require('superagent-prefix');

module.exports = function(RestModel,options){

  options = options || {};
  if(!options.idKey) options.idKey = '_id';

  RestModel.baseURL = options.baseURL;
  var idKey = options.idKey;
  var collection = RestModel.prototype.collection;

  var getURL = function(url){
    if(!RestModel.baseURL) return url;
    url = url.replace(/^\//,'');
    return RestModel.baseURL.replace(/\/*$/,'/') + url;
  }

  var handleResponse = function(err,res,callback,type){
    err = err || res.error || (res.body && res.body.error);
    if(err) return callback(err);
    var resp;
    switch(type){
      case 'array' :
        resp = res.body[collection].map(function(i){
          return new RestModel(i);
        });
        break;
      case 'raw' :
        resp = res.body;
        break;
      default :
        resp = new RestModel(res.body);
        break;
      }
      callback(null,resp);
    };

  RestModel.all = function(callback){
    request
    .get(getURL(collection))
    .end(function(err,res){
      handleResponse(err,res,callback,'array');
    });
  };
  RestModel.one = function(id,callback){
    request
    .get(getURL(collection + '/' + id))
    .end(function(err,res){
      handleResponse(err,res,callback);
    });
  };
  RestModel.prototype.save = function(callback){
    var data = this.toObject();
    var method = !!data[idKey] ? 'put' : 'post';
    request[method](getURL(collection + (data[idKey] ? '/' + data[idKey] : '')))
    .send(data)
    .end(function(err,res){
      handleResponse(err,res,callback);
    });
  };
  RestModel.prototype.destroy = function(callback){
    var data = this.toObject();
    request
    .del(getURL(collection + '/' + data[idKey]))
    .end(function(err,res){
      handleResponse(err,res,callback,'raw');
    });
  };

  return RestModel;
};
