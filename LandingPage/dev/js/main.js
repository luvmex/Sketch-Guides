var CELYN = window.CELYN || {};

CELYN.fullHeight = function(){
	var winH = window.innerHeight ? window.innerHeight:$(window).height();
	var winW = $(window).width();
	$(".fullHeight").each(function(){
		$(this).css({'height': winH +'px'});
	});
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
				loadingInner: '',
				timeout: false,
				timeoutCountdown: 5e3,
				onLoadEvent: true,
				loadingParentElement: 'body',
				loadingClass: 'animsition-loading',
		})
};


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



CELYN.scrollDownParallax = function(){

    var scroll = $(window).scrollTop();
    var headerOffset = $('header').offset();
	var mainOffset = $('main').offset();
    var headerHeight = $('header').height();
    var values = (scroll - headerOffset.top)/headerHeight;
	var scrolldown = $('#scrolldown');

    //Scroll down
    if( scroll > headerOffset.top ) {
      	scrolldown.css({'opacity': 1 - (values*1.5), 'bottom': 30 - (values*60)});
		if (scroll > mainOffset.top ) {
			scrolldown.css({'opacity':'0','bottom':'0px'});
		}
    } else {
		scrolldown.css({'opacity':'1','bottom':'30px'});
	}

};


$(document).ready(function() {
	CELYN.fullHeight();

	$('#scrolltop').click(function(){
		$('html, body').animate({scrollTop : 0}, 850, 'easeInOutExpo');
		return false;
	});

	CELYN.pageTransition();

	$(window).scroll(function(event) {
	    CELYN.disableHover();
	    CELYN.scrollDownParallax();

		var startScroll = true;
	    var st = $(this).scrollTop();
	    var darkBgOffset = $('.darkBg').offset();
	    var lightBgOffset = $('.lightBg').offset();

	    if(st >= 600){
	    	$('#scrolltop').css({'bottom':'8%', 'opacity':'1'});
	    } else {
	    	$('#scrolltop').css({'bottom':'-50px','opacity':'0'});
	    }
	    if( st > (darkBgOffset.top) ){
	    	$('.name').addClass('darkFont');
	    	if ( st > (lightBgOffset.top - 150) ) {
	    		$('.name').removeClass('darkFont');
		    }
	    } else {
	    	$('.name').removeClass('darkFont');
	    }
	});
	
});



$(window).load(function() {
	CELYN.smoothScroll();
});

$(window).resize(function(){
});




      