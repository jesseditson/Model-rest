var Model = require('mise-model');
var request = require('superagent');
var prefix = require('superagent-prefix');

module.exports = function(name,schema,collection,baseURL){

  var RestModel = new Model(name,schema,collection);

  var getURL = function(url,baseURL){
    if(!baseURL) return url;
    url = url.replace(/^\//,'');
    return baseURL.replace(/((?:https?:\/\/)?[^\/]+).+/i,'$1/' + url);
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
    .get(getURL('/api/' + collection,baseURL))
    .end(function(err,res){
      handleResponse(err,res,callback,'array');
    });
  };
  RestModel.one = function(id,callback){
    request
    .get(getURL('/api/' + collection + '/' + id,baseURL))
    .end(function(err,res){
      handleResponse(err,res,callback);
    });
  };
  RestModel.prototype.save = function(callback){
    var data = this.toObject();
    var method = !!data._id ? 'put' : 'post';
    request[method](getURL('/api/' + collection + (data._id ? '/' + data._id : ''),baseURL))
    .send(data)
    .end(function(err,res){
      handleResponse(err,res,callback);
    });
  };
  RestModel.prototype.destroy = function(callback){
    var data = this.toObject();
    request
    .del(getURL('/api/' + collection + '/' + data._id,baseURL))
    .end(function(err,res){
      handleResponse(err,res,callback,'raw');
    });
  };

  return RestModel;
};
