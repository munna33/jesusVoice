// // $(document).ready(function () {
// //   var trigger = $('.hamburger'),
// //       overlay = $('.overlay'),
// //      isClosed = false;

// //     trigger.click(function () {
// //       hamburger_cross();      
// //     });
// //     function hamburger_cross() {

// //       if (isClosed == true) {          
// //         overlay.hide();
// //         trigger.removeClass('is-open');
// //         trigger.addClass('is-closed');
// //         isClosed = false;
// //       } else {   
// //         overlay.show();
// //         trigger.removeClass('is-closed');
// //         trigger.addClass('is-open');
// //         isClosed = true;
// //       }
// //   }
  
// //   $('[data-toggle="offcanvas"]').click(function () {
// //         $('#wrapper').toggleClass('toggled');
// //   });  
// // });



// $(function(){
//     $('.button-checkbox').each(function(){
//     	var $widget = $(this),
// 			$button = $widget.find('button'),
// 			$checkbox = $widget.find('input:checkbox'),
// 			color = $button.data('color'),
// 			settings = {
// 					on: {
// 						icon: 'glyphicon glyphicon-check'
// 					},
// 					off: {
// 						icon: 'glyphicon glyphicon-unchecked'
// 					}
// 			};

// 		$button.on('click', function () {
// 			$checkbox.prop('checked', !$checkbox.is(':checked'));
// 			$checkbox.triggerHandler('change');
// 			updateDisplay();
// 		});

// 		$checkbox.on('change', function () {
// 			updateDisplay();
// 		});

// 		function updateDisplay() {
// 			var isChecked = $checkbox.is(':checked');
// 			// Set the button's state
// 			$button.data('state', (isChecked) ? "on" : "off");

// 			// Set the button's icon
// 			$button.find('.state-icon')
// 				.removeClass()
// 				.addClass('state-icon ' + settings[$button.data('state')].icon);

// 			// Update the button's color
// 			if (isChecked) {
// 				$button
// 					.removeClass('btn-default')
// 					.addClass('btn-' + color + ' active');
// 			} 
//             else 
//             { 
//                 $button
// 					.removeClass('btn-' + color + ' active')
// 					.addClass('btn-default');
// 			}
// 		}
// 		function init() {
// 			updateDisplay();
// 			// Inject the icon if applicable
// 			if ($button.find('.state-icon').length == 0) {
// 				$button.prepend('<i class="state-icon ' + settings[$button.data('state')].icon + '"></i> ');
// 			}
// 		}
// 		init();
// 	});
// });
var $item = $('.carousel .item'); 
var $wHeight = $(window).height();
$item.eq(0).addClass('active');
$item.height($wHeight); 
$item.addClass('full-screen');

$('.carousel img').each(function() {
  var $src = $(this).attr('src');
  var $color = $(this).attr('data-color');
  $(this).parent().css({
    'background-image' : 'url(' + $src + ')',
    'background-color' : $color
  });
  $(this).remove();
});

$(window).on('resize', function (){
  $wHeight = $(window).height();
  $item.height($wHeight);
});

$('.carousel').carousel({
  interval: 6000,
  pause: "false"
});