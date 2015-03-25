/*var express = require('express');
var app = express();
require('socket.io').version
var server = app.listen(3003);
var io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));*/


var express    = require('express');
var app        = express.createServer();
var io         = require('socket.io').listen(app);

app.configure(function(){
	app.use(express.static(__dirname + "/public"));
});

app.listen(3003);

//remove error log
io.set('log level', 1);
