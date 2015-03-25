var socket = io.connect(mSocketUrl);

$(function(){
	//================
	// get and register player id
	//================
	var get=getRequest();
	mUserId=get["userid"];
	socket.emit('join',{name:mUserId});
	socket.emit('chk_auction', {});
	
	//if auction start
	socket.on('start', function(){
		location.href = "player.html?userid="+mUserId;
	});
	
	socket.on('auctionStatus', function(data){
		if(data){
			location.href = "player.html?userid="+mUserId;	
		}
	});
	
	socket.on('error', function (data) {
		console.log('error', data)
		if (data.code == 1 ) {
			location.href = 'login.html?error=1';
		} else if(data.code == 2) {
			location.href = 'login.html?error=2';
		}else if(data.code==3){
			location.href = 'login.html?error=3';
			
		}
	});
});