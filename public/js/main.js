$(function(){
	
	// Auto Height
	
	$('.pageWrapper').css('min-height',$(window).height());
	$('.containerAuto').css('min-height',$(window).height()-120);
	$('.containerAuto').css('height',$(window).height()-120);
	$('.maxHeightAuto').css('height',$('.containerLeft').height()-80);
	$('.chatMessage').css('height',$('.containerRight').height()-$('.articleHeader').height()-130);
	$(window).resize(function(){
		$('.pageWrapper').css('min-height',$(window).height());
		$('.containerAuto').css('min-height',$(window).height()-120);
		$('.containerAuto').css('height',$(window).height()-120);
		$('.maxHeightAuto').css('height',$('.containerLeft').height()-80);
		$('.chatMessage').css('height',$('.containerRight').height()-$('.articleHeader').height()-130);
	});
	
});