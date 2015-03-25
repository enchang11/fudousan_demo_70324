var socket = io.connect(socketUrl);
$(function(){
	
	socket.emit('client_connect');
	
	//redirect client
	socket.on('client_redirect', function(data){
		
		location.href="client.html?id="+data.id;
	});
	
});