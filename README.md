# Model-rest
A Mise model extension for interfacing with a REST API

Usage:
---

First, create your models using [mise](https://github.com/misejs/mise). You can pass any [Model](https://github.com/misejs/Model) to the constructor returned from this module, and it will add convenience methods for interfacing with a REST API.

For more information on how to use Models with mise, see the mise docs and/or the mise Model docs.

To extend a mise model, first create your model, and in your extension model, require this library. You can add other convenience methods you want, and then use this extended model in your application code.

This extension takes only one additional argument, which is an options hash with the following optional keys:

- `idKey` - the key to use as each instance's unique identifier. This defaults to `_id`.

- `baseURL` - the base url of your API, if any (otherwise this will use `/` as the base.)

The baseURL can be changed at runtime by setting `baseURL` on the returned model.

Example:
---

```javascript

var MyModel = require('../lib/models/MyModel.js');
var extend = require('mise-model-rest');

var ExtendedModel = extend(MyModel,{
  baseURL : 'http://mysite.com/api',
  idKey : 'customIDKey'
});

ExtendedModel.prototype.convenienceMethod = function(){
  var data = this.toObject();
  // do something with data.
};

// to change the baseURL at runtime, you can:

ExtendedModel.baseURL = '/api';

module.exports = ExtendedModel;
```

API
---

This extension adds the following methods:

- Model.all(callback)
  This class method will query the endpoint `<baseURL>/<collection>`, where collection is the plural name of the Model, set during original instantiation.
  The callback has the signature `(err,array)`, where array is an array of models of this type.

- Model.one(id,callback)
  This class method will query the endpoint `<baseURL>/<collection>/<id>`
  The callback has the signature `(err,model)`, where model is a model of this type with that ID.

- Model.prototype.save(callback)
  This instance method will do one of 2 following things, depending on the presence of an id on this model.
  If this instance has an id, it will perform a `PUT` to `<baseURL>/<collection>/<id>`.
  If this does not have an id, it will perform a `POST` to `<baseURL>/<collection>`.
  The callback has the signature `(err,model)`, where model is a model of this type (either the updated or created model).

- Model.prototype.destroy(callback)
  This instance method will perform a `DELETE` to `<baseURL>/<collection>/<id>`.
  The callback has the signature `(err,data)`, where data is whatever response the server returned (as long as the response code was 2xx). Since this endpoint will likely return a 204, data will likely be `null` in the case of success.
