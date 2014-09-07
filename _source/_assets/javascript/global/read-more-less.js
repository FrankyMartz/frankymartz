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
 * Attach click event listener to .more-less--link
 */
$('.more-less--link').each(function(){
	var that = this;
	// more-less--link html
	var more = ''.concat(fontAwesome(icon.less), ' Too Long?');
	var less = ''.concat(fontAwesome(icon.more), ' Read More?');
	// Add Event Handler
	$(this).click(function(){
		var mlBlock = $( $(that).data('toggleMore') );
		var mlBlockChildren = mlBlock.find('sup[id^="fnref\\:"]');

		if (mlBlock.is(':visible')) {
			mlBlockChildren.each(function(){
				$(this).css('display', 'none');
			});
			mlBlock.hide(400);
			$(that).html(less);
		}
		else {
			mlBlockChildren.each(function(){
				$(this).css('display', 'inline-block');
			});
			mlBlock.show(400);
			$(that).html(more);
		}
	});
});


/**
 * Traverse fnRefString ancestors to locate and click corresponding
 * .more-less--link
 *
 * @param {string} fnRefString - valid DOM element identifier
 */
function clickCorrespondingMoreLess(fnRefString) {
	var fnRef = $( fnRefString );
	if (fnRef.is(':hidden')) {
		fnRef.closest('.more-less').siblings('.more-less--link').click();
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

