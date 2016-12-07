requestKeyCache = (function() {

    'use strict';

    var _cache = {};

    function get(key) {
        if ('object' === typeof key) {
            return _cache[JSON.stringify(key)];
        } else {
            return _cache[key];
        }
    }

    function put(key, value) {
      if ('object' === typeof key) {
          _cache[JSON.stringify(key)] = value;
      } else {
          _cache[key] = value;
      }
    }

    function remove(key) {
        if ('object' === typeof key) {
            delete _cache[JSON.stringify(key)];
        } else {
            delete _cache[key];
        }
    }

    return {
      put: put,
      get: get,
      remove: remove
    };

}());
