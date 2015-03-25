$(function(){
	detectOrientationMode();
	window.addEventListener('resize', detectOrientationMode, false);
	function detectOrientationMode(){
		//if($.ua().IPad){
		  if(window.innerHeight>window.innerWidth){
			$('.deviceWarning').show();
			document.ontouchmove = function(e){
			  e.preventDefault();
			}
		  }else{
			$('.deviceWarning').hide();
			document.ontouchmove = function(e){
			  return e;
			}
		  }
		//}
    }
	
	if($.ua().Chrome || $.ua().Firefox){
		$(".ticketList").mCustomScrollbar({
			scrollButtons:{
				enable:true
			}
		});
	}
	
	//
	if(window.outerWidth<800 && window.outerHeight<400){
		//setTimeout(function(){
			$('meta[name=viewport]').attr('content','initial-scale=0.4, minimum-scale=0.4, maximum-scale=0.4, user-scalable=no');
		//});
	}
	else if(window.outerWidth>800 && window.outerHeight<670){
		//setTimeout(function(){
			$('meta[name=viewport]').attr('content','initial-scale=0.7, minimum-scale=0.7, maximum-scale=0.7, user-scalable=no');
		//});
	}
	else{
		$('meta[name=viewport]').attr('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no');
		$('.sectionWrapper').css('min-height', '670px');
		//757;
	}
	
	
	//===========draw seats========
	var groupseats = ['21','22','23','24','25','26'];
	var col =  ['A','C','D','E','G','H','K'];
	var occupied_seats = ['A21','A22','C21','H24','K24','E22','G22','H22','A23','C23','K22','A25','A26','C25','D25'];
	//=============================
	
	 for(var i = 0; i<groupseats.length;i++) {
		 for(var ii=0; ii<col.length; ii++){
			if(groupseats[i]!=24){
				 if(ii==1 || ii==4){
					 if($.inArray(col[ii]+''+groupseats[i], occupied_seats)==-1){
						  $('#'+groupseats[i]+'').append('<div class="seat selSeats" data-id="'+col[ii]+''+groupseats[i]+'">'+
															'<a href="#">'+
																'<div class="status seatAvail">'+
																	'<span data-id="'+col[ii]+''+groupseats[i]+'"></span>'+
																'</div>'+
																'<strong>12,800</strong>'+
															'</a>'+
														'</div><div class="seat spacing"></div>');
					 }
					 else{
						 $('#'+groupseats[i]+'').append('<div class="seat" data-id="'+col[ii]+''+groupseats[i]+'">'+
															'<div class="status seatNotAvail"></div>'+
														'</div><div class="seat spacing"></div>');
					 	
					 }
				 }
				 else{
					 if($.inArray(col[ii]+''+groupseats[i], occupied_seats)==-1){
							$('#'+groupseats[i]+'').append('<div class="seat selSeats" data-id="'+col[ii]+''+groupseats[i]+'">'+
																'<a href="#">'+
																	'<div class="status seatAvail">'+
																		'<span data-id="'+col[ii]+''+groupseats[i]+'"></span>'+
																	'</div>'+
																	'<strong>12,800</strong>'+
																'</a>'+
															'</div>');
					 }
					 else{
						 $('#'+groupseats[i]+'').append('<div class="seat" data-id="'+col[ii]+''+groupseats[i]+'">'+
															'<div class="seatNotAvail"></div>'+
														'</div>');
					 }
				 }
			}
			else{
				if(ii==1){
					if($.inArray(col[ii]+''+groupseats[i], occupied_seats)==-1){
						$('#'+groupseats[i]+'').append('<div class="seat selSeats" data-id="'+col[ii]+''+groupseats[i]+'">'+
															'<a href="#">'+
																'<div class="status seatAvail">'+
																	'<span data-id="'+col[ii]+''+groupseats[i]+'"></span>'+
																'</div>'+
																'<strong>12,800</strong>'+
															'</a>'+
														'</div>'+
														'<div class="seat spacing"></div>');
					}
					else{
						 $('#'+groupseats[i]+'').append('<div class="seat" data-id="'+col[ii]+''+groupseats[i]+'">'+
															'<div class="seatNotAvail"></div>'+
														'</div><div class="seat spacing"></div>');
					 	
					 }
				}
				else if(ii==2 || ii==3){
					$('#'+groupseats[i]+'').append('<div class="seat" data-id="'+col[ii]+''+groupseats[i]+'"></div>');
				}
				else if(ii==4){
					$('#'+groupseats[i]+'').append('<div class="seat" data-id="'+col[ii]+''+groupseats[i]+'"></div><div class="seat spacing"></div>');
				}
				else{
					if($.inArray(col[ii]+''+groupseats[i], occupied_seats)==-1){
						$('#'+groupseats[i]+'').append('<div class="seat selSeats" data-id="'+col[ii]+''+groupseats[i]+'">'+
															'<a href="#">'+
																'<div class="status seatAvail">'+
																	'<span data-id="'+col[ii]+''+groupseats[i]+'"></span>'+
																'</div>'+
																'<strong>12,800</strong>'+
															'</a>'+
														'</div>');
					}
					else{
						 $('#'+groupseats[i]+'').append('<div class="seat" data-id="'+col[ii]+''+groupseats[i]+'">'+
															'<div class="seatNotAvail"></div>'+
														'</div>');
					 }
				}
				
			}
		}
	 }
});
