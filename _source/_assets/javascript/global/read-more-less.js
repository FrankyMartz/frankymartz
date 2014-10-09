/*jslint browser:true*/
'use strict';
/** =========================================================================
 * Read More or Less
 * React to 'Read More?' links
 *
 * @author Franky Martinez <frankymartz@gmail.com>
 * @version 1.0.0
 * @copyright FrankyMartz 2014
 * ========================================================================== */

// Imports
var $ = require('jquery');


// Local Globals
var icon = {
    more: 'fa-lg fa-chevron-circle-down',
		less: 'fa-lg fa-chevron-circle-up'
};


/**
 * Render Font Awesome icons
 * @return {string} HTML for Font Awesome icon
 */
function fontAwesome() {
	var args = Array.prototype.slice.call(arguments, 0).join(' ');
	return ''.concat(
		'<i class="fa ',
		args,
		'"></i>'
	);
}


/**
 * Escape String for jQuery Selectors
 * @param {string} str - argument to escape
 * @return {string} jQuery safe string for $()
 */
function escapeStr(str) {
	return str.replace(/\b[!"#$%&'()*+,.\/:;<=>?@\[\\\]\^`{|}~]\b/g, "\\$&");
}


/**
 * Reveal .moreless
 * Set to 50rem because anything larger should be
 * re-thought or a separate module.
 *
 * Best for Performance:
 * [data-max-height] - explicit max-height
 *
 * @param {string | object} id - Element or identifier to hide
 */
function showMore(id) {
	var obj = (typeof id === 'string') ? $(id) : id;
	var maxHeight = obj.data('maxHeight') || '50rem';
	obj.css('max-height', maxHeight);
}
module.exports.showMore = showMore;


/**
 * Hide .moreless
 * @param {string | object} id - Element or identifier to hide
 */
function showLess(id) {
	var obj = (typeof id === 'string') ? $(id) : id;
	obj.css('max-height', 0);
}
module.exports.showMore = showLess;


/**
 * Attach click event listener to .more-less--link
 */
$('.more-less--link').each(function(){
	// ".more-less--link": innerHTML
	var moreText = ''.concat(fontAwesome(icon.less), ' Too Long?');
	var lessText = ''.concat(fontAwesome(icon.more), ' Read More?');

	var targetID = $(this).data('toggleMore');
	var target = $(targetID);

	var footnotes = target.find('sup[id^="fnref\\:"]');

	footnotes.each(function(){
		$(this)
			.data('moreLessParent', targetID)
			.data('isHidden', true);
	});

	var that = this;
	// Add Event Handler
	$(this).click(function(){
		var maxHeight = parseInt(target.css('max-height'), 10);
		if (maxHeight > 0) {
			showLess(target);
			$(that).html(lessText);
			footnotes.each(function(){
				$(this).data('isHidden', true);
			});
		}
		else {
			showMore(target);
			$(that).html(moreText);
			footnotes.each(function(){
				$(this).data('isHidden', false);
			});
		}
	});
});


/**
 * Click ".more-less--link" corresponding to footnote ".more-less" parent
 *
 * @param {string} id - valid DOM element identifier
 */
function clickCorrespondingMoreLess(id) {
	var footnote = $(id);
	if (footnote.data('isHidden')) {
		var parentID = footnote.data('moreLessParent');
		$(parentID).siblings('.more-less--link').click();
	}
}


/**
 * Expand corresponding .more-less for .reversefootnote
 */
$('.reversefootnote').click(function(){
	var elementID = escapeStr( $(this).attr('href') );
	clickCorrespondingMoreLess(elementID);
});



/**
 * Expand corresponding .more-less for URL with hash page loads.
 */
(function() {
	if (window.location.hash) {
		var hash = escapeStr(document.URL.substr(document.URL.indexOf('#')));
		clickCorrespondingMoreLess(hash);
	}
}());

