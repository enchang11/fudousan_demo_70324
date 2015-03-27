var socketUrl = "http://fudousan.aucmint.com:3000";
var socket = io.connect(socketUrl);

$(function(){
		
	// Auto Height
	var $winHeight = $(window).height();
	
	$('.auto-height').css('min-height',$winHeight);
	$('.mobile-table').css('min-height',$winHeight-120);
	
	
	// Window Resize
	$(window).resize(function(){
		var $winHeight = $(window).height();
		$('.auto-height').css('min-height',$winHeight);
		$('.mobile-table').css('min-height',$winHeight-120);
	});
	
	$('#btnStart').on('click', function(){
		if(!$(this).hasClass('disabled')){
			socket.emit('req.start');
			$('#btnStart').addClass('disabled');
			$('#btnEnd').removeClass('disabled');
		}
	});
	
	$('#btnReport').on('click', function(){
		socket.emit('req.report');
	});
	
	$('#btnEnd').on('click', function(){
		if(!$(this).hasClass('disabled')){
			socket.emit('req.end');
			$('#btnEnd').addClass('disabled');
			$('#btnStart').removeClass('disabled');
		}
	});
	
});
