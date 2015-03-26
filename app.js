/*var express = require('express');
var app = express();
require('socket.io').version
var server = app.listen(3000);
var io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));*/

var express    = require('express');
var app        = express.createServer();
var io         = require('socket.io').listen(app);

app.configure(function(){
	app.use(express.static(__dirname + "/public"));
});

app.listen(3000);

//remove error log
io.set('log level', 1);

io.sockets.on('connection', function(socket){
	
	socket.on('req.start', function(){
		io.sockets.emit("res.start");
	});
	
	socket.on('req.report', function(){
		io.sockets.emit("res.report");
	});
	
	socket.on('req.end', function(){
		io.sockets.emit("res.end");
	});
	
});
