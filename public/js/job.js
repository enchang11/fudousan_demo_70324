var socketUrl = "http://fudousan.aucmint.com:3000";
var socket = io.connect(socketUrl);

$(function(){
	//result
	socket.on('res.start', function(){
		$('#7p3').removeClass();
		$('#7p3').addClass('yellow');
	});
	
	socket.on('res.report', function(){
		$('#7p3').removeClass();
		$('#7p3').addClass('red');
		$('#7p3').closest('div').append('<div class="report">'+
                    	'<h2>'+
						'報告No 00026'+
						'<span class="report-close">'+
						 '<i class="icon i16 i16-clos"></i>'+
						'</span>'+
						'</h2>'+
                        '<div class="report-detail">'+
                        	'<figure class="report-photo"><img src="images/report.png" width="400" height="365"></figure>'+
                            '<div class="report-text">'+
                            	'<p>'+
                                    '北側壁に穴が<br>'+
                                    '開いている！'+
                                '</p>'+
                                '<strong>対応状況</strong>'+
                                '<p>'+
                                	'XXXXに連絡済み。<br>'+
                                    '4/25までに修理予定'+
                                '</p>'+
                            '</div>'+
                      '</div>'+
                    '</div>');
		$('#7p3').closest('div').find('.report').show();			
	});
	
	socket.on('res.end', function(){
		$('#7p3').removeClass();
		$('#7p3').addClass('purple');
	});
	
	$('div').on('click','.red', function(){
		$('.report').hide();
		$(this).closest('div').find('.report').show();
	});
	
	$('div').on('click', '.report', function(){
		$(this).hide();
	});
	
	$('div').on('click', '.report-close', function(){
		$(this).closest('.report').hide();
	});
		
	$('body').on('click',function(e){
		if(!$(e.target).hasClass('red')){
			if($('.report').is(':visible')){
				$('.report').hide();
			}
		}
	});
	
});