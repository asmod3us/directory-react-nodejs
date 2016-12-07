pluginService = (function() {
    'use strict';

    function exec(plugin, method, args) {
        console.debug('exec: ', plugin, method, args);

        return Q.Promise(function(resolve, reject) {
                cordova.exec(
                    resolve,
                    reject,
                    plugin,
                    method,
                    args);
            });
    }

    return {
        exec: exec
    };

}());
