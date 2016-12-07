employeeService = (function () {

    'use strict';

    var baseURL = "http://localhost:5000";

    // The public API
    return {
        findById: function(id) {
            return $.ajax({ url: baseURL + "/employees/" + id }).then(function (result) { return { data: result }});
        },

        findByName: function(searchKey) {
            return $.ajax({url: baseURL + "/employees", data: {name: searchKey}}).then(function (result) { return { data: result }});
        }
    };

}());
