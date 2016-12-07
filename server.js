require("appdynamics").profile({
  controllerHostName: '5.189.161.196',
  controllerPort: 2080,
  controllerSslEnabled: false,  // Set to true if controllerPort is SSL
  accountName: 'customer1',
  accountAccessKey: 'H16h53cur3',
  applicationName: 'YOUR-APP-NAME',
  tierName: 'frontend',
  nodeName: 'process' // The controller will automatically append the node name with a unique number
});

var express = require('express'),
    employees = require('./routes/employees'),
    app = express(),
    http = require('http');

app.use(express.static('www'));

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/employees', employees.findAll);
app.get('/employees/:id', employees.findById);

app.get('/realweather', function(req, res) {

    //var location = 'London';
    var location = req.query.geo;
    if (!location) {
      return res.status(404).end();
    }
    var weather;

    var httpAddress = 'http://api.openweathermap.org/data/2.5/weather?q=' + location + '&appid=716f8bdc119843c7e88b7ada22d5d7c3';
    http.request(httpAddress, function(response) {

        //log('HEADERS: ' + JSON.stringify(res.headers));
        response.setEncoding('utf8');

        response.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
            weather = chunk
        });

        response.on('end', function() {
            var backbutton = '<button onclick=\"goBack()\">Go Back</button><script>function goBack() {     window.history.back();  }  </script>';
            res.send(backbutton + '<BR><BR>The weather in ' + location + ' is <BR><BR>' + weather);
            console.log('Weather done!')
        });

    }).end();
})

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
