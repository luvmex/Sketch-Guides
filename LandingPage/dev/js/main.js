var CELYN = window.CELYN || {};


CELYN.loadFinish = function(){
	$('.about-title').addClass('aboutTintro');
	$('.about-describe').addClass('aboutDintro');
};


CELYN.imageLoad = function(){
	$(function() {
	    $('img').lazyload({
	        effect: 'fadeIn'
	    });
	});
};

CELYN.smoothScroll = function(){
	$(function() {
		$('a[href*="#"]:not([href="#"])').click(function() {
			if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
				var target = $(this.hash);
				target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
				if (target.length) {
					$('html, body').animate({
						scrollTop: target.offset().top
					}, 850, 'easeInOutExpo');
				return false;
				}
			}
		});
	});
};


CELYN.pageTransition = function(){
	var $animsition = $('.page-intro');
		$animsition
			.animsition({
				loading: true,
				loadingParentElement: 'body',
				loadingClass: 'animsition-loading',
		})};



CELYN.disableHover = function(){
    var body = document.body,
        timer;

    window.addEventListener('scroll', function() {
      clearTimeout(timer);
      if(!body.classList.contains('disable-hover')) {
        body.classList.add('disable-hover')
      }
      
      timer = setTimeout(function(){
        body.classList.remove('disable-hover')
      },500);
    }, false);
};


CELYN.parallaxElement = function(){    
    var scroll = $(window).scrollTop();
    var hoffset = $('header').offset();
    var hh = $('header').height();
	var moffset = $('#biography').offset();
    var Go = (scroll - hoffset.top)/hh;
	var scrollnext = $('#scrollnext');
    //head title parallax
    if( scroll > hoffset.top ) {
      	scrollnext.css({'opacity': 1 - (Go*1.5), 'bottom': 1 - (Go*30)});
		if (scroll > moffset.top ) {
			scrollnext.css({'opacity':'0','bottom':'-30px'});
		}
    } else {
		scrollnext.css({'opacity':'1','bottom':'0px'});
	}
};

$(window).load(function() {
	// CELYN.loadFinish();
});

$(window).resize(function(){
	// if( Modernizr.mq ('min-width: 880px') ) {
	// 	CELYN.setPageH();
	// };
});

$(window).scroll(function(event) {
    CELYN.disableHover();
	// CELYN.parallaxElement();

	var startScroll = true;
	var showup = $('.showupline').offset();
    var st = $(this).scrollTop();
    if(st >= showup.top){
    	$('#scrolltop').css({'bottom':'8%', 'opacity':'1'});
    } else {
    	$('#scrolltop').css({'bottom':'-50px','opacity':'0'});
    }
});


$(document).ready(function() {


	// scroll to top
	$('#scrolltop').click(function(){
		$('html, body').animate({scrollTop : 0}, 850, 'easeInOutExpo');
		// $('html, body').animate({scrollTop: $('.wrap_content').first().offset().top}, 850, 'easeInOutExpo');
		return false;
	});


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
	CELYN.smoothScroll();
	CELYN.pageTransition();

});
      