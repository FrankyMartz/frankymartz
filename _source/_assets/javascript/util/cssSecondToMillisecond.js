'use strict';
/** =========================================================================
 * CSS Seconds to Millisecond Conversion
 *
 * @author Franky Martinez <frankymartz@gmail.com>
 * @copyright FrankyMartz 2014
 *
 * @param {string} seconds - CSS seconds string
 * @returns {number} CSS second to milisecond conversion
 * ========================================================================== */

module.exports = function(seconds){
	var suffix = seconds.charAt(seconds.length - 1);

	switch (typeof suffix) {
		case 'string':
			seconds = seconds.slice(0,-1);
			break;

		case 'number':
			break;
		
		default:
			return null;
	}

	seconds = parseFloat(seconds) * 1000;
	return seconds;
};

