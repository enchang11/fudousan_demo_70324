/*
* jQuery browserdetect plugin v1
* created by kashimu
* date: 2012/7/20
*  
* $.ua() returns an object with corresponding ua detect value. boolean
* usage: $.ua().IPad
* -list-
* IPad, IPod,IPhone,iOS,Android,Chrome,Firefox,Safari,Opera
* IE,IE8,IE9
*/

(function ($) {
	
	$.extend({
		ua:function(){
			var ua = navigator.userAgent;	
			var is_IPad = (ua.match(/iPad/))? true : false;
			var is_IPod = (ua.match(/iPod/))? true : false;
			var is_IPhone = (ua.match(/iPhone/))? true : false;
			var is_Chrome = (ua.match(/Chrome/))? true : false;
			var is_IE = (ua.match(/MSIE/))? true : false;
			var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			var IE_ver;
			if (re.exec(ua) != null){
				IE_ver = parseFloat(RegExp.$1);
			}
			var ab = {
				"IPad":is_IPad,
				"IPod":is_IPod,
				"IPhone":is_IPhone,
				"iOS":(is_IPad||is_IPod||is_IPhone)? true : false,
				"Android":(ua.match(/Android/))? true : false,
				"Chrome":is_Chrome,
				"Firefox":(ua.match(/Firefox/))? true : false,
				"Safari":(ua.match(/Safari/) && !is_Chrome)? true : false,
				"Opera":(ua.match(/Opera/) )? true : false,
				"IE":is_IE,
				"IE6":(is_IE && IE_ver==6)? true : false,
				"IE7":(is_IE && IE_ver==7)? true : false,
				"IE8":(is_IE && IE_ver==8)? true : false,
				"IE9":(is_IE && IE_ver==9)? true : false,
				"IE10":(is_IE && IE_ver==10)? true : false,
				"IEv":IE_ver
				
			}
			return ab;
			
		}
	});
	
})(jQuery);
// JavaScript Document