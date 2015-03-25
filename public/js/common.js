var socketUrl = "http://fudousan.aucmint.com";
//---------------------------------------------------
//	Edit Comma
//---------------------------------------------------
function edtComma( str ) {
	var num = new String( str ).replace( /,/g, "" );
	while ( num != ( num = num.replace( /^(-?\d+)(\d{3})/, "$1,$2" ) ) );
	return num;
}

//---------------------------------------------------
//	Get Parameter Edit
//---------------------------------------------------
function getRequest() {
	if(location.search.length > 1) {
		var get = new Object();
		var ret = location.search.substr(1).split("&");
		for(var i = 0; i < ret.length; i++) {
			var r = ret[i].split("=");
			get[r[0]] = r[1];
		}
		return get;
	} else {
		return false;
	}
}

function isNumber(evt) {
	evt = (evt) ? evt : window.event;
	var charCode = (evt.which) ? evt.which : evt.keyCode;
	if (charCode > 31 && (charCode < 48 || charCode > 57)) {
		return false;
	}
	return true;
}

$(function(){
		//scroll to top
	$('.btnUp').click(function(e){
		e.preventDefault();
		$('html,body').stop().animate({ scrollTop: 0 }, 'slow');
	});
});