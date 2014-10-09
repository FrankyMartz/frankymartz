'use strict';
/** =========================================================================
 * Preface
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
  $('.preface-fig__side2').toggleClass('js-preface-fig-side1--flip');
  $('.preface-fig__side1').toggleClass('js-preface-fig-side2--flip');
}


/**
 * Preface Button
 */
$('.preface-txt__button').click(function(){

	$('.preface-txt__button:after').height('100%');

	// Button Fade out
	$(this).fadeTo(400,0);
	imageFlip();
	$('.preface-txt__description').delay(700).queue(function(){
		$(this).css('max-height', '43rem').dequeue();
	});
	$(this).delay(800).queue(function(){
			$(this).hide().dequeue();
	});

	// Enable CSS3 image 3D flip on image(s) click
	$('.preface-fig--flip').click(function(){ imageFlip(); }).css('cursor', 'pointer');

	return false;
});

