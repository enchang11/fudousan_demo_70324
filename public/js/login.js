var socket = io.connect(mSocketUrl);

$(document).ready(function(e) {

    $('#btnLogin').click(function(){
		var username = $('#username').val();
		var password = $('#password').val();
		
		if(username == ""){
			alert("Please enter your name.");
			return;
		}else if(username == "aucmint9669"){
			location.href="conductor.html?userid="+username;
		}else{
			location.href="start.html?userid="+username;
		}
	});
	
	var get=getRequest();
	var getError = get['error'];
	
	if(getError==1){
		$('#errorMessage').fadeIn();
		$('#errorMessage').html("Game already started.");
		setTimeout(function(){
			$('#errorMessage').fadeOut();
		},5000);
	}
	
	else if(getError == 2) {
		$('#errorMessage').fadeIn();
		$('#errorMessage').html("コンダクターは既にログイン済みです。");
		setTimeout(function(){
			$('#errorMessage').fadeOut();
		},5000);
	}else if(getError==3){
		$('#errorMessage').fadeIn();
		$('#errorMessage').html("Maximum voter reached.");
		setTimeout(function(){
			$('#errorMessage').fadeOut();
		},5000);
	}
});