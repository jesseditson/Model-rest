var request = require('superagent');

module.exports = function(Model,options){

  var RestModel = Model.subclass();

  options = options || {};
  if(!options.idKey) options.idKey = '_id';

  var idKey = options.idKey;
  var collection = RestModel.prototype.collection;
  
  RestModel.baseURL = options.baseURL;
  RestModel.idKey = idKey;

  var getURL = function(url){
    if(!RestModel.baseURL) return url;
    url = url.replace(/^\//,'');
    return RestModel.baseURL.replace(/\/*$/,'/') + url;
  }

  var isEmpty = function(obj){
    return !obj || !Object.keys(obj).length;
  };

  var handleResponse = function(err,res,callback,type){
    err = err || res.error || (res.body && res.body.error);
    if(err) return callback(err);
    var resp;
    var empty = isEmpty(res.body);
    switch(type){
      case 'array' :
        if(empty){
          resp = [];
        } else {
          resp = res.body[collection].map(function(i){
            return new RestModel(i);
          });
        }
        break;
      case 'raw' :
        resp = empty ? null : res.body;
        break;
      default :
        resp = empty ? null : new RestModel(res.body);
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
