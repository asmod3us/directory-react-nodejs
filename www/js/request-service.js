requestService = (function() {

    'use strict';

    var URL_INTERCEPT_RE = /^http?:\/\//,
        correlationHeaders;

    Q.longStackSupport = true;

    function _getCorrelationHeaders() {
        console.debug('_getCorrelationHeaders: ');
        if ('undefined' !== typeof correlationHeaders) {
            return Q(correlationHeaders);
        } else {
            return pluginService.exec('AppDynamics', 'getCorrelationHeaders', []);
        }
    }

    function _beginRequest(config) {
        console.debug('_beginRequest: ', JSON.stringify(config));
        return pluginService.exec('AppDynamics', 'beginHttpRequest', [ config.url ]);
    }

    function _endRequest(response) {
        var appdRequestKey = requestKeyCache.get(response.config);

        if ('undefined' === typeof appdRequestKey) {
            return Q(response);
        } else {
            requestKeyCache.remove(response.config);
            console.debug('_endRequest: ', appdRequestKey, response.xhr.status, response.xhr.getAllResponseHeaders());

           //TODO why is this promise not returning?
            pluginService.exec('AppDynamics', 'reportDone', [ appdRequestKey, response.xhr.status, response.xhr.getAllResponseHeaders()]);
            return response;
        }
    }

    function ajax(config) {
        // return "xhr" regardless of success or failure
        return Q.promise(function (resolve, reject) {
            $.ajax(config)
              .then(function (data, textStatus, jqXHR) {
                  var response = {
                          'data': data,
                          'status': textStatus,
                          'config': config,
                          'xhr': jqXHR
                        };
                  delete jqXHR.then; // treat xhr as a non-promise
                  resolve(response);
              }, function (jqXHR, textStatus, errorThrown) {
                  var response = {
                          'status': textStatus,
                          'config': config,
                          'xhr': jqXHR,
                          'error': errorThrown
                        };
                  delete jqXHR.then; // treat xhr as a non-promise
                  reject(response);
              });
        });
    }

    function request(config) {
        if (null === config.url.match(URL_INTERCEPT_RE)) {
            console.debug('ignoring request: ', config.url);
            return Q($.ajax(config));
        } else {
            console.debug('request: ', config.url);

            // retrieve correlation headers
            return _getCorrelationHeaders()
              .then(function(d) {
                  if ('undefined' === typeof d) {
                      // no correlation header available, pass through
                      return ajax(config);
                  } else {
                      // set headers on request
                      console.debug('correlation headers: ', JSON.stringify(d));
                      correlationHeaders = d;
                      if ('undefined' === typeof config.headers) {
                        config.headers = {};
                      }

                      for (var key in d) {
                        config.headers[key] = d[key];
                      }

                      // mark beginning of request
                      return _beginRequest(config)
                        .then(function(appdRequestKey) {
                            if ('undefined' !== typeof appdRequestKey) {
                                console.debug('request key: ', appdRequestKey);
                                // keep track of request key
                                requestKeyCache.put(config, appdRequestKey);
                            }

                            // perform request
                            return ajax(config);
                        })
                        .then(function(response) {
                          return _endRequest(response);
                        });
                  }
              })
              .fail(function() {
                return ajax(config);
              });
        }
    }

    return {
      request: request
    };

}());
