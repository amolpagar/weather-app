
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , request = require('request');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
const apikey = 'f732a0c771f46ba7f334ba96d9a16323';
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function (req, res) {
	  res.render('index', {weather: null, error: null});
});



app.post('/', function (req, res) {
  var city = req.body.city;
  var url = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&APPID="+apikey;
  console.log(url);
  request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
    	console.log(body);
      var weather = JSON.parse(body)
      console.log(weather);
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        var weatherText = "It's "+weather.main.temp+" degrees in "+weather.name+"!";
        res.render('index', {weather: weatherText, error: null});
      }
    }
  });
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
