employeeService = (function () {

    var baseURL = "http://localhost:5000";

    // The public API
    return {
        findById: function(id) {
            return fetch(baseURL + "/employees/" + id)
              .then(function(response) {
                return response.json();
              });
        },

        findByName: function(searchKey) {
          var url = new URL('/employees', new URL(baseURL)),
            params = { name: searchKey };

          Object.keys(params).forEach(function(key) {
            url.searchParams.append(key, params[key]);
          });

          return fetch(url)
            .then(function(response) {
              return response.json();
            });
        }
    };

}());
