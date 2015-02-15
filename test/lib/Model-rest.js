var assert = require('assert');
var extend = require('../../lib/Model-rest');
var Model = require('mise-model');
var mockServer = require('../mockServer.js');

describe('Model-mongo',function(){

  var Thing;
  var model;

  before(function(){
    mockServer();

    // set up our data
    var OGModel = new Model('Thing',{
      _id : {
        type : String
      },
      name : {
        type : String
      }
    },'things');
    Thing = extend(OGModel,{
      baseURL : 'http://prixfixeapp.com/api/'
    });
    model = new Thing({name : 'pork'});
  });

  it('should inherit the prototype of mise Model',function(){
    var miseModel = new Model('Thing',{},'things');
    Object.keys(miseModel.prototype).forEach(function(prop){
      assert.ok(Thing.prototype[prop]);
    });
  });

  describe('An instance of Model-rest',function(){

    it('should get all items when calling .all',function(done){
      Thing.all(function(err,list) {
        assert.ifError(err);
        assert.equal(list.length,4);
        done();
      });
    });

    it('should get a single item by an ID when calling .one',function(done){
      Thing.one(1,function(err,found){
        assert.ifError(err);
        assert.deepEqual(found.toObject(),{_id : 1, name : 'thing one'});
        done();
      });
    });

    it('should save a thing to the db when calling .save with no ID',function(done){
      var newThing = new Thing({name : 'new thing'});
      newThing.save(function(err,item){
        assert.ifError(err);
        assert.ok(item._id);
        assert.equal(item.name,'new thing');
        done();
      });
    });

    it('should update an item when calling .save with an ID',function(done){
      var thing = new Thing({_id : 10, name : 'old thing'});
      var nu = {name : 'modified thing'};
      thing.name = nu.name;
      thing.save(function(err,saved){
        assert.ifError(err);
        assert.equal(saved.name,nu.name);
        done();
      });
    });

    it('should remove an item when calling .destroy',function(done){
      var thing = new Thing({_id : 10, name : 'old thing'});
      thing.destroy(function(err){
        assert.ifError(err);
        done();
      });
    });

  });

});
