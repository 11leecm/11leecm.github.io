/*
	Personal Website: http://www.chrismlee.com
	Created with HTML5, CSS3, JavaScript, Skel framework, Font Awesome CSS toolkit, and Formspree.io form submission.
	File: main.js
*/

(function($) {

	var settings = {

		// Speed to load page.
		loadSpeed: 800,

		// Speed to resize panel.
		resizeSpeed: 600,

		// Speed to fade in/out.
		fadeSpeed: 300,

		// Size factor.
		sizeFactor: 11.5,

		// Minimum point size.
		sizeMin: 15,

		// Maximum point size.
		sizeMax: 20
	};

	var $window = $(window);

	$window.on('load', function() {

		skel
			.breakpoints({
				desktop: '(min-width: 737px)',
				mobile: '(max-width: 736px)'
			})
			.viewport({
				breakpoints: {
					desktop: {
						width: 1080,
						scalable: false
					}
				}
			})
			.on('+desktop', function() {

				var	$body = $('body'),
					$main = $('#main'),
					$panels = $main.find('.panel'),
					$hbw = $('html,body,window'),
					$footer = $('#footer'),
					$wrapper = $('#wrapper'),
					$nav = $('#nav'), $nav_links = $nav.find('a'),
					$jumplinks = $('.jumplink'),
					$form = $('form'),
					panels = [],
					activePanelId = null,
					firstPanelId = null,
					isLocked = false,
					hash = window.location.hash.substring(1);

				if (skel.vars.touch) {

					settings.fadeSpeed = 0;
					settings.resizeSpeed = 0;
					$nav_links.find('span').remove();

				}

				// Body.
				$body._resize = function() {
					var factor = ($window.width() * $window.height()) / (1440 * 900);
					$body.css('font-size', Math.min(Math.max(Math.floor(factor * settings.sizeFactor), settings.sizeMin), settings.sizeMax) + 'pt');
					$main.height(panels[activePanelId].outerHeight());
					$body._reposition();
				};

				$body._reposition = function() {
					if (skel.vars.touch && (window.orientation == 0 || window.orientation == 180))
						$wrapper.css('padding-top', Math.max((($window.height() - (panels[activePanelId].outerHeight() + $footer.outerHeight())) / 2) - $nav.height(), 30) + 'px');
					else
						$wrapper.css('padding-top', ((($window.height() - panels[firstPanelId].height()) / 2) - $nav.height()) + 'px');
				};

				// Panels.
				$panels.each(function(i) {
					var t = $(this), id = t.attr('id');

					panels[id] = t;

					if (i == 0) {
						firstPanelId = id;
						activePanelId = id;
					}
					else
						t.hide();

					t._activate = function(instant, activateSamePanel, contactValidate) {

						// Check lock state.
						if (isLocked)
							return false;
							
						// Determine whether we're already at the target.
						if (activePanelId == id && !activateSamePanel) {
							if (samePanel) {
								return false;
							}
						}

						// Lock.
						isLocked = true;

						// Change nav link (if it exists).
						$nav_links.removeClass('active');
						$nav_links.filter('[href="#' + id + '"]').addClass('active');

						// Change hash.
						if (i == 0)
							window.location.hash = '#';
						else
							window.location.hash = '#' + id;

						// Add bottom padding.
						var x = parseInt($wrapper.css('padding-top')) +
								panels[id].outerHeight() +
								$nav.outerHeight() +
								$footer.outerHeight();

						if (x > $window.height())
							$wrapper.addClass('tall');
						else
							$wrapper.removeClass('tall');

						// Fade out active panel.
						$footer.fadeTo(settings.fadeSpeed, 0.0001);
						
						panels[activePanelId].fadeOut(instant ? 0 : settings.fadeSpeed, function() {
						
							// Set new active.
							activePanelId = id;
							
							// Force scroll to top.
							$hbw.animate({
								scrollTop: 0
							}, settings.resizeSpeed, 'swing');

							// Reposition.
							$body._reposition();
							
							// Contact Form Validation
							if (contactValidate) {
								$('.contact_error').hide();
								var name = $("#contact_name").val();
								var email = $("#contact_email").val();
								var subject = $("#contact_subject").val();
								var message = $("#contact_message").val();
								if (name == "") {
									$("#contact_name_error").show();
									errorsPresent = true;
								}
								if (subject == "") {
									$("#contact_subject_error").show();
									errorsPresent = true;
								}
								if (email == "") {
									$("#contact_email_error").show();
									errorsPresent = true;
								}
								if (message == "") {
									$("#contact_message_error").show();
									errorsPresent = true;
								}
							}

							// Resize main to height of new panel.
							$main.animate({
								height: panels[activePanelId].outerHeight()
							}, instant ? 0 : settings.resizeSpeed, 'swing', function() {

								// Fade in new active panel.
								$footer.fadeTo(instant ? 0 : settings.fadeSpeed, 1.0);
								panels[activePanelId].fadeIn(instant ? 0 : settings.fadeSpeed, function() {

									// Unlock.
									isLocked = false;

								});
							});

						});
					};
				});

				// Nav + Jumplinks.
				$nav_links.add($jumplinks).click(function(e) {
					var t = $(this), href = t.attr('href'), id;

					if (href.substring(0,1) == '#') {

						e.preventDefault();
						e.stopPropagation();

						id = href.substring(1);

						if (id in panels)
							panels[id]._activate(false, false, false);

					}

				});

				// Window.
				$window
					.resize(function() {

						if (!isLocked)
							$body._resize();

					});

				$window
					.on('orientationchange', function() {

						if (!isLocked)
							$body._reposition();

					});

				if (skel.vars.IEVersion < 9)
					$window
						.on('resize', function() {
							$wrapper.css('min-height', $window.height());
						});

				// Fix: Placeholder polyfill.
				$('form').placeholder();

				// Prioritize "important" elements on mobile.
				skel.on('+mobile -mobile', function() {
					$.prioritize(
						'.important\\28 mobile\\29',
						skel.breakpoint('mobile').active
					);
				});

				// CSS polyfills (IE<9).
				if (skel.vars.IEVersion < 9)
					$(':last-child').addClass('last-child');

					
				// Init.
				$('.contact_error').hide();
				$window
					.trigger('resize');

				if (hash && hash in panels)
					panels[hash]._activate(true, false, false);

				$wrapper.fadeTo(settings.loadSpeed, 1.0);
					
				// Contact Form
				$("#contact_submit").click(function(e) {
					e.preventDefault();
					e.stopPropagation();
					// Form Processing
						var name = $("#contact_name").val();
						var email = $("#contact_email").val();
						var subject = $("#contact_subject").val();
						var message = $("#contact_message").val();
						if (name == "" || subject == "" || email == "" || message == "") {
							panels["contact"]._activate(false, true, true);
						} else {
							var dataString = 'name=' + name + '&email=' + email + '&subject=' + subject + '&message=' + message;
							$.ajax({
								type: "POST",
								url: "//formspree.io/minirocket1@gmail.com",
								data: dataString,
								dataType: "json",
								success: function(msg) {
									panels["contact_submit_success"]._activate(false, true, false);
									$("#contact_form")[0].reset();
									$('.contact_error').hide();
								},
								error: function() {
									panels["contact_submit_failure"]._activate(false, true, false);
								}
							});
						}
				});

			})
			.on('-desktop', function() {
				window.setTimeout(function() {
					location.reload(true);
				}, 50);
			})
			.on('+mobile', function() {
				// Init.
				$('.contact_error').hide();
				$('#contact_submit_success').hide();
				$('#contact_submit_failure').hide();
					
				// Contact Form
				$("#contact_submit").click(function(e) {
					e.preventDefault();
					e.stopPropagation();
					$('.contact_error').hide();
					var errorsPresent = false;
					var name = $("#contact_name").val();
					var email = $("#contact_email").val();
					var subject = $("#contact_subject").val();
					var message = $("#contact_message").val();
					if (name == "") {
						$("#contact_name_error").show();
						errorsPresent = true;
					}
					if (subject == "") {
						$("#contact_subject_error").show();
						errorsPresent = true;
					}
					if (email == "") {
						$("#contact_email_error").show();
						errorsPresent = true;
					}
					if (message == "") {
						$("#contact_message_error").show();
						errorsPresent = true;
					}
					if (errorsPresent == true) {
						// No action needed on mobile.
					} else {
						var dataString = 'name=' + name + '&email=' + email + '&subject=' + subject + '&message=' + message;
						$.ajax({
							type: "POST",
							url: "//formspree.io/minirocket1@gmail.com",
							data: dataString,
							dataType: "json",
							success: function() {
								$('#contact').hide();
								$('#contact_submit_success').show();
								$("#contact_form")[0].reset();
								$('.contact_error').hide();
							},
							error: function() {
								$('#contact').hide();
								$('#contact_submit_failure').show();
							}
						});
					}
				});
				
				$("#contact_submit_success_return").click(function(e) {
					$('#contact').show();
					$('#contact_submit_success').hide();
				});
				
				$("#contact_submit_failure_return").click(function(e) {
					$('#contact').show();
					$('#contact_submit_failure').hide();
				});
			});
			
	});

})(jQuery);