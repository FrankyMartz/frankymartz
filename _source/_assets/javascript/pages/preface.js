'use strict';
/** =========================================================================
 * Foreword
 *
 * @author Franky Martinez <frankymartz@gmail.com>
 * @copyright FrankyMartz 2014
 * ========================================================================== */

var $ = require('jquery');
//var addPrefixEventListener = require('../util/PrefixEventListener');
var secondToMillisecond = require('../util/cssSecondToMillisecond');


/**
 * Image Flip
 * Toggle Classes for CSS3 image 3D flip
 **/
function imageFlip() {
  $('.foreword-fig__side2').toggleClass('js-foreword-fig-side1--flip');
  $('.foreword-fig__side1').toggleClass('js-foreword-fig-side2--flip');
}

// Enable CSS3 image 3D flip on image(s) click
$('.foreword-fig--flip').click(function(){
	imageFlip();
});


// Button
$('.foreword-txt__button').click(function(){
	$('.foreword-txt__button:after').height('100%');
	$(this).fadeOut(400, function(){
		$('.foreword-txt__description').delay(300).fadeIn(400);
	});
	imageFlip();
});
