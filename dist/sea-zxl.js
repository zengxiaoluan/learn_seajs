;(function (global) {
  global.seajs = {
    version: '0.1'
  };

  var cachedModules = global.cachedModules = {};
  var modNumber = 0;
  var callbackList = {};

  function isType(type) {
    return function(obj) {
      return {}.toString.call(obj) == "[object " + type + "]";
    };
  }
  
  var isFunction = isType("Function");

  Module.STATUS = {
    FETCHING: 1,
    SAVED: 2,
    LOADING: 3,
    LOADED: 4,
    EXECUTING: 5,
    EXECUTED: 6,
    ERROR: 7
  };

  function Module (uri, dependencies) {
    this.uri = uri;
    this.dependencies = dependencies || [];
    this.deps = {};
    this.status = 0;

    this._entry = [];
  }

  seajs.use = function (dependencies, callback) {
    var mod = Module.get(modNumber++, dependencies);
    mod._entry.push(mod);
    mod.remain = 1;
    
    mod.callback = function () {
      var exports = []
      var dependencies = mod.dependencies;

      for (var i = 0, len = dependencies.length; i < len; i++) {
        exports[i] = cachedModules[dependencies[i]].exec();
      }
  
      if (callback) {
        callback.apply(global, exports);
      }
    };

    mod.load();
  };

  Module.get = function (uri, dependencies) {
    return cachedModules[uri] || (cachedModules[uri] = new Module(uri, dependencies));
  };

  Module.prototype.load = function () {
    var mod = this;
    var dependencies = mod.dependencies || [];

    mod.status = Module.STATUS.LOADING;

    for(var i = 0, length = dependencies.length; i < length; i++) {
      var one = dependencies[i];
      mod.deps[one] = Module.get(one);
    }

    mod.pass();

    if(mod._entry.length) {
      mod.loadedAll();
      return;
    }

    var requestCache = {};

    for (i = 0; i < length; i++) {
      var m = cachedModules[dependencies[i]];
      m.fetch(requestCache);
    }

    for (var requestUri in requestCache) {
      if (requestCache.hasOwnProperty(requestUri)) {
        requestCache[requestUri]();
      }
    }

  };

  Module.prototype.exec = function () {
    var mod = this;
  
    if (mod.status >= Module.STATUS.EXECUTING) {
      return mod.exports;
    }
  
    mod.status = Module.STATUS.EXECUTING;
  
    function require(id) {
      var m = mod.deps[id] || Module.get(id);
      return m.exec();
    }
  
    // Exec factory
    var factory = mod.factory;
  
    var exports = isFunction(factory) && factory.call(mod.exports = {}, require, mod.exports, mod);
  
    if (exports === undefined) {
      exports = mod.exports;
    }
  
    mod.exports = exports;
    mod.status = Module.STATUS.EXECUTED;
  
    return mod.exports;
  }

  Module.prototype.fetch = function (requestCache) {
    var mod = this;
    var uri = mod.uri;

    mod.status = Module.STATUS.FETCHING;
    callbackList[uri] = [mod];

    requestCache[uri] = function () {
      request(uri, function () {
        var m, mods = callbackList[uri];
        delete callbackList[uri];
        while ((m = mods.shift())) {
          m.load();
        }
      });
    };
  };

  Module.prototype.loadedAll = function () {
    var mod = this;
    mod.status = Module.STATUS.LOADED;

    // When sometimes cached in IE, exec will occur before onload, make sure len is an number
    for (var i = 0, len = (mod._entry || []).length; i < len; i++) {
      var entry = mod._entry[i];
      if (--entry.remain === 0) {
        entry.callback();
      }
    }
  };

  Module.prototype.pass = function () {
    var mod = this;
    var dependencies = mod.dependencies;
    var len = dependencies.length;

    for(var i = 0; i < mod._entry.length; i++){
      var entry = mod._entry[i];
      var count = 0;

      for(var j = 0; j < len; j++) {
        var one = dependencies[j];
        var m = mod.deps[one];
        m._entry.push(entry);
        count++;
      }

      if(count > 0) {
        entry.remain += count - 1;
        mod._entry.shift();
      }
    }
  };

  global.define = function(id, dependencies, factory) {
    var mod = Module.get(id);
    mod.uri = id;
    mod.dependencies = dependencies;
    mod.factory = factory;
    mod.status = Module.STATUS.SAVED;
  };

  function request (url, callback) {
    var node = document.createElement("script");
  
    node.onload = onload;
    node.onerror = function() {
      onload(true);
    };
  
    function onload(error) {
      callback(error);
    }
  
    node.async = true;
    node.src = url;
  
    document.head.appendChild(node);
  }

})(this);
