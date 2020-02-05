(function ($) {
	// "use strict";

	$(document).ready(function () {
		//Navbar Toggler Custom
		$('.second-button').on('click', function () {
			$('.animated-icon2').toggleClass('open');
		});

		//Initialize filterizr with default options
		if ($('.filtr-container').length) {
			$('.filtr-container').filterizr();
		}

		// Adding and removing active class
		$("ul.portfolio-filter li").click(function () {
			$(this).addClass('active').siblings().removeClass('active');
		});

		// click event to scroll to next section
		$('.gonext a').on('click', function (event) {
			var $anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $($anchor.attr('href')).offset().top
			}, 2000);
		});

		//Code for sticky header
		function basticky() {
			var headera = $(".header-area");
			var pos = headera.position();

			var windowpos = $(window).scrollTop();
			if (windowpos >= pos.top) {
				headera.addClass("is-sticky");
			}
			if (windowpos === 0) {
				headera.removeClass("is-sticky");
			}

			/*  HIDE THE SCROLL TOP BUTTON AFTER CERTAIN POINT */
			if (windowpos < 50) {
				$('.scroll_top').fadeOut();
			} else {
				$('.scroll_top').fadeIn();
			}
		}
	
		//jQuery scrollspy for active class in menu item
		$("ul.header-menu li a").addClass('nav-link');
		$('body').scrollspy({
			target: '.navbar-collapse',
			offset: 79
		});

		$("ul.header-menu li a").click(function () {
			$("#headermenu01.show").removeClass('show');
		});
		
		$(window).on('scroll', ()=> {
			//magnify Video Popup
			$('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
				type: 'iframe',
				mainClass: 'mfp-fade',
				preloader: true,
			});
		// magnify image galley popup
		$('.zoom-gallery').magnificPopup({
			delegate: 'a',
			type: 'image',
			closeOnContentClick: false,
			closeBtnInside: false,
			mainClass: 'mfp-with-zoom mfp-img-mobile',
			image: {
				verticalFit: true,
				titleSrc: function (item) {
					return item.el.attr('title') + ' &middot; <a class="image-source-link" href="' + item.el.attr('data-source') + '" target="_blank">image source</a>';
				}
			},
			gallery: {
				enabled: true
			},
			zoom: {
				enabled: true,
				duration: 300, // don't foget to change the duration also in CSS
				opener: function (element) {
					return element.find('img');
				}
			}
		});
	});
	basticky();
	$(window).scroll(basticky);
});

	window.addEventListener('load', function () {
		// Fetch all the forms we want to apply custom Bootstrap validation styles to
		var forms = document.getElementsByClassName('needs-validation');
		// Loop over them and prevent submission
		var validation = Array.prototype.filter.call(forms, function (form) {
			form.addEventListener('submit', function (event) {
				if (form.checkValidity() === false) {
					event.preventDefault();
					event.stopPropagation();
				}
				form.classList.add('was-validated');
			}, false);
		});
	}, false);
	
	var url = window.location.href;
    setInterval(() => {
        var url2 = window.location.href; 
        if(url !== url2){
            url = url2;            
            $(window).scrollTop(0);            

        }
        /* END OF ON LOAD FUNCTION */
    }, 100)

})(jQuery);