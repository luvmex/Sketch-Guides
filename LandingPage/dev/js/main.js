var CELYN = window.CELYN || {};

// CELYN.imageLoad = function(){
// 	$(function() {
// 	    $('img').lazyload({
// 	        effect: 'fadeIn'
// 	    });
// 	});};


CELYN.pageTransition = function(){
	var $animsition = $('.page-intro');
		$animsition
			.animsition({
				loading: true,
				loadingParentElement: 'body',
				loadingClass: 'animsition-loading',
		})};


$(window).resize(function(){
	// if( Modernizr.mq ('min-width: 880px') ) { };
});


$(document).ready(function() {

	// // Nav scroll
	// var startScroll;
	// var lastScrollTop = 0;
	// var scrollOver = 5;
	// var navbarHeight = $('nav').outerHeight();
	

	// $(window).scroll(function(event) {  
	// 	var startScroll = true;  
	// 	//nav scroll
	// 	setInterval(function() {
	// 	    if (startScroll) {
	// 	        hasScrolled();
	// 	        startScroll = false;
	// 	    }
	// 	}, 250);
	// 	function hasScrolled() {
	// 	    var st = $(this).scrollTop();
	// 	    if(st >= 300){
	// 	    	$('nav').css({'top':'0px'});
	// 	    } else {
	// 	    	$('nav').css({'top':'-100px'});
	// 	    }
	// 	    lastScrollTop = st;
	// 	};

	// });

	// CELYN.imageLoad();
	CELYN.pageTransition();

});
      