var express = require('express');
var bodyparser = require('body-parser');
var request = require('request');

var app = express();

app.use(bodyparser.urlencoded({extended : false}));

app.get('/', function(req, res) {
	res.sendfile('index.html');
});

app.post('/search', function(req,res) {
	var t1 = req.body['tag1'];
	var t2 = req.body['tag2'];

	res.render("results.ejs", {"t1":t1 , "t2":t2});
});

app.get('/scripts/results.js', function(req, res) {
	res.sendfile('scripts/results.js');
});

app.get('/styles/results.css', function(req, res) {
	res.sendfile('styles/results.css');
});


app.get('/styles/results.less', function(req, res) {
	res.sendfile('styles/results.less');
});



app.listen(process.env.PORT || 3000);