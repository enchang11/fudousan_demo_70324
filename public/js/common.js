//---------------------------------------------------
//	Edit Comma
//---------------------------------------------------
function edtComma( str ) {
	var num = new String( str ).replace( /,/g, "" );
	while ( num != ( num = num.replace( /^(-?\d+)(\d{3})/, "$1,$2" ) ) );
	return num;
}

//---------------------------------------------------
//	Get Request
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

//---------------------------------------------------
//	socket
//---------------------------------------------------
var	mSocketUrl="http://192.168.0.113";//http://labov.aucmint.com
var socket  = io.connect(mSocketUrl);
